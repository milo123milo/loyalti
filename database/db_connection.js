const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'auth'
});
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});


module.exports = { pool, connection };