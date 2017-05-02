var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

var config = require('./config.js'); //development: development, real: real service
app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('development'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

var wiki = require('./libs/wiki');
wiki = new wiki(config);


app.get('/', function (req, res, next) {
    res.redirect('/wiki/view/index');
});

app.get('/view/:page', function(req, res, next){
    var title = decodeURIComponent(req.params.page);
    wiki.viewPage(title, function(err, page){
        if(err){
            if(err.name == 'NO_PAGE_ERROR') {
                res.render('noPage', {title: req.params.page});
            } else{
                res.render('error', {error: err});
            }
        }else{
            res.render('viewPage', {wiki: page});
        }
    });
});

app.get('/edit/:page', function(req, res, next){
    var title = decodeURIComponent(req.params.page);
    wiki.rawPage(title, function(err, page){
        if(err){
            if(err.name == 'NO_PAGE_ERROR') {
                page = {
                    title: title,
                    rawContent: ''
                };
            } else{
                res.render('error', {error: err});
            }
        }
        res.render('editPage', {wiki: page});
    });
});

app.get('/history/:page', function(req, res, next){
    res.render('main', {
        "title": "history page: " + req.params.page
    });
});

//backlinks
app.get('/xref/:page', function(req, res, next){
    res.render('main', {
        "title": "backlink page: " + req.params.page
    });
});


//for backend
app.get('/delete/:page', function(req, res, next){
    res.render('main', {
        "title": "delete page: " + req.params.page
    });
});

app.post('/edit/:page', function(req, res, next){
    var title = decodeURIComponent(req.params.page);
    var data = req.body;
    data.title = title;
    data.user = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    wiki.editPage(data, function(err){
        if(err){
            res.render('error', {error: err});
        }else{
            res.redirect('/wiki/view/'+req.params.page);
        }
    });
});

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
