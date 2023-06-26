var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cronJob = require('./cron'); 

const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'sr'], // Supported locales
  directory: __dirname + '/locales', // Path to your locale files
  defaultLocale: 'sr', // Default locale
  cookie: 'lang',
  objectNotation: true // Cookie name to store the locale
});





const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var initDB = require('./database/init')
var app = express();

initDB.initDatabase();

const initializePassport = require('./passport-config');
const { route } = require('./routes/index');

var query = require('./database/queries');
const router = require('./routes/index');

var routers = express.Router();




initializePassport(
  passport,
  query.getUserByName,
  query.getUserById
 
)

app.use(flash())
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())






// view engine setup

cronJob();

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('fonts'))
app.use(i18n.init);




/*
app.use(function (req, res, next) {
    var locale = 'sr'
    req.setLocale(locale)
    res.locals.language = locale
    next()
}) */

app.get('/change-language-en', (req, res) => {
  const locale = 'en'; // Set the desired locale
  res.cookie('lang', locale);
  req.setLocale(locale);
  res.locals.language = locale;
  
  res.redirect('/');
});
app.get('/change-language-sr', (req, res) => {
  const locale = 'sr'; // Set the desired locale
  res.cookie('lang', locale);
  req.setLocale(locale);
  res.locals.language = locale;
  
  res.redirect('/');
});

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});














module.exports = app;
