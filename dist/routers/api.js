"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * Created by Le Reveur on 2017-10-21.
 */
const express_1 = require("express");
const User_1 = require("../libs/common/User");
const SingletonMysql_1 = require("../libs/common/SingletonMysql");
class ApiRouter {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get('/auth/login', (req, res) => {
            User_1.default.login(req.query.id, req.query.password)
                .then(user => {
                    req.session.user = user;
                    if (req.query.autoLogin == "true")
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; //7 days
                    res.json({ok: 1});
                })
                .catch(e => {
                    res.json({ok: e.code, error: e});
                });
        });
        this.router.get('/search/tag', (req, res) => {
            SingletonMysql_1.default.query('SELECT name, tagging_count as count FROM tag WHERE name LIKE ' + SingletonMysql_1.default.escape(req.query.q + '%'))
                .then(([rows]) => {
                    res.json({ok: 1, result: rows});
                })
                .catch(e => res.json({ok: 0, error: e.stack}));
        });
    }
    use(path, router) {
        this.router.use(path, router);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = ApiRouter;
