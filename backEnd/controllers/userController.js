const { pool } = require('../config/db');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

// Helper function to encrypt data
const encryptData = (data) => {
  const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse('fixed_iv_16bytes'); // Use a fixed IV (must be 16 bytes)
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
  return encrypted.toString();
};

// Helper function to decrypt data
const decryptData = (encryptedData) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse('fixed_iv_16bytes'); // Use the same fixed IV
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

class UserController {
  // Check if the table exists, and create it if it doesn't
  static async ensureTableExists() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS registered_users (
          digitalID VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL
        )
      `);
     //Table checked/created successfully
    } catch (error) {
      console.error('Error ensuring table exists:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }

  // Add a new user
  static async addUser(req, res) {
    const { digitalID, role, userName } = req.body;
    if (!digitalID || !role || !userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Ensure the table exists before adding a user
      await UserController.ensureTableExists();

      const encryptedDigitalID = encryptData(digitalID);
      const encryptedUserName = encryptData(userName);
      const encryptedRole = encryptData(role);

      console.log('Encrypted digitalID:', encryptedDigitalID);
      console.log('Encrypted userName:', encryptedUserName);
      console.log('Encrypted role:', encryptedRole);

      const [existingUser] = await pool.query('SELECT 1 FROM registered_users WHERE digitalID = ?', [encryptedDigitalID]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User with this Digital ID is already enrolled.' });
      }

      await pool.query(
        'INSERT INTO registered_users (digitalID, name, role) VALUES (?, ?, ?)',
        [encryptedDigitalID, encryptedUserName, encryptedRole]
      );

      res.status(201).json({ message: 'User added successfully', digitalID, userName, role });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get all users
  static async getUsers(req, res) {
    try {
      // Ensure the table exists before fetching users
      await UserController.ensureTableExists();

      const [users] = await pool.query('SELECT * FROM registered_users');
      const decryptedUsers = users.map(user => ({
        digitalID: decryptData(user.digitalID),
        name: decryptData(user.name),
        role: decryptData(user.role),
      }));
      res.json(decryptedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get a user by their digitalID
  static async getUserById(req, res) {
    const { digitalID } = req.params;
    console.log('Plaintext digitalID:', digitalID);

    const encryptedDigitalID = encryptData(digitalID);
    console.log('Encrypted digitalID:', encryptedDigitalID);

    try {
      // Ensure the table exists before fetching a user
      await UserController.ensureTableExists();

      const [users] = await pool.query('SELECT * FROM registered_users WHERE digitalID = ?', [encryptedDigitalID]);
      console.log('Database query result:', users);

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found', digitalID });
      }

      const decryptedUser = {
        digitalID: decryptData(users[0].digitalID),
        name: decryptData(users[0].name),
        role: decryptData(users[0].role),
      };

      console.log('Decrypted user:', decryptedUser);
      res.json(decryptedUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete a user
  static async deleteUser(req, res) {
    const { digitalID } = req.params;
    console.log('Plaintext digitalID:', digitalID);

    const encryptedDigitalID = encryptData(digitalID);
    console.log('Encrypted digitalID:', encryptedDigitalID);

    try {
      // Ensure the table exists before deleting a user
      await UserController.ensureTableExists();

      const [result] = await pool.query('DELETE FROM registered_users WHERE digitalID = ?', [encryptedDigitalID]);
      console.log('Delete result:', result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found', digitalID });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// Initialize the table when the application starts
UserController.ensureTableExists();

module.exports = UserController;