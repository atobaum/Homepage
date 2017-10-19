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
const SingletonMysql_1 = require("../SingletonMysql");
const Author_1 = require("./Author");
/**
 * Created by Le Reveur on 2017-10-18.
 */
class Book {
    constructor(title, authors, publisher, publichedDate, isbn13, coverURL) {
        console.log(title, authors, publisher, publichedDate, isbn13, coverURL);
        if (!(title && authors.length && publisher && publichedDate && isbn13))
            throw new Error('constructor argument not fulfilled: Book');
        this.title = title;
        this.authors = authors;
        this.publisher = publisher;
        this.publishedDate = publichedDate;
        this.isbn13 = isbn13;
        this.coverURL = coverURL;
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
                return new Book(row.title_ko, authors, row.name, row.published_date, row.isbn13, row.cover_URL);
            }
        }));
    }
}
exports.Book = Book;
class DetailBook extends Book {
    getBookInfo() {
        throw new Error();
    }

    save() {
        return __awaiter(this, void 0, void 0, function*() {
            return SingletonMysql_1.default.transaction((conn) => __awaiter(this, void 0, void 0, function*() {
                let rows;
                [rows] = yield conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KET UPDATE name=name', [this.publisher]);
                if (rows)
                    this.publisherId = rows.insertedId;
                else {
                    this.publisherId = (yield conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher]))[0].id;
                }
                let data = {
                    isbn13: this.isbn13,
                    title_ko: this.title,
                    title_original: this.originalTitle,
                    subtitle: this.subtitle,
                    pages: this.pages,
                    publisher_id: this.publisherId,
                    published_date: this.publishedDate,
                    cover_URL: this.coverURL
                };
                yield conn.query('INSERT INTO books SET ? ON DUPLICATE KEY UPDATE isbn13=isbn13', [data]);
                // if(newBook)
                //     thisClass.addAuthors(book.isbn13, book.authors, next);
                // else next(null);

            }));
        });
    }
    ;
}
exports.DetailBook = DetailBook;
