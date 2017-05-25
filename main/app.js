if(!process.env.NODE_ENV){
    console.log('NODE_ENV is nod defined. Set to development.');
}

var users = [{
    id: 1,
    username: 'admin',
    password: '1234',
    nickname: "사람"
}];

//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'development' ) ? 'development' : 'production';
//process.env.NODE_ENV = "development";
global.env = process.env.NODE_ENV;
var express = require('express');
//var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var subdomain = require('express-subdomain');
var session = require('express-session');
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
app.use(session({
    secret: 'fdkjl%31nc124*|c',
    resave: false,
    saveUninitialized: true
}));

app.use('/bookshelf', bookshelf);
app.use('/wiki', wiki);

app.get('/', function(req, res){
    res.render('index', {session: req.session});
});

app.get('/login', function(req, res){
   res.render('login', {session: req.session});
});

app.get('/auth/logout', function(req, res){
   req.session.destroy();
   res.redirect(req.header('Referer'));
});

app.get('/auth/login', function(req, res){
    for(var i = 0; i < users.length; i++){
        var user = users[i];
        if(user.username == req.query.id){
            if(user.password == req.query.password) {
                var sess = req.session;
                sess.userId = user.id;
                sess.userNickname = user.nickname;
                if(req.query.autoLogin == "true")
                    sess.cookie.maxAge = 1000*60*60*24*7; //7 days
                res.json({ok: 1});
                return;
            }
            res.json({ok:2});
            return;
        }
    }
    res.json({ok:0});
});

app.get('/api/auth/login', function(req, res){
    for(var i = 0; i < users.length; i++){
        var user = users[i];
        if(user.username == req.query.id){
            if(user.password == req.query.password) {
                var sess = req.session;
                sess.id = user.id;
                sess.nickname = user.nickname;
                if(req.query.autoLogin == "true")
                    sess.cookie.maxAge = 1000*60*60*24*7; //7 days
                res.json({ok: 1});
                return;
            }
            res.json({ok:2});
            return;
        }
    }
    res.json({ok:0});
});

// subdomain
app.use(subdomain('bookshelf', bookshelf));
app.use(subdomain('wiki', wiki));

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
