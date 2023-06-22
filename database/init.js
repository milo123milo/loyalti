const mysql = require('mysql');
const user = require('./root')
const db = require('./db_connection')

// MySQL connection configuration
/* dev db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});
*//*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});*/
const connection = db.connection
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
            WHERE NOT EXISTS (SELECT * FROM users WHERE name = '${user.user.name}')`;
        connection.query(addAdmin, (err) => {
            if(err) throw err;
            console.log('Root admin user checked/created')
        });

        const createCategoryTable = `
            CREATE TABLE IF NOT EXISTS category (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name TEXT,
                duration INT,
                rangeval VARCHAR(255),
                discrange VARCHAR(255),
                startdisc INT,
                maxdisc INT
            );
            

            `;
        connection.query(createCategoryTable, (err) => {
            if (err) throw err;
            console.log('Category table checked/created');
        });

        const createClientsTable = `
        CREATE TABLE IF NOT EXISTS clients (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name TEXT,
            discount INT,
            type VARCHAR(255),
            pib INT DEFAULT NULL,
            address TEXT,
            info TEXT, 
            dcat TEXT,
            start DATETIME,
            end DATETIME
        );

            `;
        connection.query(createClientsTable, (err) => {
            if (err) throw err;
            console.log('Clients table checked/created');
        });

        const createReceiptTable = `
            CREATE TABLE IF NOT EXISTS receipts (
                ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                IIC TEXT,
                Date DATETIME,
                Total DECIMAL(10,2),
                TotalVAT DECIMAL(10,2),
                Discount DECIMAL(5,2),
                TotalDiscounted DECIMAL(10,2) GENERATED ALWAYS AS (Total*(1-Discount/100)) STORED,
                ClientID INT,
                CONSTRAINT fk_receipts_client
                  FOREIGN KEY (ClientID)
                  REFERENCES clients(id)
                  ON DELETE CASCADE
            );
        `
        connection.query(createReceiptTable, (err) => {
            if (err) throw err;
            console.log('Receipt table checked/created');
        });

        const createReceiptItemsTable = `
            CREATE TABLE IF NOT EXISTS receiptitems (
                ID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                ReceiptID int(11) DEFAULT NULL,
                Name varchar(255) DEFAULT NULL,
                Quantity decimal(10,2) DEFAULT NULL,
                Unit varchar(255) DEFAULT NULL,
                PricePerPiece decimal(10,2) DEFAULT NULL,
                PriceTotal decimal(10,2) DEFAULT NULL,
                PriceTotalVAT decimal(10,2) DEFAULT NULL,
                Discount decimal(5,2) DEFAULT NULL,
                Total decimal(10,2) DEFAULT NULL,
                CONSTRAINT fk_receiptitems_receipt
                  FOREIGN KEY (ReceiptID)
                  REFERENCES receipts(ID)
                  ON DELETE CASCADE
            );
        `
        connection.query(createReceiptItemsTable, (err) => {
            if (err) throw err;
            console.log('Receipt Items table checked/created');
        });

          connection.query(
    "SELECT COUNT(*) AS trigger_exists FROM information_schema.triggers WHERE trigger_name = 'auto_id' AND event_object_table = 'clients'",
    (err, results) => {
      if (err) throw err;

      const triggerExists = results[0].trigger_exists;

      // create the trigger if it does not exist
      if (triggerExists === 0) {
        connection.query(
          "CREATE TRIGGER auto_id BEFORE INSERT ON clients FOR EACH ROW BEGIN DECLARE ordinal INT; DECLARE year CHAR(2); DECLARE month CHAR(2); DECLARE type_num INT; SET ordinal = (SELECT COUNT(*) + 1 FROM clients); SET year = DATE_FORMAT(CURDATE(), '%y'); SET month = DATE_FORMAT(CURDATE(), '%m'); IF NEW.type = 'faktura' THEN SET type_num = 1; ELSEIF NEW.type = 'kasa' THEN SET type_num = 0; END IF; SET NEW.id = CONCAT(ordinal, year, month, type_num); END;",
          (err, results) => {
            if (err) throw err;

            console.log('Trigger created successfully');
          }
        );
      } else {
        console.log('Trigger already exists');
      }
    }
  );




        });
    });
    });
}

module.exports = {initDatabase}