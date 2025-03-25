const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

// OIDC Provider Configuration
const OIDC_CONFIG = {
  ISSUER: 'http://localhost:8088',
  CLIENT_ID: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmqTrx',
  REDIRECT_URI: 'http://localhost:5000/auth/login',
  TOKEN_PATH: '/v1/esignet/oauth/v2/token',
  USERINFO_PATH: '/v1/esignet/oidc/userinfo',
  SCOPES: 'openid profile email'
};

// Construct full URLs
const TOKEN_URL = `${OIDC_CONFIG.ISSUER}${OIDC_CONFIG.TOKEN_PATH}`;
const USERINFO_URL = `${OIDC_CONFIG.ISSUER}${OIDC_CONFIG.USERINFO_PATH}`;

// RSA Private Key in JWK format
const PRIVATE_KEY_JWK = {"kty":"RSA","n":"mqTrxm-nn8YJCOAC1r0kGmn2bxwpY-BLBfUxWtKPjXX7LzwJEDzXGtK1p6dWbu2bDrPkS8Vu2QGyCZ59Qg5xxlQWi8fyii-wIGHb4RkBwe_qw6vfBH0NT9zv3It169UguSM9CEbkwM6BzI1ziHXzJTQftNOWts4-7ovkU6WbCsdpvTNkbvDx2dXuc8p89w695qKlXiKmBiEBqtYJArq01-5kYiOmATKptqhg1viiS-UZ7ufotzhIB7NMUCeajHirljEtN5QKuHdoUqip6k1b1s6xdgJdC5m7Xe-guXbutYg_Gv58ZCf1lsH4lmbJhbSef5d23-ZUqVSpIeQzX4HmKw","e":"AQAB","d":"TFiteis3gz6-yR3m6OM6BrxXiKVLnd5my4swkZkwe_NKThiClPykab6rJhkMJ_mwOoL_a5UOU55tqigPyOPesb5j3yCYkjZW6rXFWw0AfCGZMn8QvGOMhegalzRWxFZVMHHAOOzfFH0fQcB30GAC6VQhbyGi359VHGn-EHnK4HemCP-etU0W5c4mRgUDlG-vg_LEmDBRZY-Zo_t60jsrKQ1vMe8ctuT8s9mM6vr-w_r-9ecN2g9Dw44qitjxqzAdCZy11KUf3Te58u7LayF6WBHigVesLM2hqcMi_IMTwNdbIPrHS2zJb1pc5484K4qD0om-YVWcfk4HZM5Jdzr_UQ","p":"_5txRNdh-7YIOqx0_Pythp6Wk_N4iEDDrI-UMz6RGNMhIIYwl4VgtciIbVCkqVtLJbgxRMa0JU4BmUQc3dXD8xTjCeUdRi8sb8d2WW7CWN5sEHwL-qbs7ErcgCJ6kzx2a6u2zYr5zdNWhHjvG0CNv0BaZCQq13Zrmhy5G_YqRDk","q":"muHCUMx8IwDEkCH7aBZlE9Zq3jWG1saJHfo2-yNSq7kHl49HDjbwTKa3CXoYriNMANGWUiZjuoPP_JNCDCS6JY-7MEucwBIziJalxlHm3GDE-SP5la83tlJr65atO6SH1kO9YhEIM5VG-edMp_1d4gQRBMB2xdNp40xtp6Oq5YM","dp":"TMx8hO2d4A46fL6SS-zzik4d-ggeP_oNkMx2_8qdt_K_slD_SpdljljZPNcNEmF-u6-TBhIZ0FeWvWEsty5iOKge6zsux4am-FLa6VYRCLiTiYRr6Py8lOaNR-aUI6b4AbPPMgS-t6v3A8h-Nxb3P-5q-kmvoZtQCzb0G0WkP2k","dq":"Kf2bGRzXawYCRLFx375ymPZA8w3ACOq6sg3sahohh70aedS2hvwOGjn41fDsUAnxyScJgiw2TZL_CJNEDNbIQPa-4VEeplRI9Hcjaqk51fXGcWV3fUWL7TpbV_v563mn-kdTSQslFhcarxYuijz-_w_rLUag7PFse9t0v0Z4RtE","qi":"QjPOaMnK5-V_cK4MZZFygGauHoZhmh2--c7OPTg37eh3sqCL7Lmdyl2IOLCvcGU_BEFKSCdtb9yly85bnHiSw8hFv-f44TAJmxeH_sZJ9Q6ZHhvldutkRcE9hpu2Ig6CcPwX_Zo8VxFYuSX8wIgp3s5tPeyN2E3dWDnA9r8h398"};

// Utility function to decode JWT
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    return JSON.parse(Buffer.from(parts[1], 'base64').toString());
  } catch (error) {
    console.error('JWT decoding error:', error);
    throw new Error('Failed to decode JWT');
  }
};

class AuthController {
  /**
   * Handle OIDC login callback
   */
  static async login(req, res) {
    console.log("Login request received:", req.query);

    const { code, state } = req.query;

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing authorization code or state");
      return res.status(400).json({ 
        error: 'invalid_request',
        error_description: 'Missing authorization code or state'
      });
    }

