"use strict";
import {Router} from "express";
import DaumBook from "../libs/bookshelf/DaumBook";
import Reading, {ESearchType} from "../libs/bookshelf/Reading";
import {Book} from "../libs/bookshelf/Book";
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
            res.render('bookshelf/main', {"title": "Bookshelf"});
        });

        this.router.get('/reading/add', function (req, res, next) {
            res.render('bookshelf/addReading', {
                "title": "읽은 책 추가하기"
            });
        });

        this.router.get('/book/add', function (req, res, next) {
            res.render('bookshelf/editBook', {
                title: "책 추가하기",
            });
        });

        this.router.get('/book/:isbn13', function (req, res, next) {
            res.render('bookshelf/editBook');
        });

        this.router.get('/reading/:id', (req, res, next) => {
            Reading.load(req.params.id, req.session.userId)
                .catch(e => res.render('bookshelf/err', {error: e}))
                .then(reading => res.render('bookshelf/viewReading', {reading: reading}));
        });

        // this.router.post('/book/add', function(req, res, next){
        //     let book = JSON.parse(req.body);
        //     dbController.addBook(book, (err)=>{
        //         if(err) res.render('bookshelf/error');
        //         else res.redirect('/bookshelf/book/'+book.isbn13);
        //     });
        // });

        this.router.post('/reading', async (req, res) => {
            if (!req.session.userId)
                res.render("bookshelf/error", {error: new Error("로그인 하세요.")});
            else {
                let reading = req.body;
                let tempBook = JSON.parse(reading.book);
                reading.user_id = req.session.userId;
                reading.user = req.session.userNickname;
                let book = Book.createFromJSON(JSON.parse(reading.book));

                (new Reading(reading.user, book, reading.date_started, reading.date_finished, reading.rating, reading.comment, reading.link, reading.is_secret == '1')).save()
                    .catch(e => res.render('bookshelf/error', {error: e}))
                    .then(() => res.redirect('/bookshelf'))
            }
        });

        // this.router.post('/reading/edit', function(req, res, next){
        //     let reading = req.body;
        //     reading.user_id = req.session.userId;
        //     dbController.editReading(req.body, function(err){
        //         if(err){
        //             res.render('bookshelf/error', {error:err,
        //                 });
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

        this.router.get('/api/recentreading', (req, res) => {
            let page = req.query.page;
            Reading.searchReading(ESearchType.RECENT, null, page)
                .catch(e => {
                    res.json({ok: 0, error: e});
                    console.log(e)
                })
                .then(result => {
                    res.json({ok: 1, result: result})
                });
        });
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
