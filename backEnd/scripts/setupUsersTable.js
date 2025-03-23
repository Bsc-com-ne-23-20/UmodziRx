const mysql = require('mysql2');

// MySQL configuration
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'staff',
  port: 3306,
});

// Connect to MySQL and create the users table
mysqlConnection.connect(err => {
  if (err) {
    console.error('MySQL connection error', err);
    return;
  }

  console.log('Connected to MySQL');

  // Create the users table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `;

  mysqlConnection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists.');

      // Define the users to insert
      const users = [
        { username: 'doctor1', password: 'pass', role: 'doctor' },
        { username: 'patient1', password: 'pass', role: 'patient' },
        { username: 'admin1', password: 'pass', role: 'admin' },
        { username: 'pharmacist1', password: 'pass', role: 'pharmacist' },
      ];

      // Insert each user into the users table
      const insertQuery = `
        INSERT INTO users (username, password, role)
        VALUES (?, ?, ?)
      `;

      users.forEach(user => {
        mysqlConnection.query(insertQuery, [user.username, user.password, user.role], (err, results) => {
          if (err) {
            console.error(`Error inserting user ${user.username}:`, err);
          } else {
            console.log(`User ${user.username} inserted successfully.`);
          }
        });
      });
    }

    // Close the connection after all queries are done
    mysqlConnection.end();
  });
});
