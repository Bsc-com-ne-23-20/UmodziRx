const mysql = require('mysql2/promise');

// Function to create the test database if it doesn't exist
async function createDatabase() {
  try {
    const tempConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      port: 3306,
    });

    console.log('Checking if database "test_db" exists...');

    // Create database if it doesn't exist
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS test_db`);
    console.log('Database "test_db" is ready.');

    await tempConnection.end(); // Close the temporary connection
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1); // Exit script if database setup fails
  }
}

// Function to create a connection to the test_db after ensuring the database exists
async function createDatabaseConnection() {
  await createDatabase(); // Ensure database exists before connecting

  // Now connect to the test_db
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test_db',
    port: 3306,
  });

  console.log('Connected to MySQL (test_db)');
  return connection; // Return promise-based connection
}

module.exports = { createDatabase, createDatabaseConnection }; // Export both functions
