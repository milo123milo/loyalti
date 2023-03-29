var express = require('express');
var auth = require('./rules/authCheck');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', auth.done, function(req, res, next) {
  res.render('index', { name: req.user.name });
  console.log(req.user)
});

router.get('/login', auth.not, function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', auth.not, passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
}));

router.get('/logout', auth.done, function(req, res) {
  req.logOut(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});




module.exports = router;
