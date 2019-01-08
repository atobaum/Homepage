"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SingletonMysql_1 = require("../common/SingletonMysql");
const Book_1 = require("./Book");
const common_1 = require("../common");
/**
 * Created by Le Reveur on 2017-10-18.
 */
class Reading {
    constructor(user, book, startDate, finishedDate, rating, comment, isSecret, link, saveType = common_1.ESaveType.NEW) {
        if (saveType === common_1.ESaveType.NEW && book == null)
            throw new Error("book required when construct Reading instance in New mode");
        this.book = book;
        this.date = [startDate, finishedDate];
        this.rating = rating;
        this.comment = comment;
        this.link = link;
        this.isSecret = isSecret;
        this.user = user;
        this.saveType = saveType;
    }
    setId(id) {
        if (this.id)
            throw new Error('id already setted.');
        this.id = id;
        return this;
    }
    static async load(id, userId) {
        let rows = (await SingletonMysql_1.default.query('SELECT * FROM readings WHERE id = ?', [id]))[0];
        if (rows.length === 0) {
            throw new Error('잘못된 id:' + id);
        }
        let reading = rows[0];
        return Reading.makeFromDbRow(reading, userId);
    }
    ;
    static async makeFromDbRow(reading, userId) {
        if (reading.deleted == 1)
            throw new Error('DELETED_DATA');
        if (reading.is_secret && reading.user_id !== userId) {
            delete reading.comment;
        }
        let temp = new Reading(reading.user, await Book_1.Book.load(reading.book_id).catch(e => {
            return new Book_1.DummyBook();
        }), reading.date_started, reading.date_finished, reading.rating, (reading.is_secret && (reading.user_id !== userId) ? null : reading.comment), reading.link, reading.is_secret);
        temp.id = reading.id;
        temp.userId = reading.user_id;
        temp.own = userId && reading.user_id == userId;
        return temp;
    }
    delete() {
        return SingletonMysql_1.default.query('UPDATE readings SET deleted=1 WHERE id=?', [this.id]);
    }
    async save() {
        let data = {
            date_started: this.date[0],
            date_finished: this.date[1],
            rating: this.rating,
            comment: this.comment,
            link: this.link,
            user: this.user.getUsername(),
            is_secret: this.isSecret
        };
        if (this.saveType === common_1.ESaveType.NEW) {
            await this.book.save();
            data.book_id = this.book.getIsbn13();
            data.user_id = this.user.getId();
            await SingletonMysql_1.default.query('INSERT INTO readings SET ?', [data]);
            return;
        }
        else if (this.saveType === common_1.ESaveType.EDIT) {
            await SingletonMysql_1.default.query('UPDATE readings SET ? WHERE id=? AND user_id=?', [data, this.id, this.user.getId()]);
            return;
        }
    }
}
exports.default = Reading;
