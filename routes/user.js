var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var pool = require('../database/queries')
var receipt = require('./workers/getReceiptInfo')
const axios = require('axios');

function generateUniqueID() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  
  const randomNum = Math.floor(Math.random() * 90) + 10;
  const uniqueID = year + month + day + randomNum ;

  console.log(uniqueID);
  return uniqueID;
  
}
function generateUniqueID2() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  
  const randomNum = Math.floor(Math.random() * 90) + 10;
  const uniqueID = randomNum  + year + month + day ;

  console.log(uniqueID);
  return uniqueID;
  
}

router.use((req, res, next) => {
  if (req.user === false) {
    return res.redirect('/login');
  }
  next();
});



//Add routes below

router.get('/user', auth.done, function(req, res, next) {


  axios.get('/change-language-sr')
      .then(response => {
        res.render('user');
        console.log("AAAA")
        console.log(response.data);
      })
      .catch(error => {
        res.render('user');
        console.error(error);
      });
  
});
router.get('/input', auth.done, function(req, res, next) {
  res.render('input');
});

router.post('/checkBill', auth.done, (req, res) => {
  // Check for any errors in the request body
  const requestData = req.body;

  function calculationAndInsertion(it) {
              if (it && it.hasOwnProperty('iic')) {
            pool.getClientById(requestData.card, (client, err) => {
              
              if (err) {
                res.status(501).json({ message: 'Error Client', error: err });
              } else {
                //Receipt is inputed with precalcultaed discount so we need to add discount to total pice
                const disc = parseInt(client[0].discount)
                console.log(disc)
                it.sameTaxes[0].priceBeforeVat = it.sameTaxes[0].priceBeforeVat + (it.sameTaxes[0].priceBeforeVat/100) * disc
                it.totalPrice = it.totalPrice + (it.totalPrice/100)*disc
                // ****************
                if(it.id === null){
                  it.id = generateUniqueID2()
                }
                
                pool.createClientReceipts(it.id, it.iic, it.dateTimeCreated, it.sameTaxes[0].priceBeforeVat, it.totalPrice, disc, client[0].id, (err) => {
                  if (err) {
                    res.status(500).json({ message: 'Error Database', error: err });
                    console.log(err)
                  } else {
                    for (let i = 0; i < it.items.length; i++) {
                      const item = it.items[i];

                      pool.createReceiptItem(it.id, item.name, item.quantity, item.unit, item.unitPriceBeforeVat, item.priceBeforeVat, item.priceAfterVat, disc, item.priceAfterVat - (item.priceAfterVat / 100) * disc); //DISCOUNT
                    }
                    res.status(200).json({ message: 'Request successful 200', data: it });
                  }
                });
              }
            });
          } else {
            res.status(400).json({ error: 'Error 400' });
          }
  }

  // Do some processing with req.body here
if(requestData.noreceipt === false){
receipt.get(requestData.receipt).then(it => {
  if(requestData.extraItems.status === true){
    Array.prototype.push.apply(it.items, requestData.extraItems.items);
    it.sameTaxes[0].priceBeforeVat = it.sameTaxes[0].priceBeforeVat + requestData.extraItems.sumNoVat
    it.totalPrice = it.totalPrice + requestData.extraItems.sumWithVat
  }
  //Expand it.items, but addes items do like this format: item_name* with *
  // recualculate Totals
  calculationAndInsertion(it)

});
} else {
  var today = new Date();

  var sameTaxes = [
    { priceBeforeVat: requestData.extraItems.sumNoVat}
  ]
  var it = {
    id: generateUniqueID(), 
    iic: '00000', 
    dateTimeCreated: today,
    items: requestData.extraItems.items,
    sameTaxes: sameTaxes,
    totalPrice: requestData.extraItems.sumWithVat
  }
  calculationAndInsertion(it)
}
  console.log("Data:", "Good")

  // Send a response with status code 200 and a JSON payload
  
});



module.exports = router;
