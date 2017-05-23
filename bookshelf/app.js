var express = require('express');
var async = require('async');
//var path = require('path');
//var favicon = require('serve-favicon');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
var config = require('./config.js'); //development: development, dist: real service
var aladin = require('./libs/aladin.js');
aladin = new aladin(config.api.aladin);
var async = require('async');

var dbController = require('./libs/db_controller.js');
dbController = new dbController(config.db);

app = express();
// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static('../public'));

app.get('/', function (req, res, next) {
    res.render('main', {"title": "Bookshelf"});
});

app.get('/reading/add', function(req, res, next){
    res.render('addReading', {
        "title": "읽은 책 추가하기"
    });
});

app.get('/book/add', function(req, res, next){
    res.render('editBook', {
        title: "책 추가하기"
    });
});

app.get('/book/:isbn13', function(req, res, next){
    res.render('editBook', {

    });
});

app.get('/reading/:id', function(req, res, next){
    dbController.readingInfo(req.params.id, function(err, reading){
        if(err){
            res.render('err', {error: err});
        } else{
            reading.book.title = reading.book.title_ko;
            res.render('viewReading', reading);
        }
    });
});

app.get('/person/:id', function(req, res, next){

});


//add a book
app.post('/book/:isbn13', function(req, res, next){
    var book = JSON.parse(req.body);
    dbController.isExistBook(book.isbn13, function(err){   //when ther exists a book.
            if(err){
                res.render('error', {error:err});
            } else{
                res.redirect('error', {error: '책이 이미 존재합니다.'});
            }
        },
        function(err){ //when book doesn't exist
            if(err){
                res.render('error', {error:err});
                return;
            }
            dbController.addBook(book, function(err){
                if(err){
                    res.render('error', {error:err});
                } else{
                    res.redirect('/bookshelf');
                }
            });
        });
});

//add reading
app.post('/reading', function(req, res, next){
    var reading = req.body;
    var book = JSON.parse(reading.book);
    reading.isbn13 = book.isbn13;
    delete reading.book;
    if(reading.date_finished.length === 0) delete reading.date_finished;
    dbController.isExistBook(book.isbn13, function(err){   //when ther exists a book.
            if(err){
                res.render('error', {error:err});
            } else{
                dbController.addReading(reading, function(err){
                    if(err){
                        res.render('error', {error:err});
                    } else{
                        res.redirect('/bookshelf');
                    }
                });
            }
        },
        function(err){ //when book doesn't exist
            if(err){
                res.render('error', {error:err});
                return;
            }
            dbController.addBook(book, function(err){
                if(err){
                    res.render('error', {error:err});
                } else{
                    dbController.addReading(reading, function(err){
                        if(err){
                            res.render('error', {error:err});
                        } else{
                            res.redirect('/bookshelf');
                        }
                    });
                }
            });
        });
});

app.post('/reading/edit', function(req, res, next){
    dbController.editReading(req.body, function(err){
        if(err){
            res.render('error', {error:err});
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

app.post('/api/reading/add', function(req, res, next){
    var reading = req.body;
    var book = JSON.parse(reading.book);
    reading.isbn13 = book.isbn13;
    delete reading.book;
    if(reading.date_finished.length === 0) delete reading.date_finished;

    async.waterfall([
        function(next){ //is exist the book in database?
            dbController.isExistBook(book.isbn13, function(err){
                if(err){
                    next(err);
                    return;
                }
                next(null, 1);
            }, function(err){
                if(err){
                    next(err);
                    return;
                }
                next(null, 0);
            });
        },
        function (exists, next) { //add book if book doesn't exist.
            if(exists)
                next(null);
            else{
                dbController.addBook(book, function(err){
                    if(err){
                        next(err);
                        return;
                    }
                    next(null);
                });
            }
        },
        function(next){
            dbController.addReading(reading, function(err){
                next(err);
            });
        }
    ], function(err){
        if(err){
            res.json({ok:0, error: err});
        }else{
            res.json({ok:1});
        }
    });
});

app.post('/api/reading/delete', function(req, res){
    dbController.deleteReading(req.body, function(err){
        if(err && err.name=="WrongPasswordError"){
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
    var page = req.query.page || 1;
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
            dbController.getSecretComment(req.query.id, req.query.password, function(err, comment){
                if(err){
                    if(err.name="WrongPasswordError") {
                        res.json({ok: 2}); //Worng Password
                    } else{
                        res.json({ok: 0, error: err});
                    }
                    return;
                }
                res.json({ok:1, result: comment});
            });
            break;
        default:
            res.json({ok:0, error: "Not supported action: "+req.query.action});
    }
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
