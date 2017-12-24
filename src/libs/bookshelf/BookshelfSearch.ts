import SingletonMysql from "../SingletonMysql";
import Reading from "./Reading";
import User from "../User";
/**
 * Created by Le Reveur on 2017-12-21.
 */

export default class BookshelfSearch {
    constructor() {

    }

    /**
     *
     * @param start
     * @param num
     * @returns {Promise<[any,any]>} [readings, totalReadings]
     */
    static async recentReadings(start: number, num: number = 10) {
        let rows = (await SingletonMysql.query('SELECT * FROM readings WHERE deleted = 0 ORDER BY date_started DESC LIMIT ?, ?', [start, num]))[0];
        let result = await Promise.all(rows.map(reading => Reading.makeFromDbRow(reading)));
        let totalReadings = (await SingletonMysql.query('SELECT count(*) FROM readings'))[0][0]['count(*)'];
        return [result, totalReadings];
    }

    static async unfinishedReadings(user: User) {
        console.log(user);
        let rows = (await SingletonMysql.query('SELECT * FROM readings WHERE user_id = ? AND date_finished IS NULL AND deleted = 0 ORDER BY date_started', [user.getId()]))[0];
        let result = await Promise.all(rows.map(reading => Reading.makeFromDbRow(reading)));
        return result;
    }
}
