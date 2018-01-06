"use strict";
import {Router} from "express";
import DaumBook from "../libs/bookshelf/DaumBook";
import Reading from "../libs/bookshelf/Reading";
import {Book} from "../libs/bookshelf/Book";
import {ESaveType} from "../libs/common";
import Search from "../libs/bookshelf/BookshelfSearch";

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
                .then(reading => res.json({ok: 1, result: reading}));
        });

        this.router.post('/reading', function (req, res) {
            let reading = JSON.parse(req.body.data);
            switch (req.query.action.toLowerCase()) {
                case 'edit':
                    if (reading.userId && reading.userId == req.user.getId()) {
                        let newreading = new Reading(req.user, null,
                            reading.date[0], checkString(reading.date[1]),
                            reading.rating, checkString(reading.link),
                            reading.is_secret == '1', ESaveType.EDIT);

                        newreading.setId(reading.id)
                            .save()
                            .catch(e => {
                                res.status(400).json({ok: 0, error: e.stack})
                            })
                            .then(() => res.json({ok: 1}));
                    } else {
                        res.status(403).json({ok: 0, error: new Error("Wrong User.")});
                    }
                    break;
                case 'new':
                    try {
                        let book = Book.createFromJSON(reading.book);
                        reading = new Reading(req.user, book,
                            reading.date[0], checkString(reading.date[1]),
                            reading.rating, checkString(reading.link),
                            reading.is_secret == '1', ESaveType.NEW);
                    } catch (e) {
                        res.json({ok: 0, error: e.stack});
                        return;
                    }
                    reading.save()
                        .catch(e => {
                            res.status(400).json({ok: 0, error: e.stack});
                        })
                        .then(() => res.json({ok: 1}));
                    break;
            }
        });
        this.router.delete('/reading', (req, res) => {
            try {
                let id = parseInt(req.query.id);
                if (!id)
                    throw new Error("id is not a nunber: " + req.query.id);
                (Reading.load(id, req.userId))
                    .then(reading => {
                        return reading.delete();
                    })
                    .then(() => {
                        res.json({ok: 1});
                    })
            } catch (e) {
                res.status(400).json({ok: 0, error: e.stack});
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
            let readingsPerPage = 10;
            let page = (parseInt(req.query.page) - 1) * readingsPerPage;
            Search.recentReadings(page, readingsPerPage)
                .catch(e => {
                    res.json({ok: 0, error: e});
                })
                .then(result => {
                    result[1] = Math.ceil(result[1] / readingsPerPage);
                    res.json({ok: 1, result: result});
                });
        });

        this.router.get('/currentreading', (req, res) => {
            if (req.user)
                Search.unfinishedReadings(req.user)
                    .then(result => {
                        res.json({ok: 1, result: result});
                    })
                    .catch(e => {
                        res.json({ok: 0, error: e.stack});
                    });
            else
                res.json({ok: 1, result: []});
        });
    }
}

function checkString(str) {
    return str ? str : null;
}
