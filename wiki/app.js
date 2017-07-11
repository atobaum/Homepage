"use strict";
let express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

let config = require('./config.js');
let app = express();

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

let wiki = require('./libs/wiki');
wiki = new wiki(config);


app.get('/', function (req, res) {
    res.redirect('/wiki/view/index');
});

app.get(/\/search\/(.*)/, function(req, res){
    res.render('noPage', {title: decodeURI(req.params[0]), session: req.session});
});

app.get(/\/view\/(.*)/, function (req, res) {
    let title = decodeURI(req.params[0]);
    let userId = req.session ? req.session.userId : null;
    wiki.getParsedPage(title, userId)
        .then(page => {
            if (page.noPage) {
                res.redirect('/wiki/search/' + encodeURI(title));
            } else if (page.noPrivilege) {
                res.render('noPrivilege', {wikiTitle: title, priType: 4, session: req.session});
            } else {
                res.render('viewPage', {wiki: page, session: req.session});
            }
        })
        .catch(e => {
            res.render('error', {error: e, session: req.session});
        });
});

app.get(/\/edit\/(.*)/, function (req, res) {
    let title = decodeURI(req.params[0]);
    let userId = req.session ? req.session.userId : null;
    let newPage = req.query.newPage;
    wiki.getRawPage(title, userId)
        .then(page => {
            if (page.noPage === 1) { //no namespace
                res.render('error', {
                    error: {message: "You tried edit a page whose namespace is not exists."},
                    session: req.session
                });
            } else if (page.noPage === 2) {
                let data = {
                    title: page.title,
                    newPage: true,
                };
                res.render('editPage', {wiki: data, session: req.session});
            } else if (page.noPrivilege) {
                res.render('noPrivilege', {wikiTitle: page.title, priType: 4, session: req.session});
            } else {
                console.log(page);
                res.render('editPage', {wiki: page, session: req.session});
                console.log(page);
            }
        })
        .catch(e => {
            res.render('error', {error: e, session: req.session});
        });
});

app.get(/\/history\/(.*)/, function (req, res) {
    res.render('error', {
        error: {message: "준비중..."}
    });
});

//backlinks
app.get(/\/xref\/(.*)/, function (req, res) {
    res.render('error', {
        error: {message: "준비중..."}
    });
});


//for backend
app.get(/\/delete\/(.*)/, function (req, res) {
    res.render('error', {
        error: {message: "준비중..."}
    });
});

app.post(/\/edit\/(.*)/, function (req, res) {
    let title = decodeURI(req.params[0]);
    let data = req.body;
    data.title = title;
    let userId = (req.session && req.session.userId) ? req.session.userId : null;
    data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    wiki.editPage(data, userId)
        .then(() => {
            res.redirect('/wiki/view/' + encodeURI(title));
        }).catch(e => {
        if (e.name === "NO_PRIVILEGE") {
            res.render('noPrivilege', {wikiTitle: title, priType: 2, session: req.session});
        } else res.render('error', {error: e, session: req.session});
    });
});

app.post('/api/parse', function(req, res){
    console.log(req.body);
    res.json(wiki.parse(req.body.text, req.body.title));
});

app.get(/\/api\/parse\/(.*)/, function(req, res){
    let title = decodeURI(req.params[0]);
    let userId = req.session ? req.session.userId : null;
    wiki.getParsedPage(title, userId, function(err, page){
        if(err){
            if(err.name === 'NO_PAGE_ERROR') {
                res.json({ok:2, error: err});
            } else{
                res.json({ok:0, error: err});
            }
        }else{
            res.json({ok:1, result: page});
        }
    });
});

app.get(/\/api\/rawtext\/(.*)/, function(req, res){
    let title = decodeURI(req.params[0]);
    let userId = req.session ? req.session.userId : null;
    wiki.getRawPage(title, userId, function(err, page){
        if(err){
            if(err.name === 'NO_PAGE_ERROR') {
                res.json({ok:2, error: err});
            } else{
                res.json({ok:0, error: err});
            }
        }else{
            res.json({ok:1, result: page});
        }
    });
});

app.post(/\/api\/edit\/(.*)/, function(req, res){
    let title = decodeURI(req.params[0]);
    let data = req.body;
    data.title = title;
    data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let userId = req.session ? req.session.userId : null;
    wiki.editPage(data, userId)
        .then(() => {
            res.json({ok: 1})
        }).catch(e => {
        console.log(e);
        res.json({ok: 0, error: err})
    });
});

app.get('/api/titleSearch', (req, res) => {
    wiki.searchTitles(req.query.q)
        .then(result => {
            res.json({ok: 1, result: result})
        })
        .catch(e => {
            res.json({ok: 0, error: e});
        });
});

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
    res.render('error', {session: req.session});
});

app.login = (uname, pass)=> wiki.login(uname, pass);
app.userInfo = wiki.userInfo;
app.createUser = wiki.createUser;
app.updateUser = wiki.updateUser;
app.checkUsername = wiki.checkUsername;
app.checkNickname = wiki.checkNickname;

module.exports = app;
