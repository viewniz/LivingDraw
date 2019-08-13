let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose    = require('mongoose');
let bodyParser = require('body-parser');
var session=require('express-session');
const flash = require('connect-flash');
var passport = require('passport');
let passportAdmin = require('passport');

let indexRouter = require('./routes/index/index');
let usersRouter = require('./routes/users');
let userRouter = require('./routes/user/index');
let goodsRouter = require('./routes/goods/index');
let borderRouter = require('./routes/border/index');
let adminRouter = require('./routes/admin/index');

const secretKey = require('./config/SecretKey').sessionKey;

let app = express();

require('./config/passportUser')(passport);
require('./config/passportAdmin')(passportAdmin);

mongoose.connect('mongodb://localhost/LivingDraw');
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
})); // 세션 활성화

// flash는 세션을 필요로합니다. session 아래에 선언해주셔야합니다.
app.use(flash());

// passport 초기화
app.use(passport.initialize());
app.use(passport.session());
app.use(passportAdmin.initialize());
app.use(passportAdmin.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/goods', goodsRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/border', borderRouter);
app.use('/admin', adminRouter);

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
