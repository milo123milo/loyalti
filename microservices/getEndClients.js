var connection = require('../database/db_connection')
connection = connection.pool
const express = require('express');
const request = require('request');
const fs = require('fs');


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
      
        const today = new Date();
        const div = '-----------------------'
        const formattedDateTime = today.toISOString();
        const logs = `${formattedDateTime}\n${response}\n${div}\n`;

        fs.appendFile('./logs/getEndClients.txt', logs, (err) => {console.log("ErrLogs: ", err)}) 

        if (response.length > 0) {
          // Send a POST request to localhost:3002
          request.post({
            url: 'http://localhost:3002',
            json: response
          }, (error, httpResponse, body) => {
            if (error) {
              // Handle any errors that occurred during the POST request
              console.error('Error:', error);
              // Optionally, you can send an error response back to the client
              res.status(500).send('An error occurred');
            } else {
              // If the post request was successful, you can send the response back to the client
              res.send(response);
              console.log(response);
            }
          });
        } else {
          // If the response is empty, you can send an empty response back to the client
          res.send([]);
          console.log('Empty response');
        }
      });
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

