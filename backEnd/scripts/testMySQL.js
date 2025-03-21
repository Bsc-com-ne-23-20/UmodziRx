const { mysqlConnection } = require('../config/db');
const User = require('../models/User');

async function testMySQL() {
  try {
    // Test MySQL connection
    console.log('Testing MySQL connection...');
    await mysqlConnection.promise().query('SELECT 1');
    console.log('MySQL connection successful.');

    // Test user creation with specific credentials
    console.log('Creating test users...');
    const users = [
      { username: 'testuser', password: 'testpass', role: 'user' },
      { username: 'admin', password: 'adminpass', role: 'admin' },
      { username: 'pharmacist', password: 'pharmapass', role: 'pharmacist' },
      { username: 'patient', password: 'patientpass', role: 'patient' },
      { username: 'doctor', password: 'doctorpass', role: 'doctor' } // Adding doctor credentials
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

    // Test user retrieval
    console.log('Testing user retrieval...');
    const user = await User.findByUsername('testuser');
    console.log('Retrieved user:', user);

    // No cleanup: users will not be deleted
  } catch (error) {
    console.error('Error during MySQL test:', error);
  } finally {
    mysqlConnection.end();
  }
}

testMySQL();
doctorpass