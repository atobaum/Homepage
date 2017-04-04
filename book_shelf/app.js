var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js').dev; //dev: development, real: real service

var dbController = require('./lib/db_controller.js');
var config = require('./config.js').dev;
var aladin = require('./lib/aladin.js');
aladin = new aladin(config.api.aladin);
//var dbInit = require('./lib/db_init.js');
//dbInit(config.db);
//console.log("Done");
app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
    res.render('main', {"title": "Bookshelf"});
    var page;
    try{
        page = parseInt(req.query.page) || 1;
    } catch(e){
        res.render('error', new Error('잘못된 페이지 접근'));
    }

    dbController({'page': page}, function(err, result){
        if(err){
            res.render('error', new Error('몰라몰라 난몰라'));
        }
        res.render('viewReadings', result);
    });
});

app.get('/addreading', function(req, res, next){
    res.render('addread', {
        "title": "Add Book"
    });
});

/**
*/
app.get('/book/:isbn13', function(req, res, next){

});

//add a book
app.post('/book/:isbn13', function(req, res, next){
    dbController.isExistBook(req.params.isbn13, function(err){   //when ther exists a book.
        if(err)
            res.render('error', {error: err});
        res.render('error', {
            error:{
                status: "이미 존재하는 책 입니다."
            }
        }); //이미 존재하는 책.
        //res.redirect('/bookshelf/book/'+req.params.isbn13);
    },
    function(err){
        if(err)
            res.render('error', {error: err});

        var data = req.body;
        aladin.bookInfo(req.params.isbn13, function(book){
            dbController.addBook(book, function(err){
                res.redirect('/bookshelf/book/'+req.params.isbn13);
            });
        });
    });
});

//edit a book
app.put('/book/:isbn13', function(req, res, next){
    var book = req.body;
    dbController.editBook(req.params.isbn13, book, function(err){
        if(err){
            res.render('error', {error:err});
        }
        res.redirect('/bookshelf');
    });
});

//delete a book
app.delete('/book/:isbn13', function(req, res, next){
    var book = req.body;
    dbController.deleteBook(req.params.isbn13, book, function(err){
        if(err){
            res.render('error', {error:err});
        }
        res.redirect('/bookshelf');
    });
});


app.get('/reading/:id', function(req, res, next){

});

//add reading
app.post('/reading', function(req, res, next){

});

app.put('/reading/:id', function(req, res, next){

});

app.delete('/reading/:id', function(req, res, next){

});


app.get('/person/:id', function(req, res, next){

});

app.post('/person', function(req, res, next){

});

app.put('/person/:id', function(req, res, next){

});

app.delete('/person/:id', function(req, res, next){

});



//api
app.post('/api/addread', function(req, res, next){ //to delete
    var data = req.body;
    dbController.isExistBook(data.isbn13, function(err){   //when ther exists a book.
        if(err)
            res.render('error', {error: err});
        dbController.addRead(data);
        res.redirect('/bookshelf');
    },
    function(err){
        if(err)
            res.render('error', {error: err});
        aladin.bookInfo(data.isbn13, function(book){
            dbController.addBook(book, function(){
                dbController.addRead(data);
                res.redirect('/bookshelf');
            });
        });
    });
});

app.post('/api/reading/add', function(req, res, next){
    var data = req.body;
    dbController.isExistBook(data.isbn13, function(err){   //when ther exists a book.
        if(err)
            res.render('error', {error: err});
        dbController.addRead(data);
        res.redirect('/bookshelf');
    },
    function(err){
        if(err)
            res.render('error', {error: err});
        aladin.bookInfo(data.isbn13, function(book){
            dbController.addBook(book, function(){
                dbController.addRead(data);
                res.redirect('/bookshelf');
            });
        });
    });
});

app.post('/api/reading/edit', function(req, res, next){

});

app.post('/api/reading/edit', function(req, res, next){

});

app.get('/api/searchbook', function(req, res){
    res.writeHead(200, {'Content-Type' : "application/json;charset=UTF-8"});
    aladin.search("Keyword", req.query.word, function(data){
        res.end(JSON.stringify(data));
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
