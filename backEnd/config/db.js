const mysql = require('mysql2/promise');

// MySQL configuration with hardcoded credentials for testing
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'staff',
  password: 'root',
  port: 3306,
});

// Connect to MySQL
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('MySQL connection error', err);
  });

module.exports = { pool };