"use strict";
import {Router} from "express";
import DaumBook from "../libs/bookshelf/DaumBook";
export default class BookshelfRouter {
    private router: Router;
    private daum: DaumBook;

    constructor(config) {
        this.daum = new DaumBook(config.daumApiKey);
        this.router = Router();
        this.routes();
    }

    getRouter() {
        return this.router;
    }

    private routes() {
        this.router.get('/', function (req, res) {
            res.render('bookshelf/main', {"title": "Bookshelf", session: req.session});
        });

        this.router.get('/reading/add', function (req, res, next) {
            res.render('bookshelf/addReading', {
                "title": "읽은 책 추가하기", session: req.session
            });
        });

        this.router.get('/book/add', function (req, res, next) {
            res.render('bookshelf/editBook', {
                title: "책 추가하기",
                session: req.session
            });
        });

        this.router.get('/book/:isbn13', function (req, res, next) {
            res.render('bookshelf/editBook', {
                session: req.session
            });
        });

        // this.router.get('/reading/:id', function(req, res, next){
        //     dbController.readingInfo(req.params.id, req.session.userId, function (err, reading) {
        //         if (err) {
        //             res.render('err', {error: err, session: req.session});
        //         } else {
        //             reading.book.title = reading.book.title_ko;
        //             res.render('bookshelf/viewReading', {
        //                 reading: reading,
        //                 session: req.session
        //             });
        //         }
        //     });
        // });

        // this.router.post('/book/add', function(req, res, next){
        //     let book = JSON.parse(req.body);
        //     dbController.addBook(book, (err)=>{
        //         if(err) res.render('bookshelf/error');
        //         else res.redirect('/bookshelf/book/'+book.isbn13);
        //     });
        // });

        // this.router.post('/reading', function(req, res, next){
        //     let reading = req.body;
        //     reading.book = JSON.parse(reading.book);
        //     if(req.session.userId){
        //         reading.user_id = req.session.userId;
        //         reading.user = req.session.userNickname;
        //     }
        //     dbController.addReading(reading, function(err){
        //         if(err) res.render('bookshelf/error', {error:err});
        //         else res.redirect('/bookshelf');
        //     });
        // });

        // this.router.post('/reading/edit', function(req, res, next){
        //     let reading = req.body;
        //     reading.user_id = req.session.userId;
        //     dbController.editReading(req.body, function(err){
        //         if(err){
        //             res.render('bookshelf/error', {error:err,
        //                 session: req.session});
        //         } else{
        //             res.redirect('/bookshelf');
        //         }
        //     });
        // });

        // this.router.post('/api/reading/delete', function(req, res){
        //     dbController.deleteReading(req.body, function(err){
        //         if(err && err.name==="WrongPasswordError"){
        //             res.json({ok:2});
        //         } else if(err){
        //             res.json({ok:0, error:err});
        //         }else {
        //             res.json({ok:1});
        //         }
        //     });
        // });

        // this.router.get('/api/bookinfo/aladin', function(req, res, next){
        //     aladin.bookInfo(req.query.isbn13, function(err, book){
        //         if(err){
        //             res.json({ok:0, error:err});
        //         } else{
        //             res.json({ok:1, result: book});
        //         }
        //     });
        // });

        this.router.get('/api/searchbook', (req, res) => {
            return this.daum.search(req.query.keyword)
                .catch(e => {
                    res.json({error: e})
                })
                .then(books => res.json({result: books}));
        });

        // this.router.get('/api/recentreading', function(req, res){
        //     let page = req.query.page || 1;
        //     dbController.searchReading({type: 'recent', page: page}, function(err, result){
        //         if(err){
        //             res.json({ok:0, error: err});
        //         }else{
        //             res.json({ok:1, result: result});
        //         }
        //     });
        // });
        //
        // this.router.get('/api/comment', function(req, res){
        //     if(!req.query.action){
        //         res.json({ok:0, error: "No action query."});
        //         return;
        //     }
        //
        //     switch (req.query.action){
        //         case 'get':
        //             dbController.getSecretComment(req.query.id, req.session.userId, req.query.password, function (err, comment) {
        //                 if (err) {
        //                     if (err.name = "WrongPasswordError") {
        //                         res.json({ok: 2}); //Worng Password
        //                     } else {
        //                         res.json({ok: 0, error: err});
        //                     }
        //                     return;
        //                 }
        //                 res.json({ok: 1, result: comment});
        //             });
        //             break;
        //         default:
        //             res.json({ok:0, error: "Not supported action: "+req.query.action});
        //     }
        // });
    }
}
