"use strict";
exports.__esModule = true;
var SingletonMysql_1 = require("./SingletonMysql");
/**
 * Created by Le Reveur on 2017-10-18.
 */
var User = /** @class */ (function () {
    function User(id, username, admin) {
        if (admin === void 0) { admin = false; }
        this.id = id;
        this.username = username;
        this.admin = admin;
    }
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.getUsername = function () {
        return this.username;
    };
    // createUser(user, callback) {
    // this.conn.query("INSERT INTO user (username, nickname, password, email) VALUES (?, ?, PASSWORD(?), ?)", [user.username, user.nickname, user.password, user.email], callback);
    // }
    User.prototype.updateUser = function () {
    };
    User.checkUsername = function (username) {
        return SingletonMysql_1["default"].queries(function (conn) {
            return conn.query("SELECT user_id FROM user WHERE user_id=?", [username])
                .then(function (res) { return res[0].length !== 0; });
        });
    };
    User.checkNickname = function (username) {
        return SingletonMysql_1["default"].queries(function (conn) {
            return conn.query("SELECT user_id FROM user WHERE nickname=?", [username])
                .then(function (res) { return res[0].length !== 0; });
        });
    };
    User.login = function (username, password) {
        return SingletonMysql_1["default"].query("SELECT user_id, nickname, admin, password = PASSWORD(?) as correct FROM user WHERE username = ?", [password, username])
            .then(function (res) {
            var user = res[0][0];
            if (!res[0].length) {
                var e = new Error('Wrong username');
                e.code = 2;
                throw e;
            }
            else if (user.correct != 1) {
                var e = new Error('Wrong password');
                e.code = 0;
                throw e;
            }
            else
                return new User(user.user_id, user.nickname, user.admin == 1);
        });
    };
    return User;
}());
exports["default"] = User;
