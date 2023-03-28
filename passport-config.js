const LocalStrategy = require('passport-local').Strategy


function initialize(passport, getUserByEmail /*, getUserById*/) {
  const authenticateUser = async (name, password, done) => {
    //const user = getUserByEmail(email)
    const user = getUserByEmail
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
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
    return done(null, /*getUserById(id)*/ getUserByEmail)
  })
}

module.exports = initialize