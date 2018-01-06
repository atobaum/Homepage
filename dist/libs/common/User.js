"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const SingletonMysql_1 = require("./SingletonMysql");
/**
 * Created by Le Reveur on 2017-10-18.
 */
class User {
    constructor(id, username, admin = false) {
        this.id = id;
        this.username = username;
        this.admin = admin;
    }
    getId() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    // createUser(user, callback) {
    // this.conn.query("INSERT INTO user (username, nickname, password, email) VALUES (?, ?, PASSWORD(?), ?)", [user.username, user.nickname, user.password, user.email], callback);
    // }
    updateUser() {
    }
    static checkUsername(username) {
        return SingletonMysql_1.default.queries(conn => {
            return conn.query("SELECT user_id FROM user WHERE user_id=?", [username])
                .then(res => res[0].length !== 0);
        });
    }
    static checkNickname(username) {
        return SingletonMysql_1.default.queries(conn => {
            return conn.query("SELECT user_id FROM user WHERE nickname=?", [username])
                .then(res => res[0].length !== 0);
        });
    }
    static login(username, password) {
        return SingletonMysql_1.default.query("SELECT user_id, nickname, admin, password = PASSWORD(?) as correct FROM user WHERE username = ?", [password, username])
            .then(res => {
                let user = res[0][0];
                if (!res[0].length) {
                    let e = new Error('Wrong username');
                    e.code = 2;
                    throw e;
                }
                else if (user.correct != 1) {
                    let e = new Error('Wrong password');
                    e.code = 0;
                    throw e;
                }
                else
                    return new User(user.user_id, user.nickname, user.admin == 1);
            });
    }
}
exports.default = User;
