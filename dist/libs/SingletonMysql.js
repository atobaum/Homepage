/**
 * Created by Le Reveur on 2017-10-15.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class SingletonMysql {
    constructor() {
    }
    ;
    static checkInit() {
        if (SingletonMysql._instance === null)
            throw new Error("Error: initiate pool first. Use SingletonMysql.init(config)");
    }
    static init(config) {
        if (SingletonMysql._instance)
            throw new Error("Error: already initiated. use SingletonMysql.getPool().");
        else
            SingletonMysql._instance = mysql.createPool(config);
    }
    static getPool() {
        SingletonMysql.checkInit();
        return SingletonMysql._instance;
    }
    /**
     * @async
     * @returns {Promise<IConnection>}
     */
    static getConn() {
        SingletonMysql.checkInit();
        return new Promise((resolve, reject) => {
            SingletonMysql._instance.getConnection((err, conn) => {
                if (err)
                    reject(err);
                else
                    resolve(conn);
            });
        });
    }
    static queries(work) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield SingletonMysql.getConn().catch(e => {
                throw e;
            });
            let result = yield work(conn).catch(e => {
                throw e;
            });
            conn.release();
            return result;
        });
    }
    static transaction(work) {
        return new Promise((resolve, reject) => {
            SingletonMysql.getConn()
                .catch(e => {
                reject(e);
            })
                .then((conn) => {
                conn.beginTransaction(e => {
                    if (e) {
                        conn.release();
                        reject(e);
                    }
                    else {
                        work(conn)
                            .catch(e => {
                            conn.rollback(() => {
                                conn.release();
                                reject(e);
                            });
                        })
                            .then((result) => {
                            conn.commit(e => {
                                if (e)
                                    conn.rollback(() => {
                                        conn.release();
                                        reject(e);
                                    });
                                else {
                                    conn.release();
                                    resolve(result);
                                }
                            });
                        });
                    }
                });
            });
        });
    }
}
SingletonMysql._instance = null;
exports.SingletonMysql = SingletonMysql;
