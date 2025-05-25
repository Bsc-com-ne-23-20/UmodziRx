const axios = require('axios');
const { URLSearchParams } = require('url');
const dotenv = require('dotenv');
const jwkToPem = require('jwk-to-pem');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

dotenv.config();

// Import blockchain utilities
const { processBlockchainResponse, queryBlockchainWithRetries } = require('../utils/blockchainUtils');

const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION_SEC || '300', 10);

// Initialize private key for JWT signing
let PRIVATE_KEY_PEM;
try {
  const PRIVATE_KEY_JWK = JSON.parse(process.env.PRIVATE_KEY_JWK);
  PRIVATE_KEY_PEM = jwkToPem(PRIVATE_KEY_JWK, { private: true });
} catch (error) {
  console.error('[AUTH] Failed to initialize private key:', error);
  process.exit(1);
}

// Helper function to decode JWT
const decodeJWT = (token) => {
  const [header, payload] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString()),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString()),
  };
};

// Create client assertion JWT
const createClientAssertion = async () => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: process.env.CLIENT_ID,
    sub: process.env.CLIENT_ID,
    aud: `${process.env.ISSUER}${process.env.TOKEN_PATH}`,
    jti: crypto.randomBytes(16).toString('hex'),
    exp: now + TOKEN_EXPIRATION,
    iat: now
  };
  return jwt.sign(payload, PRIVATE_KEY_PEM, { algorithm: 'RS256' });
};

