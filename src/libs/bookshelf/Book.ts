import SingletonMysql from "../SingletonMysql";
import {Author} from "./Author";
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

    constructor(title: string, authors: Author[], publisher: string, publichedDate: string, isbn13: number, coverURL?) {
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
}

export class DetailBook extends Book {
    private subtitle: string;
    private pages: number;
    private language: string;
    private description: string;
    private link: string;
    private checked: boolean;
    private originalTitle: string;
    private publisherId: number;

    getBookInfo(): Promise<void> {
        let query = 'select books.title_ko, books.subtitle, publishers.name, books.published_date, books.pages, books.title_original, books.language, books.description, books.link,  books.cover_URL, books.isbn13, books.checked from books JOIN publishers ON publishers.id = books.publisher_id where books.isbn13 = ?';
        return SingletonMysql.queries(async conn => {
            let [rows] = conn.query(query, [this.isbn13]);
            if (rows.length === 0) {
                let error = new Error("There's no such book.");
                error.name = "NoBookError";
                throw error;
            }
            // await this.updateAuthors(rows[0]);
        });
    }

    async save() {
        return SingletonMysql.transaction(async conn => {
            let rows;
            [rows] = await conn.query('INSERT INTO publishers SET name=? ON DUPLICATE KET UPDATE name=name', [this.publisher]);
            if (rows)
                this.publisherId = rows.insertedId;
            else {
                this.publisherId = (await conn.query('SELECT id FROM publishers WHERE name=?', [this.publisher]))[0].id;
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
            await conn.query('INSERT INTO books SET ? ON DUPLICATE KEY UPDATE isbn13=isbn13', [data]);
            // if(newBook)
            //     thisClass.addAuthors(book.isbn13, book.authors, next);
            // else next(null);
            return;
        });
    };
}