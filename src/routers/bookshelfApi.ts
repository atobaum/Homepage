"use strict";
/**
 * @todo reading edit
 */
import {Router} from "express";
import DaumBook from "../libs/bookshelf/DaumBook";
import Reading, {ESearchType} from "../libs/bookshelf/Reading";
import {Book} from "../libs/bookshelf/Book";
import {ESaveType} from "../libs/common";

export default class BookshelfApiRouter {
    private daum: DaumBook;
    private router: Router;

    constructor(config) {
        this.router = Router();
        this.daum = new DaumBook(config.daumApiKey);
        this.routes();
    }

    getRouter() {
        return this.router;
    }

    private routes() {
        this.router.get('/reading/:id', function (req, res) {
            Reading.load(req.params.id, req.userId)
                .catch(e => res.json({ok: 0, error: e}))
                .then(reading => res.json({ok: 1, reading: reading}));
        });

        this.router.post('/reading', function (req, res) {
            let reading = req.body;
            switch (req.query.action.toLowerCase()) {
                case 'edit':
                    if (!reading.userId || reading.userId !== req.user.getId())
                        res.status(403).json({ok: 0, error: new Error("Wrong User.")});
                    else {
                        (new Reading(req.user, null,
                            reading.date[0], checkString(reading.date[1]),
                            reading.rating, checkString(reading.comment), checkString(reading.link),
                            reading.is_secret == '1', ESaveType.EDIT)).setId(reading.id)
                            .save()
                            .catch(e => res.status(400).json({ok: 0, error: e}))
                            .then(() => res.json({ok: 1}));
                    }
                    break;
                case 'new':
                    console.log('new', reading);
                    let book;
                    try {
                        book = Book.createFromJSON(reading.book);
                    } catch (e) {
                        res.json({ok: 0, error: e});
                        return;
                    }
                    (new Reading(req.user, book,
                        reading.date[0], checkString(reading.date[1]),
                        reading.rating, checkString(reading.comment), checkString(reading.link),
                        reading.is_secret == '1', ESaveType.NEW))
                        .save()
                        .catch(e => res.status(400).json({ok: 0, error: e}))
                        .then(() => res.json({ok: 1}));
                    break;
            }
        });

        this.router.get('/searchbook', (req, res) => {
            return this.daum.search(req.query.keyword)
                .catch(e => {
                    res.json({error: e})
                })
                .then(books => res.json({result: books}));
        });

        this.router.get('/recentreading', (req, res) => {
            let page = req.query.page;
            Reading.searchReading(ESearchType.RECENT, null, page)
                .catch(e => {
                    res.json({ok: 0, error: e});
                })
                .then(result => {
                    res.json({ok: 1, result: result})
                });
        });
    }
}
function checkString(str) {
    return str ? str : null;
}
