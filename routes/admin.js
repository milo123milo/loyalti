var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var role = require('./rules/roleCheck')
var pool = require('../database/queries')

router.get('/admin', role.admin, auth.done, function(req, res, next) {
  return res.render('admin');
});
router.get('/users', auth.done, role.admin, function(req, res, next) {
  pool.getAllUsers(it => {
    return res.render('users', {data: it}); 
  })
  
  
});
router.post('/users', auth.done, role.admin, function(req, res, next) {
 const { username, password, role } = req.body;
 pool.createUser(username, password, role)
 
 res.redirect('/users')
  
  
});
router.post('/deleteuser/:id',auth.done, role.admin, (req, res) => {
  const id = req.params.id;
  pool.deleteUser(id)
  res.send('User ${id} deleted.');
});
module.exports = router;
