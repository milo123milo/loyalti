var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index', { name: req.user.name });
  console.log(req.user)
});

router.get('/login', checkNotAuthenticated, function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', checkNotAuthenticated, function(req) {
  console.log(req.body);
} ,passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
  }) );

router.get('/logout', checkAuthenticated, function(req, res) {
  req.logOut(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
 
  if (req.isAuthenticated()) {
    
    return res.redirect('/')
  }
  
  next()
}


module.exports = router;
