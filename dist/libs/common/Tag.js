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
const SingletonMysql_1 = require("./SingletonMysql");
class Tag {
    constructor(id, name, count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }

    static loadFromDb(data) {
        return new Tag(data.id, data.name, data.tagging_count);
    }
}
class TagManager {
    static load(conn, name) {
        return __awaiter(this, void 0, void 0, function*() {
            let [rows] = yield SingletonMysql_1.default.query('SELECT * FROM tag WHERE name=?', [name]);
            if (rows.length === 0)
                return null;
            else {
                return Tag.loadFromDb(rows[0]);
            }
        });
    }

    static search(name) {
        return SingletonMysql_1.default.queries((conn) => __awaiter(this, void 0, void 0, function*() {
            let [rows] = yield conn.query('SELECT * FROM tag WHERE name="%' + conn.escape(name) + '"');
            return rows.map(row => Tag.loadFromDb(row));
        }));
    }

    static create(conn, name) {
        return __awaiter(this, void 0, void 0, function*() {
            let [rows] = yield SingletonMysql_1.default.query("INSERT INTO tag SET ?", {name: name});
            return Tag.loadFromDb({name: name, id: rows.insertId, count: 0});
        });
    }

    static updateWiki(wiki) {
        let wikiId = wiki.pageId;
        SingletonMysql_1.default.queries(conn => {
            conn.query("SELECT * FROM tag_to_wiki WHERE ");
        });
        TagManager.load(name);
    }
}
exports.TagManager = TagManager;
