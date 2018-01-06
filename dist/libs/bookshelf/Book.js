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
Object.defineProperty(exports, "__esModule", {value: true});
const SingletonMysql_1 = require("../common/SingletonMysql");
const Author_1 = require("./Author");
const common_1 = require("../common");
/**
 * Created by Le Reveur on 2017-10-18.
 */
class Book {
    constructor(title, authors, publisher, publichedDate, isbn13, coverURL) {
        if (!(title && authors.length && publisher && publichedDate && isbn13))
            throw new Error('constructor argument not fulfilled: Book' + JSON.stringify([title, authors, publisher, publichedDate, isbn13, coverURL]));
        this.title = title;
        this.authors = authors;
        this.publisher = publisher;
        this.publishedDate = publichedDate;
        this.isbn13 = isbn13;
        this.coverURL = coverURL || "https://dummyimage.com/85x125/8f8f8f/fff";
        this.saveType = common_1.ESaveType.NEW;
    }
    formatAuthors() {
    }
    parseAuthors() {
    }
    static createFromJSON(json) {
        let authors = json.authors.map(item => Author_1.Author.createFromJSON(item));
        try {
            return new Book(json.title, authors, json.publisher, json.publishedDate, json.isbn13, json.coverURL);
        }
        catch (e) {
            console.log('error', e);
            console.log(json);
            throw e;
        }
    }
    static load(isbn13) {
        return SingletonMysql_1.default.queries((conn) => __awaiter(this, void 0, void 0, function*() {
            let [rows] = yield conn.query('SELECT * FROM books JOIN publishers ON publishers.id = books.publisher_id WHERE books.isbn13 = ?', [isbn13]);
            if (rows.length === 0) {
                let error = new Error("There's no such book.");
                error.name = "NoBookError";
                throw error;
            }
            else {
                let row = rows[0];
                let isbn13 = row.isbn13;
                let authors = (yield conn.query('SELECT * FROM authors WHERE book_id=?', [isbn13]))[0];
                authors = authors.map(item => new Author_1.Author(item.name_ko, (item.type_id == 1 ? Author_1.EAuthorType.AUTHOR : Author_1.EAuthorType.TRANSLATOR)));
                let book = new Book(row.title_ko, authors, row.name, row.published_date, row.isbn13, row.cover_URL);
                book.saveType = common_1.ESaveType.READONLY;
                return book;
            }
        }));
    }

    getIsbn13() {
        return this.isbn13;
    }
    save() {
        return __awaiter(this, void 0, void 0, function*() {
            switch (this.saveType) {
                case common_1.ESaveType.READONLY:
                    throw new Error("This book is readonly.");
                case common_1.ESaveType.NEW:
                    return SingletonMysql_1.default.queries((conn) => __awaiter(this, void 0, void 0, function*() {
                        let rows;
                        if ((yield conn.query('SELECT isbn13 FROM books WHERE isbn13=?', [this.isbn13]))[0].length) {
                            let err = new Error("Book already exists and you tried to save new Book.");
                            err.code = 1062;
                            return err;
                        }
                        [rows] = yield conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KEY UPDATE id=id', [this.publisher]);
                        let publisherId;
                        if (rows.insertId !== 0)
                            publisherId = rows.insertId;
                        else {
                            publisherId = (yield conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher]))[0][0].id;
                        }
                        let data = {
                            isbn13: this.isbn13,
                            title_ko: this.title,
                            publisher_id: publisherId,
                            published_date: this.publishedDate,
                            cover_URL: this.coverURL
                        };
                        yield conn.query('INSERT INTO books SET ?', [data]);
                        return yield Promise.all(this.authors.map(author => author.save(this.isbn13)));
                    }));
                case common_1.ESaveType.EDIT:
            }
        });
    }
    ;
}
exports.Book = Book;
class DummyBook extends Book {
    constructor() {
        super("DummyBookTitle", [new Author_1.Author("DummyAuthor", Author_1.EAuthorType.AUTHOR)], "DummyPublisher", "0000-00-00", 1234567890123);
    }
}
exports.DummyBook = DummyBook;
class DetailBook extends Book {
    getBookInfo() {
        throw new Error();
    }

    static createFromBook(book) {
    }
}
exports.DetailBook = DetailBook;
