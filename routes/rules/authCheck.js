function done(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function not(req, res, next) {
  
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = {done, not}