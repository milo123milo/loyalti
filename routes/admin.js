var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');
var role = require('./rules/roleCheck')

router.get('/admin', role.admin, auth.done, function(req, res, next) {
  res.render('admin');
});


module.exports = router;
