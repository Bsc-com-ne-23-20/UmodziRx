const User = require('../models/User');
const { generateToken } = require('../utils/auth');

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    try {
      // Check if user exists and credentials are valid
      const user = await User.findByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token with expiration
      const token = generateToken(user);

      // Determine the appropriate redirection based on user role
      let redirect;
      if (user.role === 'admin') {
        redirect = '/admin';
      } else if (user.role === 'doctor') {
        redirect = '/doctor';
      } else if (user.role === 'pharmacist') {
        redirect = '/pharmacist';
      } else {
        redirect = '/patient'; // Default
      }

      // Return the token and the redirect URL based on the user role
      res.json({ token, redirect, role: user.role });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async register(req, res) {
    const { username, password, role } = req.body;
    try {
      // Check if the username already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create a new user
      const newUser = await User.create({ username, password, role });

      // Generate JWT token for the new user
      const token = generateToken(newUser);
      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
