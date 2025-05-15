const axios = require('axios');
const { URLSearchParams } = require('url');
const dotenv = require('dotenv');
const jwkToPem = require('jwk-to-pem');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');



const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION_SEC || '300', 10);
const CODE_EXPIRY_MINUTES = parseInt(process.env.CODE_EXPIRY_MINUTES || '5', 10);

dotenv.config();

const decodeJWT = (token) => {
  const [header, payload] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString()),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString()),
  };
};
let PRIVATE_KEY_PEM;
try {
const PRIVATE_KEY_JWK = JSON.parse(process.env.PRIVATE_KEY_JWK);
PRIVATE_KEY_PEM = jwkToPem(PRIVATE_KEY_JWK, { private: true });
} catch (error) {
console.error('[AUTH] Failed to initialize private key:', error);
process.exit(1);
}

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

class PrescriptionController {
  static async createPrescription(req, res) {
    const { patientId, doctorId, patientName, prescriptions } = req.body;

    // Validate request
    if (!patientId || !doctorId || !patientName || !prescriptions) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { patientId, doctorId, patientName, prescriptions }
      });
    }

    try {
      // Prepare blockchain request
      const requestData = new URLSearchParams();
      requestData.append('channelid', 'mychannel');
      requestData.append('chaincodeid', 'basic');
      requestData.append('function', 'CreateAsset');
      requestData.append('args', patientId);
      requestData.append('args', doctorId);
      requestData.append('args', patientName);
      requestData.append('args', JSON.stringify(prescriptions.map(p => ({
        MedicationName: p.medicationName || p.medication || 'Unknown',
        Dosage: p.dosage,
        Instructions: p.instructions,
        DoctorId: doctorId
      }))));

      // Send to blockchain
      const blockchainResponse = await axios.post(
        'http://localhost:45000/invoke', 
        requestData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      // Return formatted response
      res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: {
          id: patientId,
          doctorId,
          patientId,
          patientName,
          prescriptions: prescriptions.map(p => ({
            medicationName: p.medicationName || p.medication || 'Unknown',
            dosage: p.dosage,
            instructions: p.instructions
          })),
          txId: blockchainResponse.data.txId,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to create prescription',
        details: error.response?.data || error.message
      });
    }
  }

  static async getPrescription(req, res) {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    try {
      // Query blockchain
      const response = await axios.get("http://localhost:45000/query", {
        params: {
          channelid: "mychannel",
          chaincodeid: "basic",
          function: "GetAssetHistory",
          args: patientId,
        },
      });

      // Check if response contains valid data
      if (!response.data || response.data.error) {
        return res.status(404).json({
          success: false,
          error: "Prescription not found",
        });
      }

      let rawData = response.data;
      console.log("proceing query", response.data);

      // If response is a string starting with "Response: ", extract the JSON part
      if (typeof rawData === "string" && rawData.startsWith("Response: ")) {
        rawData = rawData.replace("Response: ", "").trim();
      }

      let historyData;
      try {
        historyData = JSON.parse(rawData); // Attempt JSON parsing
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to parse blockchain response",
          details: err.message,
        });
      }

      // Validate that historyData is an array
      if (!Array.isArray(historyData)) {
        return res.status(500).json({
          success: false,
          error: "Unexpected response format from blockchain",
        });
      }

      // Process prescription history
      const prescriptionsForPatient = [];
      historyData.forEach(entry => {
        if (entry.patientId === patientId && entry.prescriptions) {
          entry.prescriptions.forEach(prescription => {
            prescriptionsForPatient.push({
              medicationName: prescription.MedicationName || "Unknown",
              dosage: prescription.Dosage || "N/A",
              instructions: prescription.Instructions || "N/A",
              doctorId: prescription.DoctorId || "N/A",
              timestamp: prescription.Timestamp ? 
                new Date(prescription.Timestamp.seconds * 1000).toISOString() : 
                new Date().toISOString(),
            });
          });
        }
      });

      if (prescriptionsForPatient.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No valid prescription found",
        });
      }

      // Format the response
      const formattedData = {
        patientId: patientId,
        patientName: historyData[0]?.patientName || "N/A",
        prescriptions: prescriptionsForPatient,
      };

      return res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve prescription",
        details: error.response?.data || error.message,
      });
    }
  }


 
  static  verifypatient = async (req, res) => {
    const { code, state } = req.query;
    console.log("verifypatient at doctor called");
    try {
      if (!code) {
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/auth/error?error=missing_code`);
      }
  
      const clientAssertion = await createClientAssertion();
      const tokenResponse = await axios.post(
        `${process.env.ISSUER}${process.env.TOKEN_PATH}`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.CLIENT_ID,
          client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
          client_assertion: clientAssertion,
          redirect_uri: process.env.DOCTOR_REDIRECT_URI
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const userInfo = decodeJWT(
        (await axios.get(
          `${process.env.ISSUER}${process.env.USERINFO_PATH}`,
          { headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` } }
        )).data
      ).payload;
     
      const patient = { 
        id: userInfo.phone_number || userInfo.sub,
        name: userInfo.name,
        birthday: userInfo.birthdate,
        prescription_id: `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
  
      console.log('patient', patient);
      
      const encodedPatient = Buffer.from(JSON.stringify(patient)).toString('base64');
      const redirectUrl = new URL(`${process.env.FRONTEND_BASE_URL}/doctor`);
      redirectUrl.searchParams.append('patient', encodedPatient);
   
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('[AUTH] Patient verification error:', error);
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/auth/error?error=authentication_failed`);
    }
  };

  static async getStatistics(req, res) {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ 
        error: "Doctor ID is required",
        success: false
      });
    }

    try {
      // Query blockchain for all prescriptions
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID,
          chaincodeid: process.env.CHAINCODE_ID,
          function: "GetPrescriptionsByDoctor",
          args: doctorId,
        },
      });

      let prescriptions = [];
      if (response.data) {
        // Parse response data
        let rawData = response.data;
        if (typeof rawData === 'string') {
          if (rawData.startsWith('Response: ')) {
            rawData = rawData.replace('Response: ', '').trim();
          }
          try {
            rawData = JSON.parse(rawData);
          } catch (err) {
            console.error('Parse error:', err);
          }
        }

        if (Array.isArray(rawData)) {
          prescriptions = rawData;
        }
      }

      // Calculate statistics
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const statistics = {
        totalPrescriptions: prescriptions.length,
        activePrescriptions: prescriptions.filter(p => p.Status === 'Active').length,
        patientsToday: new Set(
          prescriptions
            .filter(p => new Date(p.Timestamp) >= startOfDay)
            .map(p => p.PatientId)
        ).size,
        recentPrescriptions: prescriptions
          .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
          .slice(0, 5)
          .map(p => ({
            patientName: p.PatientName,
            medicationName: p.MedicationName,
            timestamp: p.Timestamp,
            status: p.Status
          }))
      };

      return res.status(200).json({
        success: true,
        data: statistics
      });

    } catch (error) {
      console.error('Error fetching statistics:', error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve statistics",
        details: error.response?.data || error.message
      });
    }
  }
}

module.exports = PrescriptionController;