"use strict";
const express = require('express');
const async = require('async');
//var path = require('path');
//var favicon = require('serve-favicon');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
let config = require('./config.js'); //development: development, dist: real service
let aladin = require('./libs/aladin.js');
aladin = new aladin(config.api.aladin);

let dbController = require('./libs/db_controller.js');
dbController = new dbController(config.db);

let app = express();
// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /views
//app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static('../views'));

app.get('/', function (req, res, next) {
    res.render('main', {"title": "Bookshelf", session: req.session});
});

app.get('/reading/add', function(req, res, next){
    res.render('addReading', {
        "title": "읽은 책 추가하기", session: req.session});
});

app.get('/book/add', function(req, res, next){
    res.render('editBook', {
        title: "책 추가하기",
        session: req.session
    });
});

app.get('/book/:isbn13', function(req, res, next){
    res.render('editBook', {
        session: req.session
    });
});

app.get('/reading/:id', function(req, res, next){
    dbController.readingInfo(req.params.id, req.session.userId, function (err, reading) {
        if (err) {
            res.render('err', {error: err, session: req.session});
        } else {
            reading.book.title = reading.book.title_ko;
            res.render('viewReading', {
                reading: reading,
                session: req.session
            });
        }
    });
});

app.get('/person/:id', function(req, res, next){

});

//add a book
app.post('/book/add', function(req, res, next){
    let book = JSON.parse(req.body);
    dbController.addBook(book, (err)=>{
        if(err) res.render('error');
        else res.redirect('/bookshelf/book/'+book.isbn13);
    });
});

//add reading
app.post('/reading', function(req, res, next){
    let reading = req.body;
    reading.book = JSON.parse(reading.book);
    if(req.session.userId){
        reading.user_id = req.session.userId;
        reading.user = req.session.userNickname;
    }
    dbController.addReading(reading, function(err){
        if(err) res.render('error', {error:err});
        else res.redirect('/bookshelf');
    });
});

app.post('/reading/edit', function(req, res, next){
    let reading = req.body;
    reading.user_id = req.session.userId;
    dbController.editReading(req.body, function(err){
        if(err){
            res.render('error', {error:err,
                session: req.session});
        } else{
            res.redirect('/bookshelf');
        }
    });
});


app.post('/person', function(req, res, next){

});

app.put('/person/:id', function(req, res, next){

});

app.delete('/person/:id', function(req, res, next){

});

app.post('/api/reading/delete', function(req, res){
    dbController.deleteReading(req.body, function(err){
        if(err && err.name==="WrongPasswordError"){
            res.json({ok:2});
        } else if(err){
            res.json({ok:0, error:err});
        }else {
            res.json({ok:1});
        }
    });
});

app.get('/api/bookinfo/aladin', function(req, res, next){
    aladin.bookInfo(req.query.isbn13, function(err, book){
        if(err){
            res.json({ok:0, error:err});
        } else{
            res.json({ok:1, result: book});
        }
    });
});

app.get('/api/searchbook', function(req, res){
    aladin.search("Keyword", req.query.keyword, function(err, data){
        res.json({result: data});
    });
});

app.get('/api/recentreading', function(req, res){
    let page = req.query.page || 1;
    dbController.searchReading({type: 'recent', page: page}, function(err, result){
        if(err){
            res.json({ok:0, error: err});
        }else{
            res.json({ok:1, result: result});
        }
    });
});

app.get('/api/comment', function(req, res){
    if(!req.query.action){
        res.json({ok:0, error: "No action query."});
        return;
    }

    switch (req.query.action){
        case 'get':
            dbController.getSecretComment(req.query.id, req.session.userId, req.query.password, function (err, comment) {
                if (err) {
                    if (err.name = "WrongPasswordError") {
                        res.json({ok: 2}); //Worng Password
                    } else {
                        res.json({ok: 0, error: err});
                    }
                    return;
                }
                res.json({ok: 1, result: comment});
            });
            break;
        default:
            res.json({ok:0, error: "Not supported action: "+req.query.action});
    }
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

module.exports = app;
