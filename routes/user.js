var express = require('express');
var router = express.Router();
var auth = require('./rules/authCheck');

router.use((req, res, next) => {
  if (req.user === false) {
    return res.redirect('/login');
  }
  next();
});

//Add routes below

router.get('/user', auth.done, function(req, res, next) {
  res.render('user');
});

module.exports = router;
