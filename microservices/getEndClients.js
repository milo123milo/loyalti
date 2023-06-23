var connection = require('../database/db_connection')
connection = connection.pool
const express = require('express');
const app = express();
const port = 3001;


function getEndClients(time, callback) {
  const sql = ` SELECT *
                FROM clients
                WHERE end <= ? AND category_name IS NOT NULL`;
  connection.query(sql, [time], (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}







app.get('/', (req, res) => {
    const currentTime = new Date(); 
    getEndClients(currentTime, response => {
        res.send(response);
        console.log(response);
    });
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