class PharmacistController {
  static async veripatient(req, res) {
    const { code, state } = req.query;
    
    try {
      if (!code) {
        throw new Error('Authorization code required');
      }

      // Exchange authorization code for tokens
      const clientAssertion = await createClientAssertion();
      const tokenResponse = await axios.post(
        `${process.env.ISSUER}${process.env.TOKEN_PATH}`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.CLIENT_ID,
          client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
          client_assertion: clientAssertion,
          redirect_uri: process.env.PHARMACIST_REDIRECT_URI
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      // Get user info using access token
      const userInfoResponse = await axios.get(
        `${process.env.ISSUER}${process.env.USERINFO_PATH}`,
        { headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` } }
      );

      // Decode user info (assuming it's a JWT)
      const userInfo = decodeJWT(userInfoResponse.data).payload;

      // Prepare patient data
      const patient = {
        id: userInfo.phone_number || userInfo.sub,
        name: userInfo.name || 'Verified Patient',
        birthday: userInfo.birthdate || 'N/A'
      };

      // Encode patient data for URL
      const encodedPatient = Buffer.from(JSON.stringify(patient)).toString('base64');
      
      // Redirect back to pharmacist dashboard with patient data
      const redirectUrl = new URL(process.env.PHARMACIST_FRONTEND_URL);
      redirectUrl.searchParams.append('patient', encodedPatient);
      
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('[AUTH] Patient verification error:', error);
      return res.redirect(`${process.env.FRONTEND_ERROR_PATH}?error=authentication_failed`);
    }
  }

  static async getPrescriptions(req, res) {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ 
        error: "Patient ID is required",
        success: false
      });
    }

    try {
      // Query blockchain for prescriptions using the correct function
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL || 'http://localhost:45000'}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID || 'mychannel',
          chaincodeid: process.env.CHAINCODE_ID || 'basic',
          function: "ReadAsset",
          args: patientId,
        },
      });

      // Log the raw response for debugging
      console.log(`Raw blockchain response for patient ${patientId}:`, response.data);
      
      // Check for "does not exist" error in the raw data
      if (typeof response.data === "string" && response.data.includes("does not exist")) {
        // This is not an error - it just means the patient has no prescriptions
        return res.status(200).json({
          success: true,
          message: "No prescriptions found for this patient",
          data: {
            patientId: patientId,
            patientName: "Unknown",
            prescriptions: []
          }
        });
      }

      // Process the response
      let asset;
      try {
        asset = processBlockchainResponse(response.data);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to parse blockchain response",
          details: err.message,
          rawResponse: typeof response.data === 'string' 
            ? response.data.substring(0, 200) 
            : 'non-string response'
        });
      }

      // Format prescriptions
      const prescriptions = [];
      let patientName = "N/A";
      
      if (asset) {
        patientName = asset.PatientName || "N/A";
        
        if (asset.Prescriptions && Array.isArray(asset.Prescriptions)) {
          asset.Prescriptions.forEach(prescription => {
            prescriptions.push({
              prescriptionId: prescription.PrescriptionId || crypto.randomBytes(8).toString('hex'),
              medicationName: prescription.MedicationName || "Unknown",
              dosage: prescription.Dosage || "N/A",
              instructions: prescription.Instructions || "N/A",
              status: prescription.Status || "Active",
              createdBy: prescription.CreatedBy || asset.DoctorId || "N/A",
              timestamp: prescription.Timestamp || new Date().toISOString(),
              expiryDate: prescription.ExpiryDate || "",
              txId: prescription.TxID || crypto.randomUUID()
            });
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          patientId,
          patientName,
          prescriptions
        }
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve prescriptions",
        details: error.response?.data || error.message,
      });
    }
  }

  static async dispenseMedication(req, res) {
    const { patientId, prescriptionId, pharmacistId, comment } = req.body;

    // Validate request
    if (!patientId || !prescriptionId || !pharmacistId) {
      return res.status(400).json({ 
        error: "Patient ID, Prescription ID, and Pharmacist ID are required",
        success: false
      });
    }

    try {
      // Prepare blockchain request for DispensePrescription
      const requestData = new URLSearchParams();
      requestData.append('channelid', process.env.CHANNEL_ID || 'mychannel');
      requestData.append('chaincodeid', process.env.CHAINCODE_ID || 'basic');
      requestData.append('function', 'DispensePrescription');
      
      // Format args as a JSON object with EXACT field names matching the smart contract
      // The smart contract expects: patientId, prescriptionId, pharmacistId, note
      // Case sensitivity is important!
      const dispensationData = {
        patientId: patientId,           // Field name matches smart contract
        prescriptionId: prescriptionId, // Field name matches smart contract
        pharmacistId: pharmacistId,     // Field name matches smart contract
        note: comment || ""             // Optional dispensing note
      };
      
      // Log the dispensation data for debugging
      console.log(`Dispensation data sent to blockchain: ${JSON.stringify(dispensationData)}`);
      
      // We need to pass a single argument: the JSON string of the dispensationData
      requestData.append('args', JSON.stringify(dispensationData));

      // Send to blockchain
      const blockchainResponse = await axios.post(
        `${process.env.BLOCKCHAIN_API_URL || 'http://localhost:45000'}/invoke`, 
        requestData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      // Log the raw blockchain response for debugging
      console.log(`Raw blockchain response from dispensation: ${JSON.stringify(blockchainResponse.data)}`);

      // Check if the response contains an error
      if (typeof blockchainResponse.data === 'string' && blockchainResponse.data.includes('Error:')) {
        console.error('Blockchain error during dispensation:', blockchainResponse.data);
        return res.status(400).json({
          success: false,
          message: 'Failed to dispense medication',
          error: blockchainResponse.data,
          data: { patientId, prescriptionId, pharmacistId }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Medication dispensed successfully',
        data: {
          patientId,
          prescriptionId,
          pharmacistId,
          txId: blockchainResponse.data.txId || 'unknown',
          dispensedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Dispensation error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      return res.status(500).json({ 
        success: false,
        error: 'Failed to dispense medication',
        details: error.response?.data || error.message,
        request: {
          patientId,
          prescriptionId,
          pharmacistId
        }
      });
    }
  }

  static async getDispenseHistory(req, res) {
    const { pharmacistId } = req.params;

    // Validate request
    if (!pharmacistId) {
      return res.status(400).json({ 
        error: "Pharmacist ID is required",
        success: false
      });
    }

    try {
      // Query blockchain for dispensed prescriptions
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL || 'http://localhost:45000'}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID || 'mychannel',
          chaincodeid: process.env.CHAINCODE_ID || 'basic',
          function: "GetDispenseHistory",
          args: pharmacistId,
        },
      });

      // Process the response
      let historyData;
      try {
        historyData = processBlockchainResponse(response.data);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to parse blockchain response",
          details: err.message,
        });
      }

      // Format dispensed prescriptions
      // This might need adjustment based on what your GetDispenseHistory function returns
      const dispensedPrescriptions = Array.isArray(historyData) ? historyData : [];
      
      const formattedDispenses = dispensedPrescriptions.map(prescription => ({
        prescriptionId: prescription.PrescriptionId,
        patientId: prescription.PatientId,
        patientName: prescription.PatientName || "Unknown",
        medicationName: prescription.MedicationName,
        dosage: prescription.Dosage,
        instructions: prescription.Instructions,
        dispensingTimestamp: prescription.DispensingTimestamp,
        txId: prescription.TxID
      }));

      return res.status(200).json({
        success: true,
        data: {
          pharmacistId,
          dispensedCount: formattedDispenses.length,
          dispensedPrescriptions: formattedDispenses
        }
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve dispense history",
        details: error.response?.data || error.message,
      });
    }
  }
}

module.exports = PharmacistController;