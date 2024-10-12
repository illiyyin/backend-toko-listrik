
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'toko_listrik',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('Database connection failed: ', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = db