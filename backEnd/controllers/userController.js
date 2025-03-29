


const { pool } = require('../config/db');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

// Encryption/Decryption functions
const encryptData = (data) => {
  if (!data) return null;
  const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse('fixed_iv_16bytes');
  const encrypted = CryptoJS.AES.encrypt(data.toString(), key, { iv: iv });
  return encrypted.toString();
};

const decryptData = (encryptedData) => {
  if (!encryptedData) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse('fixed_iv_16bytes');
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

class UserController {
  static async ensureTableExists() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS registered_users (
          digitalID VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL
        )
      `);
      console.log('User table verified/created');
    } catch (error) {
      console.error('Error ensuring table exists:', error);
      throw error;
    }
  }

  /**
   * Finds a user by digitalID and returns their decrypted data if found
   * @param {string} digitalId - The unencrypted digital ID to search for
   * @returns {Promise<object|null>} - The user's decrypted data if found, null otherwise
   */
  static async findUserById(digitalId) {
    if (!digitalId) return null;
    
    try {
      await UserController.ensureTableExists(); // Fixed: Use UserController instead of this
      const encryptedId = encryptData(digitalId);
      
      if (!encryptedId) {
        throw new Error('Failed to encrypt digitalId');
      }

      const [users] = await pool.query(
        'SELECT * FROM registered_users WHERE digitalID = ?', 
        [encryptedId]
      );
      
      if (users.length === 0) {
        return null;
      }

      // Decrypt all user data
      const user = users[0];
      return {
        digitalID: decryptData(user.digitalID),
        name: decryptData(user.name),
        role: decryptData(user.role)
      };
    } catch (error) {
      console.error('Error in findUserById:', error);
      return null;
    }
  }

  
}
// Initialize table when starting


module.exports = UserController;
