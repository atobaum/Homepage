"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var SingletonMysql_1 = require("../SingletonMysql");
var Author_1 = require("./Author");
/**
 * Created by Le Reveur on 2017-10-18.
 */
var Book = /** @class */ (function () {
    function Book(title, authors, publisher, publichedDate, isbn13, coverURL) {
        if (!(title && authors.length && publisher && publichedDate && isbn13))
            throw new Error('constructor argument not fulfilled: Book' + JSON.stringify([title, authors, publisher, publichedDate, isbn13, coverURL]));
        this.title = title;
        this.authors = authors;
        this.publisher = publisher;
        this.publishedDate = publichedDate;
        this.isbn13 = isbn13;
        this.coverURL = coverURL;
    }
    Book.prototype.formatAuthors = function () {
    };
    Book.prototype.parseAuthors = function () {
    };
    Book.createFromJSON = function (json) {
        var authors = json.authors.map(function (item) { return Author_1.Author.createFromJSON(item); });
        try {
            return new Book(json.title, authors, json.publisher, json.publishedDate, json.isbn13, json.coverURL);
        }
        catch (e) {
            console.log(json);
            throw e;
        }
    };
    Book.load = function (isbn13) {
        var _this = this;
        return SingletonMysql_1["default"].queries(function (conn) { return __awaiter(_this, void 0, void 0, function () {
            var rows, error, row, isbn13_1, authors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, conn.query('SELECT * FROM books JOIN publishers ON publishers.id = books.publisher_id WHERE books.isbn13 = ?', [isbn13])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (!(rows.length === 0)) return [3 /*break*/, 2];
                        error = new Error("There's no such book.");
                        error.name = "NoBookError";
                        throw error;
                    case 2:
                        row = rows[0];
                        isbn13_1 = row.isbn13;
                        return [4 /*yield*/, conn.query('SELECT * FROM authors WHERE book_id=?', [isbn13_1])];
                    case 3:
                        authors = (_a.sent())[0];
                        authors = authors.map(function (item) { return new Author_1.Author(item.name_ko, (item.type_id == 1 ? Author_1.EAuthorType.AUTHOR : Author_1.EAuthorType.TRANSLATOR)); });
                        return [2 /*return*/, new Book(row.title_ko, authors, row.name, row.published_date, row.isbn13, row.cover_URL)];
                }
            });
        }); });
    };
    Book.prototype.getIsbn13 = function () {
        return this.isbn13;
    };
    Book.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, SingletonMysql_1["default"].transaction(function (conn) { return __awaiter(_this, void 0, void 0, function () {
                        var rows, publisherId, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KEY UPDATE id=id', [this.publisher])];
                                case 1:
                                    rows = (_a.sent())[0];
                                    console.log(rows);
                                    console.log(this.coverURL);
                                    if (!rows) return [3 /*break*/, 2];
                                    publisherId = rows.insertId;
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher])];
                                case 3:
                                    publisherId = (_a.sent())[0].id;
                                    _a.label = 4;
                                case 4:
                                    data = {
                                        isbn13: this.isbn13,
                                        title_ko: this.title,
                                        publisher_id: publisherId,
                                        published_date: this.publishedDate,
                                        cover_URL: this.coverURL
                                    };
                                    return [4 /*yield*/, conn.query('INSERT INTO books SET ? ON DUPLICATE KEY UPDATE isbn13=isbn13', [data])];
                                case 5:
                                    _a.sent();
                                    // if(newBook)
                                    //     thisClass.addAuthors(book.isbn13, book.authors, next);
                                    // else next(null);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ;
    return Book;
}());
exports.Book = Book;
var DetailBook = /** @class */ (function (_super) {
    __extends(DetailBook, _super);
    function DetailBook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DetailBook.prototype.getBookInfo = function () {
        throw new Error();
    };
    DetailBook.createFromBook = function (book) {
    };
    DetailBook.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, SingletonMysql_1["default"].transaction(function (conn) { return __awaiter(_this, void 0, void 0, function () {
                        var rows, _a, data;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KET UPDATE name=name', [this.publisher])];
                                case 1:
                                    rows = (_b.sent())[0];
                                    if (!rows) return [3 /*break*/, 2];
                                    this.publisherId = rows.insertedId;
                                    return [3 /*break*/, 4];
                                case 2:
                                    _a = this;
                                    return [4 /*yield*/, conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher])];
                                case 3:
                                    _a.publisherId = (_b.sent())[0].id;
                                    _b.label = 4;
                                case 4:
                                    data = {
                                        isbn13: this.isbn13,
                                        title_ko: this.title,
                                        title_original: this.originalTitle,
                                        subtitle: this.subtitle,
                                        pages: this.pages,
                                        publisher_id: this.publisherId,
                                        published_date: this.publishedDate,
                                        cover_URL: this.coverURL
                                    };
                                    return [4 /*yield*/, conn.query('INSERT INTO books SET ? ON DUPLICATE KEY UPDATE isbn13=isbn13', [data])];
                                case 5:
                                    _b.sent();
                                    // if(newBook)
                                    //     thisClass.addAuthors(book.isbn13, book.authors, next);
                                    // else next(null);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ;
    return DetailBook;
}(Book));
exports.DetailBook = DetailBook;
