const mysql = require('mysql');
const user = require('./root')

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

// Connect to MySQL
function initDatabase(){
    connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

    // Check if 'auth' database exists, if not create it
    connection.query('CREATE DATABASE IF NOT EXISTS auth', (err) => {
        if (err) throw err;

        // Switch to 'auth' database
        connection.changeUser({ database: 'auth' }, (err) => {
        if (err) throw err;

        // Check if 'users' table exists, if not create it and add admin user
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
            );
            

            `;
        connection.query(createUsersTable, (err) => {
            if (err) throw err;
            console.log('Users table checked/created');
        });

        const addAdmin = `
        INSERT INTO users (name, password, role) 
        SELECT '${user.user.name}', '${user.user.password}', '${user.user.role}'
        WHERE NOT EXISTS (SELECT * FROM users WHERE name = 'root');`
        connection.query(addAdmin, (err) => {
            if(err) throw err;
            console.log('Root admin user crearted')
        })

        });
    });
    });
}

module.exports = {initDatabase}