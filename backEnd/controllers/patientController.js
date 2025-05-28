const axios = require('axios');
const crypto = require('crypto');
const { pool } = require('../config/db');
const { encryptPII, decryptPII } = require('../utils/encryption');

class PatientController { 
  static async ensurePatientProfileTableExists() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_profiles (
          id SERIAL PRIMARY KEY,
          patient_id TEXT UNIQUE NOT NULL,
          name TEXT,
          sex TEXT,
          occupation TEXT,
          alcohol_use TEXT,
          tobacco_use TEXT,
          blood_group TEXT,
          other_history TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_allergies (
          id SERIAL PRIMARY KEY,
          patient_id TEXT NOT NULL,
          name TEXT NOT NULL,
          severity TEXT,
          reaction TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patient_profiles(patient_id) ON DELETE CASCADE
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_medical_conditions (
          id SERIAL PRIMARY KEY,
          patient_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patient_profiles(patient_id) ON DELETE CASCADE
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_medications (
          id SERIAL PRIMARY KEY,
          patient_id TEXT NOT NULL,
          name TEXT NOT NULL,
          dosage TEXT,
          frequency TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patient_profiles(patient_id) ON DELETE CASCADE
        );
      `);

      console.log('✅ Patient profile tables verified');
    } catch (err) {
      console.error('❌ Patient profile table creation error:', err.message);
      throw err;
    }
  }
  static async getPrescriptions(req, res) {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    try {
      // Query blockchain for patient asset
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID,
          chaincodeid: process.env.CHAINCODE_ID,
          function: "ReadAsset",
          args: patientId,
        },
      });

      if (!response.data || response.data.error) {
        return res.status(404).json({
          success: false,
          error: "Prescription not found",
        });
      }

      // Parse blockchain response
      const asset = PatientController._parseBlockchainResponse(response.data, patientId);
      if (!asset.success) {
        return res.status(asset.status).json({
          success: false,
          error: asset.error,
          details: asset.details
        });
      }

      // Transform prescriptions to API format
      const prescriptions = PatientController._formatPrescriptions(asset.data);

      return res.status(200).json({
        success: true,
        data: {
          patientId,
          patientName: asset.data.PatientName || "N/A",
          dateOfBirth: asset.data.DateOfBirth || "N/A",
          prescriptions,
        },
      });
    } catch (error) {
      console.error("Prescription retrieval error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve prescriptions",
        details: error.response?.data || error.message,
      });
    }
  }

  static async getPrescriptionHistory(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ 
        error: "Patient ID is required",
        success: false
      });
    }

    try {
      // Query blockchain for asset history
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL || 'http://localhost:45000'}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID || 'mychannel',
          chaincodeid: process.env.CHAINCODE_ID || 'basic',
          function: "GetAssetHistory",
          args: patientId,
        },
      });

      if (!response.data || response.data.error) {
        return res.status(404).json({
          success: false,
          error: "Prescription history not found",
        });
      }

      // Parse blockchain response
      const historyData = PatientController._parseBlockchainResponse(response.data);
      if (!historyData.success) {
        return res.status(500).json({
          success: false,
          error: historyData.error,
          details: historyData.details,
        });
      }

      // Format prescription history
      const history = historyData.data.map(record => ({
        timestamp: record.timestamp,
        txId: record.txId,
        patientName: record.patientName || "N/A",
        doctorId: record.doctorId,
        lastUpdated: record.lastUpdated,
        prescriptions: PatientController._formatPrescriptions(record.prescriptions || [])
      }));

      return res.status(200).json({
        success: true,
        data: {
          patientId,
          historyCount: history.length,
          history
        }
      });
    } catch (error) {
      console.error("Prescription history retrieval error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve prescription history",
        details: error.response?.data || error.message,
      });
    }
  }

  static _parseBlockchainResponse(rawData, patientId = null) {
    try {
      // Extract JSON from prefixed response strings
      if (typeof rawData === "string" && rawData.startsWith("Response: ")) {
        rawData = rawData.replace("Response: ", "").trim();
      }

      const parsedData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      // Handle array responses (find specific patient asset)
      if (Array.isArray(parsedData) && patientId) {
        const asset = parsedData.find(entry => entry.PatientId === patientId);
        if (!asset) {
          return {
            success: false,
            status: 404,
            error: "No valid prescription found"
          };
        }
        return { success: true, data: asset };
      }

      // Handle single object or array responses
      if (typeof parsedData === 'object') {
        return { success: true, data: parsedData };
      }

      return {
        success: false,
        status: 500,
        error: "Unexpected response format from blockchain"
      };
    } catch (err) {
      return {
        success: false,
        status: 500,
        error: "Failed to parse blockchain response",
        details: err.message
      };
    }
  }

  static _formatPrescriptions(data) {
    const prescriptions = data?.Prescriptions || data || [];
    
    if (!Array.isArray(prescriptions)) {
      return [];
    }

    return prescriptions.map(prescription => ({
      prescriptionId: prescription.PrescriptionId || 
                     prescription.prescriptionId || 
                     crypto.randomBytes(8).toString('hex'),
      medicationName: prescription.MedicationName || prescription.medicationName || "Unknown",
      dosage: prescription.Dosage || prescription.dosage || "N/A",
      instructions: prescription.Instructions || prescription.instructions || "N/A",
      diagnosis: prescription.Diagnosis || prescription.diagnosis || "N/A",
      status: prescription.Status || prescription.status || "Active",
      createdBy: prescription.CreatedBy || prescription.createdBy || "N/A",
      timestamp: prescription.Timestamp || prescription.timestamp || new Date().toISOString(),
      expiryDate: prescription.ExpiryDate || prescription.expiryDate || "",
      dispensingPharmacist: prescription.DispensingPharmacist || prescription.dispensingPharmacist || "",
      dispensingTimestamp: prescription.DispensingTimestamp || prescription.dispensingTimestamp || "",
      txId: prescription.TxID || prescription.txId || ""
    }));
  }

  static async getPatientProfile(req, res) {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ 
        success: false,
        error: "Patient ID is required" 
      });
    }

    try {
      // Ensure tables exist
      await PatientController.ensurePatientProfileTableExists();

      // Get patient profile
      const profileResult = await pool.query(
        'SELECT * FROM patient_profiles WHERE patient_id = $1',
        [patientId]
      );

      if (profileResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Patient profile not found"
        });
      }      const profile = profileResult.rows[0];

      // Get allergies
      const allergiesResult = await pool.query(
        'SELECT id, name, severity, reaction FROM patient_allergies WHERE patient_id = $1 ORDER BY created_at DESC',
        [patientId]
      );

      // Get medical conditions
      const conditionsResult = await pool.query(
        'SELECT id, name, description FROM patient_medical_conditions WHERE patient_id = $1 ORDER BY created_at DESC',
        [patientId]
      );

      // Get medications
      const medicationsResult = await pool.query(
        'SELECT id, name, dosage, frequency FROM patient_medications WHERE patient_id = $1 ORDER BY created_at DESC',
        [patientId]
      );

      // Decrypt sensitive profile data
      const decryptedProfile = {
        id: patientId,
        name: await decryptPII(profile.name) || profile.name,
        sex: profile.sex, // Sex is not encrypted as it's less sensitive
        occupation: profile.occupation,
        alcoholUse: profile.alcohol_use,
        tobaccoUse: profile.tobacco_use,
        bloodGroup: profile.blood_group,
        otherHistory: await decryptPII(profile.other_history) || profile.other_history
      };

      // Decrypt allergies
      const decryptedAllergies = await Promise.all(
        allergiesResult.rows.map(async (allergy) => ({
          id: allergy.id,
          name: await decryptPII(allergy.name) || allergy.name,
          severity: allergy.severity,
          reaction: await decryptPII(allergy.reaction) || allergy.reaction
        }))
      );

      // Decrypt medical conditions  
      const decryptedConditions = await Promise.all(
        conditionsResult.rows.map(async (condition) => ({
          id: condition.id,
          name: await decryptPII(condition.name) || condition.name,
          description: await decryptPII(condition.description) || condition.description
        }))
      );

      // Decrypt medications
      const decryptedMedications = await Promise.all(
        medicationsResult.rows.map(async (medication) => ({
          id: medication.id,
          name: await decryptPII(medication.name) || medication.name,
          dosage: await decryptPII(medication.dosage) || medication.dosage,
          frequency: await decryptPII(medication.frequency) || medication.frequency
        }))
      );

      return res.status(200).json({
        success: true,
        data: {
          ...decryptedProfile,
          allergies: decryptedAllergies,
          medicalConditions: decryptedConditions,
          currentMedications: decryptedMedications
        }
      });
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve patient profile",
        details: error.message
      });
    }
  }
  static async updatePatientProfile(req, res) {
    const { patientId, name, sex, occupation, alcoholUse, tobaccoUse, bloodGroup, otherHistory, allergies, medicalConditions, currentMedications } = req.body;

    if (!patientId) {
      return res.status(400).json({ 
        success: false,
        error: "Patient ID is required" 
      });
    }

    console.log(`[PATIENT PROFILE] Processing profile save for patient ID: ${patientId}`);

    try {
      // Ensure tables exist
      await PatientController.ensurePatientProfileTableExists();
      
      // Begin transaction
      const client = await pool.connect();
      let isNewProfile = false;
      
      try {
        await client.query('BEGIN');

        // Encrypt sensitive data before storing
        const encryptedName = name ? await encryptPII(name) : null;
        const encryptedOtherHistory = otherHistory ? await encryptPII(otherHistory) : null;

        // Check if profile exists
        const profileExists = await client.query(
          'SELECT 1 FROM patient_profiles WHERE patient_id = $1',
          [patientId]
        );

        if (profileExists.rows.length === 0) {
          // Create new profile
          console.log(`[PATIENT PROFILE] Creating new profile for patient ID: ${patientId}`);
          isNewProfile = true;
          
          await client.query(
            `INSERT INTO patient_profiles (patient_id, name, sex, occupation, alcohol_use, tobacco_use, blood_group, other_history)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [patientId, encryptedName, sex, occupation, alcoholUse, tobaccoUse, bloodGroup, encryptedOtherHistory]
          );
        } else {
          // Update existing profile but preserve name and sex from eSignet if they exist
          console.log(`[PATIENT PROFILE] Updating existing profile for patient ID: ${patientId}`);
          
          // Get existing profile data
          const existingProfile = await client.query(
            'SELECT name, sex FROM patient_profiles WHERE patient_id = $1',
            [patientId]
          );
          
          // Use existing name and sex if they exist (from eSignet), otherwise use encrypted new values
          const existingName = existingProfile.rows[0].name;
          const existingSex = existingProfile.rows[0].sex;
          
          await client.query(
            `UPDATE patient_profiles 
             SET name = $2, sex = $3, occupation = $4, alcohol_use = $5, tobacco_use = $6, blood_group = $7, other_history = $8, updated_at = CURRENT_TIMESTAMP
             WHERE patient_id = $1`,
            [patientId, existingName || encryptedName, existingSex || sex, occupation, alcoholUse, tobaccoUse, bloodGroup, encryptedOtherHistory]
          );
        }

        // Clear existing allergies and add new ones
        console.log(`[PATIENT PROFILE] Updating allergies for patient ID: ${patientId}`);
        await client.query('DELETE FROM patient_allergies WHERE patient_id = $1', [patientId]);
        if (allergies && allergies.length > 0) {
          for (const allergy of allergies) {
            const encryptedAllergyName = await encryptPII(allergy.name);
            const encryptedReaction = allergy.reaction ? await encryptPII(allergy.reaction) : null;
            
            await client.query(
              `INSERT INTO patient_allergies (patient_id, name, severity, reaction)
               VALUES ($1, $2, $3, $4)`,
              [patientId, encryptedAllergyName, allergy.severity, encryptedReaction]
            );
          }
        }

        // Clear existing medical conditions and add new ones
        console.log(`[PATIENT PROFILE] Updating medical conditions for patient ID: ${patientId}`);
        await client.query('DELETE FROM patient_medical_conditions WHERE patient_id = $1', [patientId]);
        if (medicalConditions && medicalConditions.length > 0) {
          for (const condition of medicalConditions) {
            const encryptedConditionName = await encryptPII(condition.name);
            const encryptedDescription = condition.description ? await encryptPII(condition.description) : null;
            
            await client.query(
              `INSERT INTO patient_medical_conditions (patient_id, name, description)
               VALUES ($1, $2, $3)`,
              [patientId, encryptedConditionName, encryptedDescription]
            );
          }
        }

        // Clear existing medications and add new ones
        console.log(`[PATIENT PROFILE] Updating current medications for patient ID: ${patientId}`);
        await client.query('DELETE FROM patient_medications WHERE patient_id = $1', [patientId]);
        if (currentMedications && currentMedications.length > 0) {
          for (const medication of currentMedications) {
            const encryptedMedicationName = await encryptPII(medication.name);
            const encryptedDosage = medication.dosage ? await encryptPII(medication.dosage) : null;
            const encryptedFrequency = medication.frequency ? await encryptPII(medication.frequency) : null;
            
            await client.query(
              `INSERT INTO patient_medications (patient_id, name, dosage, frequency)
               VALUES ($1, $2, $3, $4)`,
              [patientId, encryptedMedicationName, encryptedDosage, encryptedFrequency]
            );
          }
        }

        await client.query('COMMIT');
        
        const actionType = isNewProfile ? 'created' : 'updated';
        console.log(`[PATIENT PROFILE] Successfully ${actionType} profile for patient ID: ${patientId}`);

        return res.status(200).json({
          success: true,
          message: `Patient profile ${actionType} successfully`,
          isNewProfile: isNewProfile
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`[PATIENT PROFILE] Error saving profile for patient ID: ${patientId}`, error);
      return res.status(500).json({
        success: false,
        error: "Failed to save patient profile",
        details: error.message
      });
    }
  }
  
