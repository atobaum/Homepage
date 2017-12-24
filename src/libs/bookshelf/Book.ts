import SingletonMysql from "../SingletonMysql";
import {Author, EAuthorType} from "./Author";
import {ESaveType} from "../common";
/**
 * Created by Le Reveur on 2017-10-18.
 */

export class Book {
    protected isbn13: number;
    protected title: string;
    protected authors: Author[];
    protected publisher: string;
    protected publishedDate: string;
    protected coverURL: string;
    public description: string;
    private saveType: ESaveType;

    constructor(title: string, authors: Author[], publisher: string, publichedDate: string, isbn13: number, coverURL?) {
        if (!(title && authors.length && publisher && publichedDate && isbn13))
            throw new Error('constructor argument not fulfilled: Book' + JSON.stringify([title, authors, publisher, publichedDate, isbn13, coverURL]));
        this.title = title;
        this.authors = authors;
        this.publisher = publisher;
        this.publishedDate = publichedDate;
        this.isbn13 = isbn13;
        this.coverURL = coverURL || "https://dummyimage.com/85x125/8f8f8f/fff";
        this.saveType = ESaveType.NEW;
    }

    formatAuthors() {

    }

    parseAuthors() {

    }

    static createFromJSON(json: any) {
        let authors = json.authors.map(item => Author.createFromJSON(item));
        try {
            return new Book(json.title, authors, json.publisher, json.publishedDate, json.isbn13, json.coverURL);
        } catch (e) {
            console.log('error', e);
            console.log(json);
            throw e;
        }
    }

    static load(isbn13: string): Promise<Book> {
        return SingletonMysql.queries(async conn => {
            let [rows] = await conn.query('SELECT * FROM books JOIN publishers ON publishers.id = books.publisher_id WHERE books.isbn13 = ?', [isbn13]);
            if (rows.length === 0) {
                let error = new Error("There's no such book.");
                error.name = "NoBookError";
                throw error;
            } else {
                let row = rows[0];
                let isbn13 = row.isbn13;
                let authors = (await conn.query('SELECT * FROM authors WHERE book_id=?', [isbn13]))[0];
                authors = authors.map(item => new Author(item.name_ko, (item.type_id == 1 ? EAuthorType.AUTHOR : EAuthorType.TRANSLATOR)));
                let book = new Book(row.title_ko, authors, row.name, row.published_date, row.isbn13, row.cover_URL);
                book.saveType = ESaveType.READONLY;
                return book;
            }
        });
    }

    getIsbn13() {
        return this.isbn13;
    }

    async save() {
        switch (this.saveType) {
            case ESaveType.READONLY:
                throw new Error("This book is readonly.");
            case ESaveType.NEW:
                return SingletonMysql.queries(async conn => {
                    let rows;
                    if ((await conn.query('SELECT isbn13 FROM books WHERE isbn13=?', [this.isbn13]))[0].length) {
                        let err: any = new Error("Book already exists and you tried to save new Book.");
                        err.code = 1062;
                        return err;
                    }

                    [rows] = await conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KEY UPDATE id=id', [this.publisher]);
                    let publisherId;
                    if (rows.insertId !== 0)
                        publisherId = rows.insertId;
                    else {
                        publisherId = (await conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher]))[0][0].id;
                    }
                    let data = {
                        isbn13: this.isbn13,
                        title_ko: this.title,
                        publisher_id: publisherId,
                        published_date: this.publishedDate,
                        cover_URL: this.coverURL
                    };
                    await conn.query('INSERT INTO books SET ?', [data]);
                    return await Promise.all(this.authors.map(author => author.save(this.isbn13)));
                });
            case ESaveType.EDIT:
        }
    };
}

export class DummyBook extends Book {
    constructor() {
        super("DummyBookTitle", [new Author("DummyAuthor", EAuthorType.AUTHOR)], "DummyPublisher", "0000-00-00", 1234567890123);
    }
}

export class DetailBook extends Book {
    private subtitle: string;
    private pages: number;
    private language: string;
    private link: string;
    private checked: boolean;
    private originalTitle: string;
    private publisherId: number;

    getBookInfo(): Promise<void> {
        throw new Error();
    }

    static createFromBook(book: Book) {

    }

    // async save() {
    //     return SingletonMysql.transaction(async conn => {
    //         let rows;
    //         [rows] = await conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KET UPDATE name=name', [this.publisher]);
    //         if (rows)
    //             this.publisherId = rows.insertedId;
    //         else {
    //             this.publisherId = (await conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher]))[0].id;
    //         }
    //         let data = {
    //             isbn13: this.isbn13,
    //             title_ko: this.title,
    //             title_original: this.originalTitle,
    //             subtitle: this.subtitle,
    //             pages: this.pages,
    //             publisher_id: this.publisherId,
    //             published_date: this.publishedDate,
    //             cover_URL: this.coverURL
    //         };
    //         await conn.query('INSERT INTO books SET ? ON DUPLICATE KEY UPDATE isbn13=isbn13', [data]);
    //         // if(newBook)
    //         //     thisClass.addAuthors(book.isbn13, book.authors, next);
    //         // else next(null);
    //         return;
    //     });
    // };
}