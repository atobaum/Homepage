"use strict";
require('source-map-support').install();
if (!process.env.NODE_ENV) {
    console.log('NODE_ENV is undefined. Set to development.');
}

//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'development' ) ? 'development' : 'production';
let express = require('express');
//var path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let config = require('./config');

let app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// middleware setup
// app.use(favicon(__dirname + '/../views/' + 'favicon.ico'));
app.use(express.static(__dirname + '/../public'));
if (process.env.NODE_ENV === 'development') {
    let logger = require('morgan');
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//session setup
import SingletonMysql from "./libs/SingletonMysql";
//Router setup
// let bookshelf = require('../routers/bookshelf');
// app.use('/bookshelf', bookshelf);
import {WikiRouter} from "./routers/wiki";


SingletonMysql.init(config.db);
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
let sessionStore = new MySQLStore({}, SingletonMysql.getPool().pool);
app.use(session({
    secret: 'fdkjl%31nc124*|c',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));


app.use('/wiki', (new WikiRouter()).getRouter());

app.get('/', function (req, res) {
    res.render('index', {session: req.session});
});

app.get('/login', function (req, res) {
    res.render('login', {session: req.session});
});

app.get('/auth/logout', function (req, res) {
    req.session.destroy();
    res.redirect(req.header('Referer'));
});

// app.get('/api/auth/login', function (req, res) {
//     wiki.login(req.query.id, req.query.password)
//         .then(([result, user]) => {
//             if (result == 1) {
//                 let sess = req.session;
//                 sess.userId = user.user_id;
//                 sess.userNickname = user.nickname;
//                 sess.userAdmin = user.admin;
//                 if (req.query.autoLogin == "true")
//                     sess.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; //7 days
//             }
//             res.json({ok: result});
//         })
//         .catch(e => {
//             res.json({ok: 0, error: err});
//         });
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;