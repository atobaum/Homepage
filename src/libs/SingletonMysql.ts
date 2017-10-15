/**
 * Created by Le Reveur on 2017-10-15.
 */
"use strict";

const promiseMysql = require('promise-mysql');
import * as mysql from "mysql";
export class SingletonMysql {
    private constructor() {
    };

    private static _instance: mysql.IPool = null;

    private static checkInit(): void {
        if (SingletonMysql._instance === null)
            throw new Error("Error: initiate pool first. Use SingletonMysql.init(config)");
    }

    public static init(config: mysql.IPoolConfig): void {
        if (SingletonMysql._instance)
            throw new Error("Error: already initiated. use SingletonMysql.getPool().");
        else
            SingletonMysql._instance = mysql.createPool(config);
    }

    public static getPool(): mysql.IPool {
        SingletonMysql.checkInit();
        return SingletonMysql._instance;
    }

    /**
     * @async
     * @returns {Promise<IConnection>}
     */
    public static getConn(): Promise<mysql.IConnection> {
        SingletonMysql.checkInit();
        return new Promise((resolve, reject) => {
            SingletonMysql._instance.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            })
        })
    }

    public static async queries<T>(work: (conn: mysql.IConnection) => Promise<T>): Promise<T> {
        let conn = await SingletonMysql.getConn().catch(e => {
            throw e;
        });
        let result = await work(conn).catch(e => {
            throw e;
        });
        conn.release();
        return result;
    }

    public static transaction<T>(work: (conn: mysql.IConnection) => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            SingletonMysql.getConn()
                .catch(e => {
                    reject(e);
                })
                .then(conn => {
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
                                    })
                                })
                                .then(result => {
                                    conn.commit(e => {
                                        if (e) conn.rollback(() => {
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
                    })
                });
        });
    }
}
