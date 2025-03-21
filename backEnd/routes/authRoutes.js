// Authentication routes
// Define routes for login, registration, and token management here

const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;

