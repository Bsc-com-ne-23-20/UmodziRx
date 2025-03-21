const { createDatabaseConnection } = require('../config/db');
const User = require('../models/User');

async function testMySQL() {
  let mysqlConnection;

  try {
    // Step 1: Ensure database exists and establish connection
    mysqlConnection = await createDatabaseConnection();

    // Step 2: Test MySQL connection
    console.log('Testing MySQL connection...');
    await mysqlConnection.query('SELECT 1');
    console.log('MySQL connection successful.');

    // Step 3: Create test users
    console.log('Creating test users...');
    const users = [
      { username: 'testuser', password: 'testpass', role: 'user' },
      { username: 'admin', password: 'adminpass', role: 'admin' },
      { username: 'pharmacist', password: 'pharmapass', role: 'pharmacist' },
      { username: 'patient', password: 'patientpass', role: 'patient' },
      { username: 'doctor', password: 'doctorpass', role: 'doctor' }
    ];

    for (const userData of users) {
      const existingUser = await User.findByUsername(userData.username);
      if (!existingUser) {
        const newUser = await User.create(userData);
        console.log(`User created with ID: ${newUser}`);
      } else {
        console.log(`User ${userData.username} already exists.`);
      }
    }

    // Step 4: Test user retrieval
    console.log('Testing user retrieval...');
    const user = await User.findByUsername('testuser');
    console.log('Retrieved user:', user);
  } catch (error) {
    console.error('Error during MySQL test:', error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end(); // Ensure connection is closed
      console.log('Database connection closed.');
    }
  }
}

// Run the script
testMySQL();
