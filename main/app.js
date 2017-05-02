if(!process.env.NODE_ENV){
    console.log('NODE_ENV is nod defined. Set to development.');
}
//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'development' ) ? 'development' : 'production';
//process.env.NODE_ENV = "development";
global.env = process.env.NODE_ENV;
var express = require('express');
//var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var subdomain = require('express-subdomain');
var index = require('../routes/index');
var bookshelf = require('../bookshelf/app');
var wiki = require('../wiki/app');

var app = express();
// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/../public/' + 'favicon.ico'));
app.use(express.static(__dirname+'/../public'));
if(process.env.NODE_ENV == 'development') {
    logger = require('morgan');
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/bookshelf', bookshelf);
app.use('/wiki', wiki);

// subdomain
app.use(subdomain('bookshelf', bookshelf));
app.use(subdomain('wiki', wiki));

/*
//for test
app.get('/echo', function(req, res, next){
    res.render('echo');
});

app.post('/echo', function(req, res, next){
    console.log('post');
    var data = req.body;
    console.log(req.body);
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
