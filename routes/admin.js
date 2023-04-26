var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var role = require('./rules/roleCheck')
var pool = require('../database/queries')
var types = require('../database/role_types')

//Add routes below


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
    return res.render('clients', {message, data: it, types: clientType}); 
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
module.exports = router;
