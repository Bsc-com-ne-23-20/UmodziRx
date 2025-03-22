const { pool } = require('../config/db'); // Use the connection pool from db.js

class UserController {
  static async addUser(req, res) {
    const { digitalID, role, userName } = req.body; // userName should be mapped to username
    try {
      // Check if the user already exists
      const [existingUser] = await pool.query('SELECT * FROM registered_users WHERE digitalID = ?', [digitalID]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User with this Digital ID is already enrolled.' });
      }

      // Insert user into the registered_users table
      await pool.query(
        `INSERT INTO registered_users (digitalID, name, role) VALUES (?, ?, ?)`,
        [digitalID, userName, role]
      );

      res.status(201).json({ digitalID, userName, role });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUsers(req, res) {
    try {
      const [users] = await pool.query('SELECT * FROM registered_users'); 
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserById(req, res) {
    const { digitalID } = req.params;
    try {
      const [users] = await pool.query('SELECT * FROM registered_users WHERE digitalID = ?', [digitalID]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(users[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteUser(req, res) {
    const { digitalID } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM registered_users WHERE digitalID = ?', [digitalID]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send(); // No content
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = UserController;
