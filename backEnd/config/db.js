// Database connection configuration
// Define the connection settings for the database here

const mysql = require('mysql2');

// MySQL configuration with hardcoded credentials for testing
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test_db',
  password: 'root',
  port: 3306,
});

// Connect to MySQL
mysqlConnection.connect(err => {
  if (err) {
    console.error('MySQL connection error', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = { mysqlConnection };
