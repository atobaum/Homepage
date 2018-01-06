/**
 * Created by Le Reveur on 2017-10-15.
 */
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
let mysql = require('mysql');
let mysql2 = require('mysql2/promise');
class SingletonMysql {
    constructor() {
    }
    ;
    static checkInit() {
        if (SingletonMysql.pool === null)
            throw new Error("Error: initiate pool first. Use SingletonMysql.init(config)");
    }
    static init(config) {
        if (SingletonMysql.pool)
            throw new Error("Error: already initiated. use SingletonMysql.getPool().");
        else
            SingletonMysql.pool = mysql2.createPool(config);
    }
    static getPool() {
        SingletonMysql.checkInit();
        return SingletonMysql.pool;
    }
    static escape(str) {
        return mysql.escape(str);
    }
    /**
     * @async
     * @returns {Promise<IConnection>}
     */
    static getConn() {
        SingletonMysql.checkInit();
        return SingletonMysql.pool.getConnection();
    }
    /**
     *
     * @async
     * @param query
     * @param params
     */
    static query(query, params) {
        return SingletonMysql.getPool().query(query, params);
    }
    static queries(work) {
        return __awaiter(this, void 0, void 0, function*() {
            let conn, result;
            try {
                conn = yield SingletonMysql.getConn();
                result = yield work(conn);
            }
            catch (e) {
                throw e;
            }
            finally {
                conn.release();
            }
            return result;
        });
    }
    static transaction(work) {
        return __awaiter(this, void 0, void 0, function*() {
            let conn = yield SingletonMysql.getConn();
            let result;
            try {
                yield conn.beginTransaction();
                result = yield work(conn);
                yield conn.commit();
            }
            catch (e) {
                yield conn.rollback();
                conn.release();
                throw e;
            }
            conn.release();
            return result;
        });
    }
}
SingletonMysql.pool = null;
exports.default = SingletonMysql;
