var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var role = require('./rules/roleCheck')

router.get('/admin', role.admin, auth.done, function(req, res, next) {
  return res.render('admin');
});
router.get('/users', auth.done, role.admin, function(req, res, next) {
 
  return res.render('users'); 
  
});

module.exports = router;
