/**
 * Created by Le Reveur on 2017-10-15.
 */
"use strict";

let mysql = require('mysql');
let mysql2 = require('mysql2/promise');
export default class SingletonMysql {
    private constructor() {
    };

    private static pool = null;

    private static checkInit(): void {
        if (SingletonMysql.pool === null)
            throw new Error("Error: initiate pool first. Use SingletonMysql.init(config)");
    }

    public static init(config): void {
        if (SingletonMysql.pool)
            throw new Error("Error: already initiated. use SingletonMysql.getPool().");
        else
            SingletonMysql.pool = mysql2.createPool(config);
    }

    public static getPool() {
        SingletonMysql.checkInit();
        return SingletonMysql.pool;
    }

    public static escape(str) {
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
    static query<T>(query: string, params?): Promise<T> {
        return SingletonMysql.getPool().query(query, params);
    }
    static async queries<T>(work: (conn) => Promise<T>): Promise<T> {
        let conn, result;
        try {
            conn = await SingletonMysql.getConn();
            result = await work(conn);
        } catch (e) {
            throw e;
        } finally {
            conn.release();
        }
        return result;
    }

    static async transaction<T>(work: (conn) => Promise<T>): Promise<T> {
        let conn: any = await SingletonMysql.getConn();
        let result;
        try {
            await conn.beginTransaction();
            result = await work(conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            conn.release();
            throw e;
        }
        conn.release();
        return result;
    }
}
