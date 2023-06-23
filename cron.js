const cron = require('node-cron');
const request = require('request');

// Set up the request options
const options = {
  url: 'http://localhost:3001/',
  method: 'GET'
};

// Send the GET request


// Schedule the cron job to run at 00:00 every day
function startCron() {
    cron.schedule('0 0 * * *', () => {
  // This function will be executed once every day at 00:00
  // Add your logic here
    request(options, (error, response, body) => {
        if (error) {
            console.error('An error occurred:', error);
        } else {
            console.log('Status Code:', response.statusCode);
            console.log('Response Body:', body);
        }
        });
    console.log('Cron job executed at 00:00');
    });
    console.log('Cron Job added')
}

function checkClients() {
    var today = new Date();
}

module.exports = startCron