"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SingletonMysql_1 = require("../common/SingletonMysql");
class EnvManager {
    constructor() {
        this.envList = new Map();
        this.priority = [];
    }
    addEnv(env) {
        this.envList.set(env.key, env);
        this.priority.push(env.key);
    }

    editEnv(key, newEnv) {
        this.envList.set(key, newEnv);
    }
    afterScan(toks) {
        return SingletonMysql_1.default.queries(conn => {
            let promise = [];
            for (let i = 0; i < this.priority.length; i++) {
                promise.push(this.envList.get(this.priority[i]).afterScan(toks, conn));
            }
            return Promise.all(promise);
        }).then(() => null);
    }
    save() {
        return SingletonMysql_1.default.queries(conn => {
            return Promise.all(this.priority.map(key => this.envList.get(key).save(conn)));
        }).then(() => null);
    }
    makeToken(key, argv) {
        return this.envList.get(key).makeToken(argv);
    }
}
exports.EnvManager = EnvManager;
