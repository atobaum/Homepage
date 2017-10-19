import SingletonMysql from "../SingletonMysql";
import {Book} from "./Book";
/**
 * Created by Le Reveur on 2017-10-18.
 */
export enum ESearchType{
    RECENT = "recent"
}
export default class Reading {
    private id: number;
    private date: [string, string];
    private rating: number;
    private comment: string;
    private link: string;
    private isSecret: boolean;
    private book: Book;
    private user: string;

    constructor(user, book: Book, startDate, finishedDate, rating, comment, link, isSecret) {
        this.book = book;
        this.date = [startDate, finishedDate];
        this.rating = rating;
        this.comment = comment;
        this.link = link;
        this.isSecret = isSecret == '1';
        this.user = user;
    }

    setId(id: number) {
        if (this.id)
            throw new Error('id already setted.');
        this.id = id;
    }

    // async readingInfo(bookId, userId, callback){
    //     return await SingletonMysql.queries(async conn=>{
    //         let [rows] = conn.query('SELECT * FROM readings WHERE id = ?', [bookId]);
    //         if(rows.length === 0){
    //             throw new Error('잘못된 id:' + bookId);
    //         }
    //         let reading = rows[0];
    //         if(reading.deleted == 1)
    //             throw new Error('DELETED_DATA');
    //         if(reading.is_secret && reading.user_id !== userId){
    //             delete reading.comment;
    //             reading.hideComment = true;
    //         }
    //         delete reading.password;
    //         bookInfo(reading.book_id, (err, book)=>{
    //                 if(err && err.name === "NoBookError")
    //                     return reading;
    //                 if(err)
    //                     throw err;
    //                 reading.book = book;
    //                 delete reading.book_id;
    //                 return reading;
    //             }
    //         );
    //     });
    // }

    async delete(): Promise<void> {
        SingletonMysql.queries(async conn => {
            await conn.query('UPDATE readings SET deleted=1 WHERE id=?', [this.id])
        });

    }

    // async save(){
    //     if(reading.date_finished.length === 0) delete reading.date_finished;
    //     if(reading.comment.length === 0) delete reading.comment;
    //     let book = reading.book;
    //     async.series([
    //         (next) => {
    //             thisClass.addBook(book, next);
    //         },
    //         (next) => {
    //             let data = {
    //                 date_started: reading.date_started,
    //                 date_finished: reading.date_finished,
    //                 book_id: reading.book.isbn13,
    //                 rating: reading.rating,
    //                 comment: reading.comment,
    //                 link: reading.link,
    //                 user_id: reading.user_id,
    //                 user: reading.user,
    //                 is_secret: reading.is_secret,
    //                 password: reading.password
    //             };
    //             thisClass.conn.query('INSERT INTO readings SET ?', [data], next);
    //         }
    //     ], callback);
    // }

    // editReading(reading, callback){
    //     let data = {
    //         date_started: reading.date_started,
    //         date_finished: (reading.date_finished.length ? reading.date_finished: null),
    //         rating: reading.rating,
    //         comment: reading.comment,
    //         link: reading.link,
    //         is_secret: reading.is_secret
    //     };
    //     let id = reading.id;
    //     let query = 'UPDATE readings SET ? WHERE id = ? AND (user_id=? OR password = ?)';
    //     this.conn.query(query, [data, id, reading.user_id, reading.password], function(err, rows){
    //         if(err){
    //             callback(err);
    //         } else{
    //             if(rows.affectedRows === 0){
    //                 callback(new Error('해당하는 책이 없다.:' + id));
    //             } else
    //                 callback(null, rows);
    //         }
    //     });
    // }

    static async searchReading(type: ESearchType, keyword, page: number = 1) {
        let articlePerPage = 10;
        let result;
        switch (type) {
            case ESearchType.RECENT:
                let rows = (await SingletonMysql.query('SELECT * FROM readings WHERE deleted = 0 ORDER BY date_started DESC LIMIT ?, ?', [(page - 1) * articlePerPage, articlePerPage]))[0];
                result = await Promise.all(rows.map(async reading => {
                        let temp = new Reading(reading.user,
                            await Book.load(reading.book_id),
                            reading.date_started,
                            reading.date_finished,
                            reading.rating,
                            reading.comment,
                            reading.link,
                            reading.is_secret);
                        temp.id = reading.id;
                        return temp;
                    })
                );
        }

        let numOfReadings = (await SingletonMysql.query('SELECT count(*) FROM readings'))[0][0]['count(*)'];
        let pages = Math.ceil(numOfReadings / articlePerPage);
        return [result, pages]
    }
}