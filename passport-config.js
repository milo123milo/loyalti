const LocalStrategy = require('passport-local').Strategy


function initialize(passport, getUserByName, getUserById) {
  const authenticateUser = async (name, password, done) => {
    //const user = getUserByEmail(email)
    var user = await new Promise((resolve, reject) => {
    getUserByName(name, (result) => {
      resolve(result[0]);
    });
  });
    
    if (name != user.name) {
      console.log
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
  }
 
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserByName)
  })
}


module.exports = initialize