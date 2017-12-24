"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = {
            label: 0, sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
            }, trys: [], ops: []
        }, f, y, t, g;
        return g = {
            next: verb(0),
            "throw": verb(1),
            "return": verb(2)
        }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
            return this;
        }), g;
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }

        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return {value: op[1], done: false};
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];
                y = 0;
            } finally {
                f = t = 0;
            }
            if (op[0] & 5) throw op[1];
            return {value: op[0] ? op[1] : void 0, done: true};
        }
    };
exports.__esModule = true;
var express_1 = require("express");
var DaumBook_1 = require("../libs/bookshelf/DaumBook");
var Reading_1 = require("../libs/bookshelf/Reading");
var Book_1 = require("../libs/bookshelf/Book");
var path = require("path");
var BookshelfRouter = /** @class */ (function () {
    function BookshelfRouter(config) {
        this.daum = new DaumBook_1["default"](config.daumApiKey);
        this.router = express_1.Router();
        this.routes();
    }

    BookshelfRouter.prototype.getRouter = function () {
        return this.router;
    };
    BookshelfRouter.prototype.routes = function () {
        var _this = this;
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
                title: "책 추가하기"
            });
        });
        this.router.get('/book/:isbn13', function (req, res, next) {
            res.render('bookshelf' + path.sep + 'editBook');
        });
        this.router.get('/reading/:id', function (req, res, next) {
            Reading_1["default"].load(req.params.id, req.session.userId)["catch"](function (e) {
                return res.render('error', {error: e});
            })
                .then(function (reading) {
                    return res.render('bookshelf' + path.sep + 'viewReading', {reading: reading});
                });
        });
        // this.router.post('/book/add', function(req, res, next){
        //     let book = JSON.parse(req.body);
        //     dbController.addBook(book, (err)=>{
        //         if(err) res.render('bookshelf\error');
        //         else res.redirect('/bookshelf\book/'+book.isbn13);
        //     });
        // });
        this.router.post('/reading', function (req, res) {
            return __awaiter(_this, void 0, void 0, function () {
                var reading, tempBook, book;
                return __generator(this, function (_a) {
                    reading = req.body;
                    tempBook = JSON.parse(reading.book);
                    reading.user_id = req.session.userId;
                    reading.user = req.session.userNickname;
                    book = Book_1.Book.createFromJSON(JSON.parse(reading.book));
                    (new Reading_1["default"](req.user, book, reading.date_started, this.checkEmptyString(reading.date_finished), reading.rating, this.checkEmptyString(reading.comment), this.checkEmptyString(reading.link), reading.is_secret == '1')).save()["catch"](function (e) {
                        return res.render('error', {error: e});
                    })
                        .then(function () {
                            return res.redirect('/bookshelf');
                        });
                    return [2 /*return*/];
                });
            });
        });
        // this.router.post('/reading/edit', function(req, res, next){
        //     let reading = req.body;
        //     reading.user_id = req.session.userId;
        //     dbController.editReading(req.body, function(err){
        //         if(err){
        //             res.render('bookshelf\error', {error:err,
        //             });
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
        this.router.get('/api/searchbook', function (req, res) {
            return _this.daum.search(req.query.keyword)["catch"](function (e) {
                res.json({error: e});
            })
                .then(function (books) {
                    return res.json({result: books});
                });
        });
        this.router.get('/api/recentreading', function (req, res) {
            var page = req.query.page;
            Reading_1["default"].recentReadings(Reading_1.ESearchType.RECENT, null, page)["catch"](function (e) {
                res.json({ok: 0, error: e});
                console.log(e);
            })
                .then(function (result) {
                    res.json({ok: 1, result: result});
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
    };
    BookshelfRouter.prototype.checkEmptyString = function (str) {
        return str ? str : null;
    };
    return BookshelfRouter;
}());
exports["default"] = BookshelfRouter;
