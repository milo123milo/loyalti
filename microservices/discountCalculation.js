var connection = require('../database/db_connection');
connection = connection.pool;
const fs = require('fs');

var clients = [
  {"id":2,"name":"Jane Doe","discount":15,"type":"Kasa","pib":987654321,"address":"456 Second St","info":"aaa:ccc","dcat":7,"start":null,"end":"2023-05-09T20:00:00.000Z","category_name":"katg1"}
];

var catgs = [
  {
    id: 6,
    name: 'Nova',
    duration: 3,
    rangeval: '1,3,5',
    discrange: '2,4,6',
    startdisc: 5,
    maxdisc: 10
  },
  {
    id: 7,
    name: 'katg1',
    duration: 25,
    rangeval: '500,600,700,800,900',
    discrange: '10,20,40,50,60',
    startdisc: 1,
    maxdisc: 10
  },
  {
    id: 8,
    name: 'aaa',
    duration: 1,
    rangeval: '1,2,4',
    discrange: '1,3,50',
    startdisc: 1,
    maxdisc: 1
  }
];

function subtractDates(date1, date2) {
  // Create a new Date object from date1
  const originalDate = new Date(date1);

  // Get the year and month of the original date
  const year = originalDate.getFullYear();
  const month = originalDate.getMonth();

  // Calculate the new month and year
  let newMonth = month - date2;
  let newYear = year;

  // Adjust the new month and year if necessary
  while (newMonth < 0) {
    newMonth += 12;
    newYear--;
  }

  // Create a new Date object with the adjusted month and year
  const newDate = new Date(newYear, newMonth, originalDate.getDate(), originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds());

  // Return the new Date object
  return newDate;
}

function calculateTotalDiscountedSum(array) {
  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i].TotalDiscounted;
  }

  return sum;
}

function getCategoryBySpending(catgs, categoryName, spendings) {
  const category = catgs.find((catg) => catg.name === categoryName);

  if (category) {
    const rangevalArr = category.rangeval.split(',').map(Number);
    const discrangeArr = category.discrange.split(',').map(Number);

    let discValue = category.startdisc;

    for (let i = 0; i < rangevalArr.length; i++) {
      if (spendings < rangevalArr[i]) {
        break;
      }

      discValue = discrangeArr[i];
    }

    if (spendings > rangevalArr[rangevalArr.length - 1]) {
      discValue = category.maxdisc;
    }

    return discValue;
  }

  return null;
}

function getAllCategory(callback) {
  const sql = 'SELECT * FROM category';
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}

function getSpendingClientForRange(clientID, endDate, duration, callback) {
  const sql = 'SELECT * FROM receipts WHERE ClientID = ? AND Date BETWEEN ? AND ?';
  var minusCategoryDate = subtractDates(endDate, duration);

  connection.query(sql, [clientID, minusCategoryDate, endDate], (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}

function updateClientDiscount(client, spendings) {
  const categoryName = client.category_name;
  const category = getCategoryBySpending(catgs, categoryName, spendings);
  if (category) {
    
    client.discount = category;
  }
}

function updateClientEndDate(client, duration) {
  const currentDate = new Date();
  const newEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + duration, currentDate.getDate());
  client.end = newEndDate.toISOString();
}
function updateClientsDatabase(clientsArray) {
  clientsArray.forEach((client) => {
    const { id, name, discount, type, pib, address, info, dcat, start, end, category_name } = client;

    const query = `UPDATE clients SET
                     name = '${name}',
                     discount = ${discount},
                     type = '${type}',
                     pib = ${pib},
                     address = '${address}',
                     info = '${info}',
                     dcat = ${dcat},
                     start = ${start ? "'" + start + "'" : null},
                     end = ${end ? "'" + end + "'" : null},
                     category_name = '${category_name}'
                   WHERE id = ${id}`;

    connection.query(query, (err, result) => {
      if (err) throw err;
      console.log(`Client with ID ${id} updated successfully.`);
    });
  });
}

function updateClientsArray(clients) {
  var clients = clients
  var updatedClients = [];
  const today = new Date();
  const div = '-----------------------'
  const formattedDateTime = today.toISOString();
        

        

  clients.forEach((client) => {   
    const category = catgs.find((catg) => catg.name === client.category_name);                   
    getSpendingClientForRange(client.id, client.end, category.duration, (spendings) => {
      const totalDiscountedSum = calculateTotalDiscountedSum(spendings);
      updateClientDiscount(client, totalDiscountedSum);
      updateClientEndDate(client, category.duration);
      updatedClients.push(client);

      if (updatedClients.length === clients.length) {
        //console.log(updatedClients);
        
        updateClientsDatabase(updatedClients)
        var clientsLog = JSON.stringify(updatedClients)
        const logs = `${formattedDateTime}\n${clientsLog}\n${div}\n`;
        fs.appendFile('./logs/discountCalculation.txt', logs, (err) => {console.log("ErrLogs2: ", err)}) 
      }
    });
  });
}





// Server //
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const array = req.body;
  
  clients = array

  getAllCategory((categories) => {
  catgs = categories;
  updateClientsArray(clients);
    });  
    
  
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

/*
  1. Get All category pack it into usable array of object.
  2. Start iterating throught clients
  3. For evey single client do next
    3.1 Get spendings for date range:  getSpendingClientForRange()
    3.2 Summ all spendings: calculateTotalDiscountedSum()
    3.3 Get aplicable category discount: getCategoryBySpending() 
    3.4 Change client.discount
    3.5 Change client.end to = todays date + category.duration (catgeory duration is int which represent number of months)
  4. Pack all that into a new array updatedClients
*/



//get all Clients spendings for end - category.duration Months
//comapre category spendings with categroy.rangeval, get category.discrange for that rangeval
// if spendings lower than category.rangeval set clients discount to categroy.startdisc
// if spendings above than categroy.rangeval set clients discount to categroy.maxdisc
// update end + category.duration
//Iterate this for all clients

//if discount of client is manually changed start new period for today + category.duration (SQL trigger?)

// Get clients spendingd like this: find receipts for date range (end - categroy.duration) which match clients.id
// Sum all receipts.total

//handle cateogry change, reset end with new time which is today + new ctageory.duration



