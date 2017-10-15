/**
 * Created by Le Reveur on 2017-10-15.
 */
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const promiseMysql = require('promise-mysql');
class SingletonMysql {
    constructor() {
    }
    ;

    static getPool() {
        if (SingletonMysql._instance === null)
            throw new Error("Error: initiate pool first. Use SingletonMysql.init(config)");
        else
            return SingletonMysql._instance;
    }

    static init(config) {
        if (SingletonMysql._instance)
            throw new Error("Error: already initiated. use SingletonMysql.getPool().");
        else
            SingletonMysql._instance = promiseMysql.createPool(config);
    }
}
SingletonMysql._instance = null;
exports.SingletonMysql = SingletonMysql;
