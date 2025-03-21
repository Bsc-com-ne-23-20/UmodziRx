// Handles authentication-related requests
// Define functions for login, registration, and token management here

const User = require('../models/User');
const { generateToken } = require('../utils/auth');

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials aseh' });
      }
      const token = generateToken(user);
      let redirect;
      if (user.role === 'admin') {
          redirect = '/admin-dashboard';
      } else if (user.role === 'doctor') {
          redirect = '/doctor-dashboard';
      } else if (user.role === 'pharmacist') {
          redirect = '/pharmacist-dashboard';
      } else {
          redirect = '/user-dashboard'; // Default
      }


      res.json({ token, redirect });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async register(req, res) {
    const { username, password, role } = req.body;
    try {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      const newUser = await User.create({ username, password, role });
      const token = generateToken(newUser);
      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
