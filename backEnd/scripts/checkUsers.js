const mysql = require('mysql2');

// MySQL configuration
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'staff',
  port: 3306,
});

// Connect to MySQL and retrieve users
mysqlConnection.connect(err => {
  if (err) {
    console.error('MySQL connection error', err);
    return;
  }

  console.log('Connected to MySQL');

  // Query to retrieve users
  mysqlConnection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
    } else {
      console.log('Users in the database:', results);
    }
    mysqlConnection.end();
  });
});
