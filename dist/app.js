"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
if (!process.env.NODE_ENV) {
    console.log('NODE_ENV is undefined. Set to development.');
}
//process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'development' ) ? 'development' : 'production';
const express = require("express");
const SingletonMysql_1 = require("./libs/common/SingletonMysql");
//session setup
const User_1 = require("./libs/common/User");
const api_1 = require("./routers/api");
let path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let config = require('./config');
let app = express();
// view engine setup
app.set('views', __dirname + path.sep + 'views');
app.set('view engine', 'pug');
// middleware setup
// app.use(favicon(__dirname + '/../views/' + 'favicon.ico'));
app.use('/static', express.static(__dirname + '/../public'));
if (process.env.NODE_ENV === 'development') {
    let logger = require('morgan');
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
SingletonMysql_1.default.init(config.db);
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
let sessionStore = new MySQLStore({}, SingletonMysql_1.default.getPool().pool);
app.use(session({
    secret: 'fdkjl%31nc124*|c',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.use((req, res, next) => {
    if (req.session.user) {
        req.user = new User_1.default(req.session.user.id, req.session.user.username, req.session.user.adim);
        res.locals.user = req.session.user;
        req.userId = req.session.user.id;
        next();
    }
    else
        next();
});
//Router setup
let api = new api_1.default();
api.use('/bookshelf', (new (require('./routers/bookshelfApi').default)(config.bookshelf)).getRouter());
api.use('/wiki', require('./routers/WikiApi').default);
api.use('/note', require('./routers/noteApi').default);
app.use('/api', api.getRouter());
app.get('/', function (req, res) {
    res.redirect('/wiki/view/index');
});
app.use('/wiki', require('./routers/wiki').default);
app.get('/bookshelf', (req, res) => res.render('bookshelf/main'));
app.get('/note', (req, res) => res.render('note/main'));
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/auth/logout', function (req, res) {
    req.session.destroy();
    res.redirect(req.header('Referer'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
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
