const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const jose = require('jose');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { createPrivateKey } = require('crypto');
const { URLSearchParams } = require('url');

const ISSUER = 'http://localhost:8088';
const CLIENT_ID = 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvmiAW';
const REDIRECT_URI = 'http://localhost:5000/auth/login';
const TOKEN_PATH = '/v1/esignet/oauth/v2/token';
const USERINFO_PATH = '/v1/esignet/oidc/userinfo';
const SCOPES = 'openid profile email';

const PRIVATE_KEY_JWK ={"kty":"RSA","n":"vmiAW_U0GygOkC8D5uMIL4b2-p2vc9aLi0UXquFLL7SB6OJo4NiLNC6by_AucpmIS7BBlx7cy3XoRpvGtD2TguaM17kBpTo7Kz7mBgTh9RbSPuz_IfvEBKPTkK8O6zn5DPK2iJNdtDLQmO5PG-Vq4IZGi-UuBjvrkG1FdyORk2qjNbqSGbs5cLGgx9YCO_emXCABn4wdQ3sFDQHhTkVEZn2PRCjhNZUImcyMN6GlAd3pkr2k2EMRSgR0kSAFZxNP6n8SNLN-9H23jFGD7objBQVD-Qb-ys_3h4PI98aH9ozpCsmHlKZAkRLXZlPAtz--GaVKXW7WLCz3UPi1khkeSw","e":"AQAB","d":"QpFGTt_q15Opg77sHkxBEFye-_8k19qp7oa5P4SERKlWwZRmFjWedR_WV_YgRvBmNg_o3mxrxLXz_rt3PIxKhfkURFbpvFofVX8n6_LJDGZuGpHAoKDkZrrfvDV3gcVCzMQODLF4kQcy5kRqY9ZRBy3qe_4jmQpZ0KRjJMPKoT6K1XidN0k4Fk6RNhtqugbceoCjkG6zLqCV1ho5lnzsdQPdfU-ACQ2wwycY4Lvu_AH2iA9mHYsEmX1dXAnQcL3-VFIf3PN99j0L1Xj7DyM-97WtwjYg0DurGAv3bhO0K_1KatdbVrjPu0c21E1WdJNXnZpagesFtTgmKoxSW_soAQ","p":"_wSkUg9b3xPVcPMCY2qzAiHBMUfyVCrf-mEuIcG_wzvCYBwwi5SAMY1Ckk6QqAIwFYT4_-OmHEzdp5YpdLQnBgKDWgbbuuprZ-7tSf6W8UDaUB4cCWfN2A15r-PQpshq8aM4naZhgEcP9hOKi0Q1tWK3SmJIuZ7aQ42CMkr0K7k","q":"vyQtSBYZdeYU87ZLYznU1kTFczDIOcBt8QhARAKdyNUYp0buWlxHrhnb5czyEGVjnCpOI70Ar-7T9Aauj1Re5CjfP4Td5py4L_G3tNdJLBoazVTL0Y-9hvGO7j1PmPXNsZfQfLkgkToF5U5y68Y8qzTw8sstLVqTeAYd4IDqRCM","dp":"AjPSD3teecC8GSugG6eyQBR2jKxoZV2xbYIlWdlIhLEhbp8PtETmDod_ya-wBCNwst7hH6ShrKDlUSs01HMx2xVuePqSLz0TDGS92-O8_fxnZkW8TEB_QJxtLp2zEZ2tfsTAGmxzbx4t_xwQGD_Qju55UsUih6fdjrPMKg8HqNE","dq":"h6O5in08RiEnXydO6jRA6GjXIX5NqEX4_uHXESw2Ii2umA5K2M7BgzgQh0vfv2jjvg97cfsOwMqfmH0hZM7_o7OpcV7tRViTkFpc_jUEVQqVWH7DQIxbd6Z1wnS5xpcwB8XvCoMpLEXbpzT7cnsz1F72WaV7AsNTAQp-KzHwjLc","qi":"ge7vDBTDVLy9OM6JV4jHy5JU99DNH4_IMmcB0xPTQjHAsqdZ_lq4NRSO7R8Xj0uFhzFNBtUPvnDnqybICGiB4w1m-ewGQKNuwtvjhmZeAHAuulH7FnGdlenmKUe8zXnpJyQV2F-BlSeu9OKbtHnNsf9txN7QajtT-YixJ507Cf4"};

