var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');

router.get('/user', auth.done, function(req, res, next) {
  res.render('user');
});

module.exports = router;
