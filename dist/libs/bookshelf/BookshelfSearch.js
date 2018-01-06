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
    static recentReadings(start, num = 10) {
        return __awaiter(this, void 0, void 0, function*() {
            let rows = (yield SingletonMysql_1.default.query('SELECT * FROM readings WHERE deleted = 0 ORDER BY date_started DESC LIMIT ?, ?', [start, num]))[0];
            let result = yield Promise.all(rows.map(reading => Reading_1.default.makeFromDbRow(reading)));
            let totalReadings = (yield SingletonMysql_1.default.query('SELECT count(*) FROM readings'))[0][0]['count(*)'];
            return [result, totalReadings];
        });
    }

    static unfinishedReadings(user) {
        return __awaiter(this, void 0, void 0, function*() {
            console.log(user);
            let rows = (yield SingletonMysql_1.default.query('SELECT * FROM readings WHERE user_id = ? AND date_finished IS NULL AND deleted = 0 ORDER BY date_started', [user.getId()]))[0];
            let result = yield Promise.all(rows.map(reading => Reading_1.default.makeFromDbRow(reading)));
            return result;
        });
    }
}
exports.default = BookshelfSearch;
