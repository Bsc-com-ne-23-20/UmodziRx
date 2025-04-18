const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { URLSearchParams } = require('url');
const crypto = require('crypto');
const dotenv = require('dotenv');
const staffTable = require('../controllers/userController');

dotenv.config();

const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION_SEC || '300', 10);
const CODE_EXPIRY_MINUTES = parseInt(process.env.CODE_EXPIRY_MINUTES || '5', 10);
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) 
  : ['admin@example.com'];

let PRIVATE_KEY_PEM;
try {
  const PRIVATE_KEY_JWK = JSON.parse(process.env.PRIVATE_KEY_JWK);
  PRIVATE_KEY_PEM = jwkToPem(PRIVATE_KEY_JWK, { private: true });
} catch (error) {
  console.error('[AUTH] Failed to initialize private key:', error);
  process.exit(1);
}

// strore value of token expiration in seconds
let temporaryInfo ={
  code:'',
  userInfor:'',
  token:''
} ;



const decodeJWT = (token) => {
  const [header, payload] = token.split('.');
  return {
    header: JSON.parse(Buffer.from(header, 'base64').toString()),
    payload: JSON.parse(Buffer.from(payload, 'base64').toString()),
  };
};

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

const getRoleDashboard = (role) => ({
  admin: '/admin',
  doctor: '/doctor',
  pharmacist: '/pharmacist',
  patient: '/patient'
});

const login = async (req, res) => {
  const { code, state } = req.query;
  
  try {
    if (!code) throw new Error('Authorization code required');

    const clientAssertion = await createClientAssertion();
    const tokenResponse = await axios.post(
      `${process.env.ISSUER}${process.env.TOKEN_PATH}`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.CLIENT_ID,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertion,
        redirect_uri: process.env.REDIRECT_URI
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const userInfo = decodeJWT(
      (await axios.get(
        `${process.env.ISSUER}${process.env.USERINFO_PATH}`,
        { headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` } }
      )).data
    ).payload;

    // Determine user roles
    let role = 'patient';
    if (userInfo.email==='doctor@gmail.com') role ='doctor';
    if (userInfo.email==='pharmacy@gmail.com') role ='pharmacist';
    if (userInfo.email==='admin@gmail.com') role ='admin';

    const dbUser = await staffTable.findUserByDigitalID(userInfo.phone_number);
    if (dbUser && !role.includes(dbUser.role)) role =(dbUser.role);

    const user ={ 
      id: userInfo.phone_number, 
      email: userInfo.email, 
      name: userInfo.name , 
      birthday:userInfo.birthdate,
      role:role  }

     
    const frontendCode = crypto.randomBytes(32).toString('hex');
    temporaryInfo ={
      code:frontendCode, 
      user:user,
      role:role
      };
     

    const redirectUrl = new URL(process.env.FRONTEND_CALLBACK_PATH, process.env.FRONTEND_BASE_URL);
    redirectUrl.searchParams.append('code', frontendCode);
    redirectUrl.searchParams.append('role', JSON.stringify(role));
 

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return res.redirect(`${process.env.FRONTEND_ERROR_PATH}?error=authentication_failed`);
  }
};

const exchangeCode = async (req, res) => {
  const { code, role } = req.body;
  console.log("received authorisation request with:",code,role)
  try {
    if (!code || !temporaryInfo.code ===0) throw new Error('Invalid code, correct code expired:');
    
    //retrieve valid role in Login
    const codeData = temporaryInfo.code;
    
    // check incoming role validity
    if (role.length===0||!role==='admin'||!role==='patient'||!role==='phamarcist'||!role==='doctor') {
      throw new Error('Invalid role selection');
    }

    const token = jwt.sign(
      {
        id: temporaryInfo.user.id,
        email: temporaryInfo.user.email,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    

    return res.json({
      success: true,
      token,
      user: {
        id: temporaryInfo.user.id,
        email: temporaryInfo.user.email,
        name: temporaryInfo.user.name,
        birthday:temporaryInfo.user.birthday,
      },role:temporaryInfo.role
    });
  } catch (error) {
    console.error('[EXCHANGE] Error:', error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { login, exchangeCode, getRoleDashboard };