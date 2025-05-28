const { pool } = require('../config/db');

class User {
  static async create(userData) {
    const { digitalID, name, role, status = 'Active' } = userData;
    const query = `
      INSERT INTO staffs (digitalID, name, role, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [digitalID, name, role, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM staffs WHERE name = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = 'SELECT * FROM staffs WHERE digitalID = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async update(userId, updateData) {
    const { name, role, status } = updateData;
    const query = `
      UPDATE staffs
      SET name = $1, role = $2, status = $3
      WHERE digitalID = $4
      RETURNING *;
    `;
    const values = [name, role, status, userId];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  }

  static async findUserByDigitalID(digitalID) {
    const query = 'SELECT * FROM staffs WHERE digitalID = $1';
    const result = await pool.query(query, [digitalID]);
    return result.rows[0];
  }

  static async delete(userId) {
    const query = 'DELETE FROM staffs WHERE digitalID = $1 RETURNING *';
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }
}

module.exports = User;
