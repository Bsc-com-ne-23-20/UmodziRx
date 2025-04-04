const axios = require('axios');
const { URLSearchParams } = require('url');
const dotenv = require('dotenv');
const jwkToPem = require('jwk-to-pem');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

dotenv.config();

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
      // Query blockchain for prescriptions
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID,
          chaincodeid: process.env.CHAINCODE_ID,
          function: "GetAssetHistory",
          args: patientId,
        },
      });

      // Process the response
      let rawData = response.data;
      if (typeof rawData === "string" && rawData.startsWith("Response: ")) {
        rawData = rawData.replace("Response: ", "").trim();
      }
      
      let historyData;
      try {
        historyData = JSON.parse(rawData);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to parse blockchain response",
          details: err.message,
        });
      }

      // Format prescriptions
      const prescriptions = [];
      let patientName = "N/A";
      
      if (Array.isArray(historyData)) {
        historyData.forEach(entry => {
          if (entry.patientId === patientId) {
            patientName = entry.patientName || patientName;
            
            if (entry.prescriptions) {
              entry.prescriptions.forEach(prescription => {
                prescriptions.push({
                  medicationName: prescription.MedicationName || "Unknown",
                  dosage: prescription.Dosage || "N/A",
                  instructions: prescription.Instructions || "N/A",
                  doctorId: prescription.DoctorId || "N/A",
                  timestamp: prescription.Timestamp ? 
                    new Date(prescription.Timestamp.seconds * 1000).toISOString() : 
                    new Date().toISOString(),
                  txId: prescription.TxId || crypto.randomUUID()
                });
              });
            }
          }
        });
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
    if (!patientId || !prescriptionId || !pharmacistId || !comment) {
      return res.status(400).json({ 
        error: "All fields are required",
        success: false
      });
    }

    try {
      // Prepare blockchain request
      const requestData = new URLSearchParams();
      requestData.append('channelid', process.env.CHANNEL_ID);
      requestData.append('chaincodeid', process.env.CHAINCODE_ID);
      requestData.append('function', 'DispenseMedication');
      requestData.append('args', patientId);
      requestData.append('args', prescriptionId);
      requestData.append('args', pharmacistId);
      requestData.append('args', comment);

      // Send to blockchain
      const blockchainResponse = await axios.post(
        `${process.env.BLOCKCHAIN_API_URL}/invoke`, 
        requestData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      return res.status(200).json({
        success: true,
        message: 'Medication dispensed successfully',
        data: {
          patientId,
          prescriptionId,
          pharmacistId,
          txId: blockchainResponse.data.txId,
          dispensedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to dispense medication',
        details: error.response?.data || error.message
      });
    }
  }
}

module.exports = PharmacistController;