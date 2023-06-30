var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var role = require('./rules/roleCheck')
var pool = require('../database/queries')
var types = require('../database/role_types')
var workers = require('./workers/helperFunctions')
const fs = require('fs');
const path = require('path');

function readTxtFilesFromFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

  const fileObjects = txtFiles.map(file => {
    const fileTitle = path.parse(file).name;
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n|\r|\n/g, '\n');

    return {
      fileTitle,
      content
    };
  });

  return fileObjects;
}
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


router.get('/category', auth.done, role.admin, function(req, res, next) {
  const { message } = req.query;
  pool.getAllCategory(it => {
    return res.json(it); 
  })
});

router.post('/category', auth.done, role.admin, function(req, res, next) {
 
 const { id, name, duration, rangeval, discrange, startdisc, maxdisc  } = req.body;
 console.log(req.body)
 pool.editCategory(id, name, duration, rangeval, discrange, startdisc, maxdisc)
 res.send('Ok')
  
});

router.post('/create-category', auth.done, role.admin, function(req, res, next) {
 
 const { name, duration, rangeval, discrange, startdisc, maxdisc  } = req.body;
 console.log(req.body)
 pool.createCategory(name, duration, rangeval, discrange, startdisc, maxdisc)
 res.send('Ok')
  
});
router.get('/delete-category/:id', auth.done, role.admin, (req, res) => {
  const id = req.params.id;
    
  pool.deleteCategory(id)
  res.send('Ok, deleted catg with ID ' + id)
});
router.get('/categories', auth.done, role.admin, function(req, res, next) {
   pool.getAllCategory(categories => {
    return res.render('categories', { categories });
  })
  
});

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
  const obj = {
  name: "None"
  };
  pool.getAllCategory(catg => { 
    console.log(catg)
    const modifiedCatg = [obj, ...catg]; 

    pool.getAllClients(it => {
    return res.render('clients', {message, data: it, types: clientType, role: req.user.role, category: modifiedCatg }); 
  })
  })
  
  
});
router.post('/deleteclient/:id', auth.done, role.admin, (req, res) => {
  const id = req.params.id;
  pool.deleteClient(id)
  res.send('Client ${id} deleted.');
});
router.post('/clients', auth.done, role.admin, function(req, res, next) {
 var { name, discount, type, pib, address, category, start, end, extraInfo } = req.body;
 console.log(req.body)
 if(category == 'None') {
  category = ''
 }
 end = end+'T22:00:00.000Z'
  if(name === '' || discount === '' || type === '' ){
     const message = "All fields are required!";
     res.redirect(`/clients?message=${encodeURIComponent(message)}`);
  } else {
    pool.getCategoryByName(category, it => {
        var catgId = null
      if(typeof it === 'undefined') {
          catgId = null
      } else {
          catgId = it.id
      }
      
        console.log('IT2' + it)
        pool.createClient(name, discount, type, pib, address, catgId, start, end, extraInfo)
        res.redirect('/clients')
    })

 }
  
});
router.post('/editclient', auth.done, role.admin, function(req, res, next) {
 var { id, name, discount, type, pib, address, category, end } = req.body;
 
 if(category == 'None') {
  category = ''
 }
 end = end+'T22:00:00.000Z'
   if(name === '' || discount === '' || type === '' ){
     const message = "All fields are required!";
     res.redirect(`/clients?message=${encodeURIComponent(message)}`);
  }else {
    
    pool.getCategoryByName(category, it => {
      console.log('INFO: ' + category + it) 
      var catgId = null
      if(typeof it === 'undefined') {
          catgId = null
      } else {
          catgId = it.id
      }
      
        console.log('IT:' + it, "Catg:" + category)
        pool.editClient(id, name, discount, type, pib, address,  catgId, end)
        res.redirect('/clients') 
    })
  } 
  
});
router.post('/editclientinfo', auth.done, role.admin, function(req, res, next) {
 var { id, info } = req.body;

 pool.updateClientInfo(id, info)
 
  
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
router.get('/singleclientinfo/:id', auth.done, role.admin, (req, res) => {
  const id = req.params.id;
    
  Promise.all([getClient(id)])
  .then(([client]) => {
  //  console.log(receipts)
    res.json(client[0]);
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

router.get('/logs', auth.done, role.admin, function(req, res, next) {
    
    //  console.log(receipts)
    console.log(readTxtFilesFromFolder('./microservices/logs'))
    return res.render('logs', {logsArray: readTxtFilesFromFolder('./microservices/logs')}); 
    //return res.json(readTxtFilesFromFolder('./microservices/logs'))
      
    

    
 
});




module.exports = router;
