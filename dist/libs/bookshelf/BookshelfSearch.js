"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SingletonMysql_1 = require("../common/SingletonMysql");
const Reading_1 = require("./Reading");
/**
 * Created by Le Reveur on 2017-12-21.
 */
class BookshelfSearch {
    constructor() {
    }
    /**
     *
     * @param start
     * @param num
     * @returns {Promise<[any,any]>} [readings, totalReadings]
     */
    static async recentReadings(start, num = 10) {
        let rows = (await SingletonMysql_1.default.query('SELECT * FROM readings WHERE deleted = 0 ORDER BY date_started DESC LIMIT ?, ?', [start, num]))[0];
        let result = await Promise.all(rows.map(reading => Reading_1.default.makeFromDbRow(reading)));
        let totalReadings = (await SingletonMysql_1.default.query('SELECT count(*) FROM readings'))[0][0]['count(*)'];
        return [result, totalReadings];
    }
    static async unfinishedReadings(user) {
        let rows = (await SingletonMysql_1.default.query('SELECT * FROM readings WHERE user_id = ? AND date_finished IS NULL AND deleted = 0 ORDER BY date_started', [user.getId()]))[0];
        let result = await Promise.all(rows.map(reading => Reading_1.default.makeFromDbRow(reading)));
        return result;
    }
}
exports.default = BookshelfSearch;
