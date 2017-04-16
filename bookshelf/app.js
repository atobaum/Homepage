var express = require('express');
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
        "title": "Add Book"
    });
});

/**
*/
app.get('/book/:isbn13', function(req, res, next){

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
    dbController.readingInfo(req.params.id, function(err, reading){
        if(err){
            res.render('err', {error: err});
        } else{
            console.log(reading);
            reading.title = reading.title_ko;
            res.render('viewReading', reading);
        }
    });

    //res.render('viewReading', {title: 'view reading', id: req.params.id, date_started: '2016-11-11', date_finished: '2016-12-12', rating: 5, comment: '너무너무 좋아요', book:{title: '제목은 가나다', authors:[{id:1, type: 'author', name: '한구루'}], formatted_authors:'한구루 지음.', publisher: '여기는 출판사', published_date: '2014-12-09', cover_url:'http://image.aladin.co.kr/product/748/90/coversum/1593272839_2.jpg'}})
});

//add reading
app.post('/reading', function(req, res, next){
    console.log('post: add reading');
    var reading = req.body;
    console.log(reading);
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
    console.log(req.body);
    dbController.editReading(req.body, function(err){
        if(err){
            res.render('error', {error:err});
        } else{
            res.redirect('/bookshelf');
        }
    });
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


app.post('/api/reading/add', function(req, res, next){
    var reading = req.body;
    var book;
    if(typeof(reading.book) == "string")
        book = JSON.parse(reading.book);
    else {
        book = reading.book;
    }

    reading.isbn13 = book.isbn13;
    delete reading.book;

    console.log('POST: /api/reading/add');
    console.log(reading);
    console.log(book);
    dbController.isExistBook(book.isbn13, function(err){   //when ther exists a book.
        if(err){
            res.json({ok:0, error:err});
        } else{
            dbController.addReading(reading, function(err){
                if(err){
                    res.json({ok:0, error:err});
                } else{
                    res.json({ok:1});
                }
            });
        }
    },
    function(err){ //when book doesn't exist
        if(err){
            res.json({ok:0, error:err});
            return;
        }
        dbController.addBook(book, function(err){
            if(err){
                res.json({ok:0, error:err});
            } else{
                dbController.addReading(data, function(err){
                    if(err){
                        res.json({ok:0, error:err});
                    } else{
                        res.json({ok:1});
                    }
                });
            }
        });
    });
});

app.post('/api/reading/edit', function(req, res, next){
    dbController.editReading(req.body, function(err){
        if(err){
            res.json({ok: 0, error:err});
        } else{
            res.json({ok: 1});
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
        res.json({results: data});
    });
});

app.get('/api/recentreading', function(req, res){
    var page = req.query.page || 1;
    dbController.searchReading({page: page}, function(err, result){
        if(err){
            res.json({ok:0});
        }else{
            res.json({ok:1, result: result});
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
