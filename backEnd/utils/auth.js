require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the secret key
  return jwt.sign(
    { id: user.id, username: user.username, tenantId: user.tenantId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
