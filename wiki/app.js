var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

var config = require('./config.js');
app = express();

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

var wiki = require('./libs/wiki');
wiki = new wiki(config);


app.get('/', function (req, res, next) {
    res.redirect('/wiki/view/index');
});

app.get(/\/search\/(.*)/, function(req, res){
   res.render('noPage', {title: decodeURI(req.params[0]), session: req.session});
});

app.get(/\/view\/(.*)/, function(req, res, next){
    var title = decodeURI(req.params[0]);
    var userId = req.session ? req.session.userId : null;
    wiki.getParsedPage(title, userId, function(err, page){
        if(err){
            if(err.name == 'NO_PAGE_ERROR') {
                res.redirect('/wiki/search/'+ encodeURI(title));

            } else if (err.name == "NO_PRIVILEGE"){
                res.render('noPrivilege', {wikiTitle: title, priType: 4 ,session:req.session});
            } else{
                res.render('error', {error: err, session: req.session});
            }
        }else{
            res.render('viewPage', {wiki: page, session: req.session});
        }
    });
});

app.get(/\/edit\/(.*)/, function(req, res, next){
    var title = decodeURI(req.params[0]);
    var userId = req.session ? req.session.userId : null;
    wiki.getRawPage(title, userId, function(err, page){
        if(err){
            if(err.name == 'NO_PAGE_ERROR') {
                page = {
                    title: title,
                    rawContent: ''
                };
                res.render('editPage', {wiki: page, session: req.session});
            } else if (err.name == "NO_PRIVILEGE"){
                res.render('noPrivilege', {wikiTitle: title, priType: 4 ,session:req.session});
            } else{
                res.render('error', {error: err, session: req.session});
                return;
            }
        } else{
            res.render('editPage', {wiki: page, session: req.session});
        }
    });
});

app.get(/\/history\/(.*)/, function(req, res, next){
    res.render('main', {
        "title": "history page: " + req.params.page, session: req.session
    });
});

//backlinks
app.get(/\/xref\/(.*)/, function(req, res, next){
    res.render('main', {
        "title": "backlink page: " + req.params.page, session: req.session
    });
});


//for backend
app.get(/\/delete\/(.*)/, function(req, res, next){
    res.render('main', {
        "title": "delete page: " + req.params.page,
    });
});

app.post(/\/edit\/(.*)/, function(req, res, next){
    var title = decodeURI=(req.params[0]);
    var data = req.body;
    data.title = title;
    userId = req.session ? req.session.userId : null;
    data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    wiki.editPage(data, userId, function(err){
        if(err){
            if (err.name == "NO_PRIVILEGE"){
                res.render('noPrivilege', {wikiTitle: title, priType: 2 ,session:req.session});
            } else res.render('error', {error: err, session: req.session});
        }else{
            res.redirect('/wiki/view/'+encodeURI(title));
        }
    });
});

app.post('/api/parse', function(req, res){
    res.json(wiki.parse(req.body.text));
});

app.get(/\/api\/parse\/(.*)/, function(req, res){
    var title = decodeURI(req.params[0]);
    var userId = req.session ? req.session.userId : null;
    wiki.getParsedPage(title, userId, function(err, page){
        if(err){
            if(err.name == 'NO_PAGE_ERROR') {
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
    var title = decodeURI(req.params[0]);
    var userId = req.session ? req.session.userId : null;
    wiki.getRawPage(title, userId, function(err, page){
        if(err){
            if(err.name == 'NO_PAGE_ERROR') {
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
    var title = decodeURI(req.params[0]);
    var data = req.body;
    data.title = title;
    data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var userId = req.session ? req.session.userId : null;
    wiki.editPage(data, userId, function(err){
        if(err){
            res.json({ok:0, error: err});
        }else{
            res.json({ok:1});
        }
    });
});

app.get('/api/titleSearch', function(req, res){
   wiki.searchTitles(req.query.q, function(err, titles){

       if(err){
           res.json({ok:0 ,error: err});
       }
       else{
           res.json({ok:1, result: titles});
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
  res.render('error', {session: req.session});
});

app.login = function(uname, passwd, callback){
    wiki.login(uname, passwd, callback);
};
app.userInfo = wiki.userInfo;
app.createUser = wiki.createUser;
app.updateUser = wiki.updateUser;
app.checkUsername = wiki.checkUsername;
app.checkNickname = wiki.checkNickname;

module.exports = app;
