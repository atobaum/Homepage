"use strict";
/**
 * @todo reading edit
 */
import {Router} from "express";
import DaumBook from "../libs/bookshelf/DaumBook";
import Reading, {ESearchType} from "../libs/bookshelf/Reading";
import {Book} from "../libs/bookshelf/Book";
import * as path from "path";
import {ESaveType} from "../libs/common";
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
            res.render('bookshelf' + path.sep + 'main', {"title": "Bookshelf"});
        });

        this.router.get('/reading/add', function (req, res, next) {
            res.render('bookshelf' + path.sep + 'addReading', {
                "title": "읽은 책 추가하기"
            });
        });

        this.router.get('/book/add', function (req, res, next) {
            res.render('bookshelf' + path.sep + 'editBook', {
                title: "책 추가하기",
            });
        });

        this.router.get('/book/:isbn13', function (req, res, next) {
            res.render('bookshelf' + path.sep + 'editBook');
        });

        this.router.get('/reading/:id', (req, res, next) => {
            Reading.load(req.params.id, req.userId)
                .catch(e => res.render('error', {error: e}))
                .then(reading => {
                    console.log(reading);
                    res.render('bookshelf' + path.sep + 'viewReading', {reading: reading})
                });
        });


        // this.router.post('/book/add', function(req, res, next){
        //     let book = JSON.parse(req.body);
        //     dbController.addBook(book, (err)=>{
        //         if(err) res.render('bookshelf\error');
        //         else res.redirect('/bookshelf\book/'+book.isbn13);
        //     });
        // });

        this.router.post('/reading', async (req: any, res) => {
            let reading = req.body;
            reading.user_id = req.session.user.id;
            reading.user = req.session.user.username;
            let book = Book.createFromJSON(JSON.parse(reading.book));

            (new Reading(req.user, book, reading.date_started, BookshelfRouter.checkEmptyString(reading.date_finished), reading.rating, BookshelfRouter.checkEmptyString(reading.comment), BookshelfRouter.checkEmptyString(reading.link), reading.is_secret == '1', ESaveType.NEW)).save()
                .catch(e => res.render('error', {error: e}))
                .then(() => res.redirect('/bookshelf'));
        });

        this.router.post('/reading/edit', function (req: any, res) {
            let reading = req.body;
            reading.user_id = req.session.user.id;
            reading.user = req.session.user.username;
            console.log(reading);

            (new Reading(req.user, null, reading.date_started, BookshelfRouter.checkEmptyString(reading.date_finished), reading.rating, BookshelfRouter.checkEmptyString(reading.comment), BookshelfRouter.checkEmptyString(reading.link), reading.is_secret == '1', ESaveType.EDIT)).setId(reading.id).save()
                .catch(e => res.render('error', {error: e}))
                .then(() => res.redirect('/bookshelf'));
        });

        this.router.get('/api/reading/:id', function (req, res) {
            switch (req.query.action.toLowerCase()) {
                case 'get':
                    Reading.load(req.params.id, req.userId)
                        .catch(e => res.json({ok: 0, error: e}))
                        .then(reading => res.json({ok: 1, reading: reading}));
                    break;
            }
        });

        this.router.post('/api/reading/:id', function (req, res) {
            switch (req.query.action.toLoserString()) {
                case 'edit':
                    break;
            }
        });

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
    }

    static checkEmptyString(str) {
        return str ? str : null;
    }
}
