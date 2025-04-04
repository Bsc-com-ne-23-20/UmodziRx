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
    console.log("veripatient of phamacist endpoint called");
    
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
          redirect_uri: 'http://localhost:5000/pharmacist/veripatient' // Match the redirect_uri from frontend
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
        id: userInfo.phone_number || userInfo.sub, // Use phone number or subject ID as patient ID
        name: userInfo.name || 'Verified Patient',
        birthday: userInfo.birthdate || 'N/A'
      };

      console.log('Verified patient:', patient);
      
      // Encode patient data for URL
      const encodedPatient = Buffer.from(JSON.stringify(patient)).toString('base64');
      
      // Redirect back to pharmacist dashboard with patient data
      const redirectUrl = new URL("/pharmacist", "http://localhost:13130");
      redirectUrl.searchParams.append('patient', encodedPatient);
      
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('[AUTH] Patient verification error:', error);
      return res.redirect(`${process.env.FRONTEND_ERROR_PATH}?error=authentication_failed`);
    }
  }

  
}

module.exports = PharmacistController;