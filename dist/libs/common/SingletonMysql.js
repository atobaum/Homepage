/**
 * Created by Le Reveur on 2017-10-15.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    static async queries(work) {
        let conn, result;
        try {
            conn = await SingletonMysql.getConn();
            result = await work(conn);
        }
        catch (e) {
            throw e;
        }
        finally {
            conn.release();
        }
        return result;
    }
    static async transaction(work) {
        let conn = await SingletonMysql.getConn();
        let result;
        try {
            await conn.beginTransaction();
            result = await work(conn);
            await conn.commit();
        }
        catch (e) {
            await conn.rollback();
            conn.release();
            throw e;
        }
        conn.release();
        return result;
    }
}
SingletonMysql.pool = null;
exports.default = SingletonMysql;