  // NEW METHOD: Create new patient profile only
  static async createPatientProfile(req, res) {
    const { patientId, name, sex, occupation, alcoholUse, tobaccoUse, bloodGroup, otherHistory, allergies, medicalConditions, currentMedications } = req.body;

    if (!patientId) {
      return res.status(400).json({ 
        success: false,
        error: "Patient ID is required" 
      });
    }

    console.log(`[PATIENT PROFILE] Creating new profile for patient ID: ${patientId}`);

    try {
      // Ensure tables exist
      await PatientController.ensurePatientProfileTableExists();
      
      // Begin transaction
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');

        // Check if profile already exists
        const profileExists = await client.query(
          'SELECT 1 FROM patient_profiles WHERE patient_id = $1',
          [patientId]
        );

        if (profileExists.rows.length > 0) {
          await client.query('ROLLBACK');
          return res.status(409).json({
            success: false,
            error: "Patient profile already exists. Use update endpoint instead."
          });
        }

        // Encrypt sensitive data before storing
        const encryptedName = name ? await encryptPII(name) : null;
        const encryptedOtherHistory = otherHistory ? await encryptPII(otherHistory) : null;

        // Create new profile
        await client.query(          `INSERT INTO patient_profiles (patient_id, name, sex, occupation, alcohol_use, tobacco_use, blood_group, other_history)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [patientId, encryptedName, sex, occupation, alcoholUse, tobaccoUse, bloodGroup, encryptedOtherHistory]
        );

        // Add allergies
        if (allergies && allergies.length > 0) {
          for (const allergy of allergies) {
            const encryptedAllergyName = await encryptPII(allergy.name);
            const encryptedReaction = allergy.reaction ? await encryptPII(allergy.reaction) : null;
            
            await client.query(
              `INSERT INTO patient_allergies (patient_id, name, severity, reaction)
               VALUES ($1, $2, $3, $4)`,
              [patientId, encryptedAllergyName, allergy.severity, encryptedReaction]
            );
          }
        }

        // Add medical conditions
        if (medicalConditions && medicalConditions.length > 0) {
          for (const condition of medicalConditions) {
            const encryptedConditionName = await encryptPII(condition.name);
            const encryptedDescription = condition.description ? await encryptPII(condition.description) : null;
            
            await client.query(
              `INSERT INTO patient_medical_conditions (patient_id, name, description)
               VALUES ($1, $2, $3)`,
              [patientId, encryptedConditionName, encryptedDescription]
            );
          }
        }

        // Add medications
        if (currentMedications && currentMedications.length > 0) {
          for (const medication of currentMedications) {
            const encryptedMedicationName = await encryptPII(medication.name);
            const encryptedDosage = medication.dosage ? await encryptPII(medication.dosage) : null;
            const encryptedFrequency = medication.frequency ? await encryptPII(medication.frequency) : null;
            
            await client.query(
              `INSERT INTO patient_medications (patient_id, name, dosage, frequency)
               VALUES ($1, $2, $3, $4)`,
              [patientId, encryptedMedicationName, encryptedDosage, encryptedFrequency]
            );
          }
        }

        await client.query('COMMIT');
        console.log(`[PATIENT PROFILE] Successfully created profile for patient ID: ${patientId}`);

        return res.status(201).json({
          success: true,
          message: "Patient profile created successfully",
          isNewProfile: true
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`[PATIENT PROFILE] Error creating profile for patient ID: ${patientId}`, error);
      return res.status(500).json({
        success: false,
        error: "Failed to create patient profile",
        details: error.message
      });
    }
  }

  // NEW METHOD: Update existing patient profile only
  static async updatePatientProfileOnly(req, res) {
    const { patientId, name, sex, occupation, alcoholUse, tobaccoUse, bloodGroup, otherHistory, allergies, medicalConditions, currentMedications } = req.body;

    if (!patientId) {
      return res.status(400).json({ 
        success: false,
        error: "Patient ID is required" 
      });
    }

    console.log(`[PATIENT PROFILE] Updating existing profile for patient ID: ${patientId}`);

    try {
      // Ensure tables exist
      await PatientController.ensurePatientProfileTableExists();
      
      // Begin transaction
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');

        // Check if profile exists
        const profileExists = await client.query(
          'SELECT 1 FROM patient_profiles WHERE patient_id = $1',
          [patientId]
        );

        if (profileExists.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({
            success: false,
            error: "Patient profile not found. Use create endpoint instead."
          });
        }

        // Encrypt sensitive data before storing
        const encryptedName = name ? await encryptPII(name) : null;
        const encryptedOtherHistory = otherHistory ? await encryptPII(otherHistory) : null;

        // Get existing profile data to preserve eSignet data
        const existingProfile = await client.query(
          'SELECT name, sex FROM patient_profiles WHERE patient_id = $1',
          [patientId]
        );
        
        // Use existing name and sex if they exist (from eSignet), otherwise use encrypted new values
        const existingName = existingProfile.rows[0].name;
        const existingSex = existingProfile.rows[0].sex;

        // Update profile
        await client.query(
          `UPDATE patient_profiles 
           SET name = $2, sex = $3, occupation = $4, alcohol_use = $5, tobacco_use = $6, blood_group = $7, other_history = $8, updated_at = CURRENT_TIMESTAMP
           WHERE patient_id = $1`,
          [patientId, existingName || encryptedName, existingSex || sex, occupation, alcoholUse, tobaccoUse, bloodGroup, encryptedOtherHistory]
        );

        // Clear and update allergies
        await client.query('DELETE FROM patient_allergies WHERE patient_id = $1', [patientId]);
        if (allergies && allergies.length > 0) {
          for (const allergy of allergies) {
            const encryptedAllergyName = await encryptPII(allergy.name);
            const encryptedReaction = allergy.reaction ? await encryptPII(allergy.reaction) : null;
            
            await client.query(
              `INSERT INTO patient_allergies (patient_id, name, severity, reaction)
               VALUES ($1, $2, $3, $4)`,
              [patientId, encryptedAllergyName, allergy.severity, encryptedReaction]
            );
          }
        }

        // Clear and update medical conditions
        await client.query('DELETE FROM patient_medical_conditions WHERE patient_id = $1', [patientId]);
        if (medicalConditions && medicalConditions.length > 0) {
          for (const condition of medicalConditions) {
            const encryptedConditionName = await encryptPII(condition.name);
            const encryptedDescription = condition.description ? await encryptPII(condition.description) : null;
            
            await client.query(
              `INSERT INTO patient_medical_conditions (patient_id, name, description)
               VALUES ($1, $2, $3)`,
              [patientId, encryptedConditionName, encryptedDescription]
            );
          }
        }

        // Clear and update medications
        await client.query('DELETE FROM patient_medications WHERE patient_id = $1', [patientId]);
        if (currentMedications && currentMedications.length > 0) {
          for (const medication of currentMedications) {
            const encryptedMedicationName = await encryptPII(medication.name);
            const encryptedDosage = medication.dosage ? await encryptPII(medication.dosage) : null;
            const encryptedFrequency = medication.frequency ? await encryptPII(medication.frequency) : null;
            
            await client.query(
              `INSERT INTO patient_medications (patient_id, name, dosage, frequency)
               VALUES ($1, $2, $3, $4)`,
              [patientId, encryptedMedicationName, encryptedDosage, encryptedFrequency]
            );
          }
        }

        await client.query('COMMIT');
        console.log(`[PATIENT PROFILE] Successfully updated profile for patient ID: ${patientId}`);

        return res.status(200).json({
          success: true,
          message: "Patient profile updated successfully",
          isNewProfile: false
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`[PATIENT PROFILE] Error updating profile for patient ID: ${patientId}`, error);
      return res.status(500).json({
        success: false,
        error: "Failed to update patient profile",
        details: error.message
      });
    }
  }
}

module.exports = PatientController;