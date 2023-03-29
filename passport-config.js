const LocalStrategy = require('passport-local').Strategy


function initialize(passport, getUserByName, getUserById) {
 

  
  const authenticateUser = async (name, password, done) => {
    //const user = getUserByEmail(email)
    console.log('a')
   getUserByName(name, (user) => {
    
    if (!user) {
      
      return done(null, false, { message: 'User not found' })
    }

    try {
      
      if (password == user.password) {
        
        return done(null, user)
      } else {
        
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      
      return done(e)
    }
    })
  }
 
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))


  passport.serializeUser((user, done) => { 
    getUserByName(user.name, (user) => {
      
      done(null, user) })
    })
    

  passport.deserializeUser((id, done) => {
    getUserById(id.id, (user) => {
        
        return done(null, user)
    })
    
  })
}


module.exports = initialize