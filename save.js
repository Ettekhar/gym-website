const fs = require('fs');
const mysql = require('mysql2');

// Read the SQL script file
const sqlScript = fs.readFileSync('path/to/your/sql_script.sql', 'utf-8');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_database_name',
  multipleStatements: true, // This allows multiple SQL statements per query
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');

  // Execute the SQL script
  connection.query(sqlScript, (err, results) => {
    if (err) {
      console.error('Error executing the SQL script:', err.stack);
    } else {
      console.log('SQL script executed successfully.');
    }

    // Close the connection
    connection.end((err) => {
      if (err) {
        console.error('Error closing the connection:', err.stack);
      } else {
        console.log('Connection closed.');
      }
    });
  });
});
