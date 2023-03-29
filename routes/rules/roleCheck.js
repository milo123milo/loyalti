function admin(req, res, next) {
  
  if (req.user.role === 'admin' ) {
     next()
  }
  return res.redirect('/')
 
}

module.exports = { admin }