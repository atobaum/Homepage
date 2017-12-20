"use strict";
exports.__esModule = true;
require('source-map-support').install();
if (!process.env.NODE_ENV) {
    console.log('NODE_ENV is undefined. Set to development.');
}
//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'development' ) ? 'development' : 'production';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var app = express();
// view engine setup
app.set('views', __dirname + path.sep + 'views');
app.set('view engine', 'pug');
// middleware setup
// app.use(favicon(__dirname + '/../views/' + 'favicon.ico'));
app.use(express.static(__dirname + '/../public'));
if (process.env.NODE_ENV === 'development') {
    var logger = require('morgan');
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//session setup
var SingletonMysql_1 = require("./libs/SingletonMysql");
var bookshelf_1 = require("./routers/bookshelf");
var wiki_1 = require("./routers/wiki");
var User_1 = require("./libs/User");
SingletonMysql_1["default"].init(config.db);
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, SingletonMysql_1["default"].getPool().pool);
app.use(session({
    secret: 'fdkjl%31nc124*|c',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.use(function (req, res, next) {
    if (req.session.user) {
        req.user = new User_1["default"](req.session.user.id, req.session.user.username, req.session.user.adim);
        res.locals.user = req.session.user;
        next();
    }
    else if (req.method == "POST")
        res.render("error", { error: new Error("로그인 하세요.") });
    else
        next();
});
//Router setup
var bookshelf = require('./routers/bookshelf');
app.use('/bookshelf', (new bookshelf_1["default"](config.bookshelf)).getRouter());
app.use('/wiki', (new wiki_1.WikiRouter()).getRouter());
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/auth/logout', function (req, res) {
    req.session.destroy();
    res.redirect(req.header('Referer'));
});
app.get('/api/auth/login', function (req, res) {
    User_1["default"].login(req.query.id, req.query.password)
        .then(function (user) {
        req.session.user = user;
        if (req.query.autoLogin == "true")
            session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; //7 days
        res.json({ ok: 1 });
    })["catch"](function (e) {
        res.json({ ok: e.code, error: e });
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
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
