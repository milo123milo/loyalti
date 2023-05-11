function admin(req, res, next) {
  
  if (req.user.role === 'admin' || req.user.role === 'root'   ) {
     return next()
  }
  return res.redirect('/')
 
}

module.exports = {admin}