class AuthController {
  /**
   * Handle OIDC login callback
   */
  
  static base64urlDecode(inputStr) {
    console.log('Base64URL decoding input:', inputStr);
    let paddingNeeded = 4 - (inputStr.length % 4);
    if (paddingNeeded && paddingNeeded !== 4) {
      console.log(`Adding ${paddingNeeded} padding characters`);
      inputStr += '='.repeat(paddingNeeded);
    }
    
    const buffer = Buffer.from(inputStr, 'base64');
    const result = buffer.toString('utf-8');
    console.log('Base64URL decoding result:', result);
    return result;
  }
    
  static async jwtToPem(jwk) {
    console.log('Converting JWK to PEM...');
    try {
      // Convert JWK to PEM using jwkToPem
      const pem = jwkToPem(jwk, { private: true });
      console.log('Successfully converted JWK to PEM');
      return pem;
    } catch (error) {
      console.error('Error converting JWK to PEM:', error);
      throw error;
    }
  }
    
  static async login(req, res) {
    console.log('\n=== LOGIN STARTED ===');
    console.log('Request query parameters:', req.query); 
    
    try {
      const code = req.query.code;
      console.log('Authorization code received:', code);
      
      const privateKeyPem = await AuthController.jwtToPem(PRIVATE_KEY_JWK);
      console.log('Private key in PEM format:', privateKeyPem.substring(0, 50) + '...');
      
      const privateKey = createPrivateKey({
        key: privateKeyPem,
        format: 'pem'
      });
  
      const now = Math.floor(Date.now() / 1000);
      const clientAssertionPayload = {
        iss: CLIENT_ID,
        sub: CLIENT_ID,
        aud: ISSUER + TOKEN_PATH,
        jti: Math.random().toString(36).substring(2),
        exp: now + 300,
        iat: now
      };
      
      console.log('Client assertion payload:', clientAssertionPayload);
      
      const clientAssertion = jwt.sign(clientAssertionPayload, privateKey, { algorithm: 'RS256' });
      console.log('Client assertion JWT:', clientAssertion.substring(0, 50) + '...');
  
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('client_id', CLIENT_ID);
      params.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
      params.append('client_assertion', clientAssertion);
      params.append('redirect_uri', REDIRECT_URI);
      
      
  
      console.log('Token endpoint request params:', params.toString());
      
      console.log('Making token request to:', ISSUER + TOKEN_PATH);
      const tokenResponse = await axios.post(ISSUER + TOKEN_PATH, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      console.log('Token response status:', tokenResponse.status);
      console.log('Token response data:', tokenResponse.data);
      
      const accessToken = tokenResponse.data.access_token;
      console.log('Access token received:', accessToken ? accessToken.substring(0, 20) + '...' : 'NULL');
      

      ISSUER + TOKEN_PATH






      console.log('Making userinfo request to:', ISSUER + USERINFO_PATH);
      const userInfoResponse = await axios.get(ISSUER + USERINFO_PATH, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      console.log('Userinfo response status:', userInfoResponse.status);
      console.log('Userinfo response data:', userInfoResponse.data);
  
      const userInfo = userInfoResponse.data;
      console.log('=== LOGIN COMPLETED SUCCESSFULLY ===');
      return res.json(userInfo);
    } catch (error) {
      console.error('\n=== LOGIN ERROR ===');
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      console.error('Error stack:', error.stack);
      
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  static async register(req, res) {
    console.log("Register request received:", req.body);

    const { username, password, role } = req.body;
    try {
      console.log(`Checking if username '${username}' already exists...`);
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        console.error("Username already exists.");
        return res.status(400).json({ message: 'Username already exists' });
      }

      console.log("Creating new user...");
      const newUser = await User.create({ username, password, role });

      console.log("New user registered:", newUser);

      console.log("Generating JWT session token...");
      const token = generateToken(newUser);

      res.status(201).json({ token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;