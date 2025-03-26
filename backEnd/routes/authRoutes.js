const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Use static methods directly
router.get('/login', AuthController.login);
router.post('/register', AuthController.register);



module.exports = router;