    try {
      // 1. Prepare client assertion JWT
      console.log("Preparing client assertion...");
      const privateKeyPem = jwkToPem(PRIVATE_KEY_JWK, { private: true });
      
      const now = Math.floor(Date.now() / 1000);
      const clientAssertionPayload = {
        iss: OIDC_CONFIG.CLIENT_ID,
        sub: OIDC_CONFIG.CLIENT_ID,
        aud: TOKEN_URL,
        exp: now + 300,  // 5 minutes expiration
        iat: now,
        jti: `jti-${now}-${Math.random().toString(36).substring(2, 10)}` // Unique JWT ID
      };

      const clientAssertion = jwt.sign(
        clientAssertionPayload,
        privateKeyPem,
        { 
          algorithm: 'RS256',
          header: {
            typ: 'JWT',
            alg: 'RS256'
          }
        }
      );
      console.log("Exchanging authorization code for tokens...using method1");

        // const encodedParams = new URLSearchParams();
        // encodedParams.set('grant_type', 'authorization_code');
        // encodedParams.set('code', code);
        // encodedParams.set('client_id', CLIENT_ID);
        // encodedParams.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
        // encodedParams.set('client_assertion', clientAssertion);
        // encodedParams.set('redirect_uri', 'http://localhost:5000/auth/login');

        // const options = {
        // method: 'POST',
        // url: TOKEN_URL,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     Accept: 'application/json'
        // },
        // data: encodedParams,
        // };

        // try {
        // const { data } = await axios.request(options);
        // console.log(data);
        // console.log("successful Exchanging authorization code for tokens...using method1",error);
        // } catch (error) {
        // console.error(error);
        // console.log("failed Exchanging authorization code for tokens...using method1",error);
        // }








      // 2. Exchange authorization code for tokens
      console.log("Exchanging authorization code for tokens...");
      const tokenParams = new URLSearchParams();
      tokenParams.append('grant_type', 'authorization_code');
      tokenParams.append('code', code);
      tokenParams.append('redirect_uri', OIDC_CONFIG.REDIRECT_URI);
      tokenParams.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
      tokenParams.append('client_assertion', clientAssertion);

      const tokenResponse = await axios.post(
        TOKEN_URL,
        tokenParams,
        { 
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      console.log("Token response received");
      const { access_token, id_token } = tokenResponse.data;

      if (!access_token) {
        throw new Error('No access token received');
      }

      // 3. Get user info
      console.log("Fetching user info...");
      const userInfoResponse = await axios.get(USERINFO_URL, {
        headers: { 
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      // Handle both JWT and JSON responses
      let userInfo;
      try {
        userInfo = typeof userInfoResponse.data === 'string' 
          ? decodeJWT(userInfoResponse.data) 
          : userInfoResponse.data;
      } catch (error) {
        console.error("Failed to parse user info:", error);
        throw new Error('Invalid userinfo response format');
      }

      if (!userInfo || !userInfo.username) {
        throw new Error('User info missing required claims');
      }

      // 4. Create or update local user
      console.log(`Processing user ${userInfo.username}...`);
      let user = await User.findByUsername(userInfo.username);
      
      if (!user) {
        console.log("Creating new user...");
        user = await User.create({
          username: userInfo.username,
          email: userInfo.email,
          name: userInfo.name || userInfo.username,
          role: userInfo.role || 'patient'
        });
      } else {
        console.log("Updating existing user...");
        // Update user profile if needed
        await User.updateProfile(userInfo.username, {
          email: userInfo.email,
          name: userInfo.name
        });
      }

      // 5. Generate application session token
      console.log("Generating application session token...");
      const sessionToken = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      });

      // 6. Determine redirect based on role
      const roleRedirects = {
        admin: '/admin/dashboard',
        doctor: '/doctor/patients',
        pharmacist: '/pharmacist/orders',
        patient: '/patient/profile'
      };

      const redirect = roleRedirects[user.role] || '/';

      // 7. Respond with tokens and redirect info
      res.json({
        token: sessionToken,
        redirect,
        role: user.role,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      console.error("Authentication error:", error);

      const errorResponse = {
        error: 'server_error',
        error_description: 'Authentication failed'
      };

      if (error.response) {
        // Handle OIDC provider errors
        errorResponse.error = error.response.data.error || 'oidc_error';
        errorResponse.error_description = error.response.data.error_description || 'OIDC provider error';
        console.error("OIDC provider error details:", error.response.data);
      }

      res.status(500).json(errorResponse);
    }
  }

  /**
   * Local user registration
   */
  static async register(req, res) {
    console.log("Registration request received:", req.body);

    const { username, password, email, name, role } = req.body;

    try {
      // Validate input
      if (!username || !password || !email) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required fields'
        });
      }

      // Check if user exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          error: 'user_exists',
          error_description: 'Username already taken'
        });
      }

      // Create new user
      const newUser = await User.create({
        username,
        password,
        email,
        name: name || username,
        role: role || 'patient'
      });

      // Generate session token
      const token = generateToken({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email
      });

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: 'registration_error',
        error_description: 'Failed to complete registration'
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: 'not_found',
          error_description: 'User not found'
        });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      });

    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Failed to fetch profile'
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
