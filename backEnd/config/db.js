const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'staff',
  password: 'root',
  port: 3306,
});

// Add this function
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
    return pool;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    throw err;
  }
};

module.exports = { pool, connectDB }; // Export both