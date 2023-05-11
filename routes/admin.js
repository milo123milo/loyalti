var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var role = require('./rules/roleCheck')
var pool = require('../database/queries')
var types = require('../database/role_types')

//Add routes below

function getClient(id) {
  return new Promise((resolve, reject) => {
    pool.getClientById(id, (client) => {
      if (!client) {
        reject(new Error('Client not found'));
      } else {
        resolve(client);
      }
    });
  });
}
function getClientReceipts(id) {
  return new Promise((resolve, reject) => {
    pool.getClientReceipts(id, (receipts) => {
      if (!receipts) {
        reject(new Error('Client not found'));
      } else {
        resolve(receipts);
      }
    });
  });
}
function getReceiptItems(id) {
  return new Promise((resolve, reject) => {
    pool.getReceiptItems(id, (items) => {
      if (!items) {
        reject(new Error('Bill not found'));
      } else {
        resolve(items);
      }
    });
  });
}
function getClientReceiptItems(clientID, startDate, endDate) {
  return new Promise((resolve, reject) => {
    pool.getClientReceiptItems(clientID, startDate, endDate, (err, items) => {
      if (!items) {
        reject(new Error('Not found'));
      } else {
        resolve(items);
      }
    });
  });
}

function getClientReceiptTotals(clientID, startDate, endDate) {
  return new Promise((resolve, reject) => {
    pool.getClientReceiptTotals(clientID, startDate, endDate, (err, items) => {
      if (!items) {
        reject(new Error('Not found'));
      } else {
        resolve(items);
      }
    });
  });
}
function getAllReceiptItems(startDate, endDate) {
  return new Promise((resolve, reject) => {
    pool.getAllReceiptItems(startDate, endDate, (err, items) => {
      if (!items) {
        reject(new Error('Not found: getAllReceiptItems'));
      } else {
        resolve(items);
      }
    });
  });
}

function getAllReceiptTotals(startDate, endDate) {
  return new Promise((resolve, reject) => {
    pool.getAllReceiptTotals(startDate, endDate, (err, items) => {
      if (!items) {
        reject(new Error('Not found: getAllReceiptTotals ***' + err));
      } else {
        resolve(items);
      }
    });
  });
}



router.get('/admin', role.admin, auth.done, function(req, res, next) {
  return res.render('admin');
});

router.get('/users', auth.done, role.admin, function(req, res, next) {
  const { message } = req.query;
  pool.getAllUsers(it => {
    return res.render('users', {message, data: it, types: types.roles}); 
  })
  
  
});
router.post('/users', auth.done, role.admin, function(req, res, next) {
 const { username, password, role } = req.body;
  if(username === '' || password === '' || role === '' ){
     const message = "All fields are required!";
     res.redirect(`/users?message=${encodeURIComponent(message)}`);
  }else if(username === 'root'){
     const message = "Username 'root' is forbbiden!";
     res.redirect(`/users?message=${encodeURIComponent(message)}`);
 }else {
 pool.createUser(username, password, role)
 res.redirect('/users')
 }
  
});
router.post('/editusers', auth.done, role.admin, function(req, res, next) {
 const { id, username, password, role } = req.body;
   if(username === '' || password === '' || role === '' ){
     const message = "All fields are required!";
     res.redirect(`/users?message=${encodeURIComponent(message)}`);
  }else if(username === 'root'){
     const message = "Username 'root' is forbbiden!";
     res.redirect(`/users?message=${encodeURIComponent(message)}`);
 }else {

 pool.editUser(id, username, password, role)
 res.redirect('/users')
  }
  
});
router.post('/deleteuser/:id',auth.done, role.admin, (req, res) => {
  const id = req.params.id;
  pool.deleteUser(id)
  res.send('User ${id} deleted.');
});


router.get('/clients', auth.done, role.admin, function(req, res, next) {
  const { message } = req.query;
  const clientType = types.clientType
  pool.getAllClients(it => {
    return res.render('clients', {message, data: it, types: clientType, role: req.user.role}); 
  })
});
router.post('/deleteclient/:id', auth.done, role.admin, (req, res) => {
  const id = req.params.id;
  pool.deleteClient(id)
  res.send('Client ${id} deleted.');
});
router.post('/clients', auth.done, role.admin, function(req, res, next) {
 const { name, discount, type, pib, address } = req.body;
  if(name === '' || discount === '' || type === '' ){
     const message = "All fields are required!";
     res.redirect(`/clients?message=${encodeURIComponent(message)}`);
  } else {
  const id = 
 pool.createClient(name, discount, type, pib, address)
 res.redirect('/clients')
 }
  
});
router.post('/editclient', auth.done, role.admin, function(req, res, next) {
 const { id, name, discount, type, pib, address } = req.body;
   if(name === '' || discount === '' || type === '' ){
     const message = "All fields are required!";
     res.redirect(`/clients?message=${encodeURIComponent(message)}`);
  }else {

 pool.editClient(id, name, discount, type, pib, address)
 res.redirect('/clients')
  }
  
});

router.get('/singleclient/:id', auth.done, role.admin, (req, res) => {
  const id = req.params.id;
    
  Promise.all([getClient(id), getClientReceipts(id)])
  .then(([client, receipts]) => {
  //  console.log(receipts)
    res.render('single_client', { data: receipts, name: client[0].name });
  })
  .catch((error) => {
    res.status(404).send(error.message);
  });
});
router.get('/getreceiptitems/:id', auth.done, role.admin, (req, res) => {
  const id = req.params.id;
    
  Promise.all([getReceiptItems(id)])
  .then(([items]) => {
  //  console.log(receipts)
    res.json(items);
  })
  .catch((error) => {
    res.status(404).send(error.message);
  });
});

router.get('/stats', auth.done, role.admin, function(req, res, next) {


    return res.render('generalstats'); 
 
});
router.get('/single-stats/:id', auth.done, role.admin, function(req, res, next) {
    const id = req.params.id;
     Promise.all([getClient(id) /*, getClientReceipts(id)*/])
    .then(([client/*, receipts*/]) => {
    //  console.log(receipts)
    return res.render('single_client_stats', {name: client[0].name, id: id }); 
     
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });

    
 
});


router.get('/get-stats/:id/:start/:end', auth.done, role.admin, function(req, res, next) {
    const id = req.params.id;
    const start = req.params.start;
    const end = req.params.end;
      Promise.all([ getClientReceiptItems(id, start, end), getClientReceiptTotals(id, start, end)])
      .then(([items, totals]) => {
      //  console.log(receipts)
      const data = {items, totals};
        res.json(data);
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });


    
 
});

router.get('/get-all-stats/:start/:end', /*auth.done, role.admin,*/ function(req, res, next) {
    const start = req.params.start;
    const end = req.params.end;
      Promise.all([ getAllReceiptItems(start, end), getAllReceiptTotals(start, end)])
      .then(([items, totals]) => {
      //  console.log(receipts)
      const data = {items, totals};
        res.json(data);
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });


    
 
});

module.exports = router;
