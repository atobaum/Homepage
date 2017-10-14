"use strict";

if(!process.env.NODE_ENV){
    console.log('NODE_ENV is undefined. Set to development.');
}

//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'development' ) ? 'development' : 'production';
//process.env.NODE_ENV = "development";
global.env = process.env.NODE_ENV;
let express = require('express');
//var path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let subdomain = require('express-subdomain');
let mysql = require('mysql');

let bookshelf = require('../bookshelf/app');
let wiki = require('../wiki/app');

let app = express();
// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/../views/' + 'favicon.ico'));
app.use(express.static(__dirname + '/../views'));
if(process.env.NODE_ENV === 'development') {
    let logger = require('morgan');
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//session setting
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
let config = require('../dist/config');
let sessionStore = new MySQLStore({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    dateStrings: 'date'
});

app.use(session({
    secret: 'fdkjl%31nc124*|c',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
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

app.get('/api/auth/login', function(req, res){
    wiki.login(req.query.id, req.query.password)
        .then(([result, user]) => {
            if(result == 1){
                let sess = req.session;
                sess.userId = user.user_id;
                sess.userNickname = user.nickname;
                sess.userAdmin = user.admin;
                if(req.query.autoLogin == "true")
                    sess.cookie.maxAge = 1000*60*60*24*7; //7 days
            }
            res.json({ok:result});
        })
        .catch(e => {
            res.json({ok: 0, error: err});
        });
});

// subdomain
app.use(subdomain('bookshelf', bookshelf));
app.use(subdomain('wiki', wiki));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
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