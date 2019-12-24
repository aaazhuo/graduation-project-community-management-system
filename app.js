var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var ajaxRouter = require('./routes/ajax');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html',ejs.__express);
app.set('view engine', 'html');



app.use(logger('dev'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'communityManage',
  cookie: {maxAge:86400000},//一天
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ajax', ajaxRouter);

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
