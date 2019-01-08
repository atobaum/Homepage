"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    static async load(conn, name) {
        let [rows] = await SingletonMysql_1.default.query('SELECT * FROM tag WHERE name=?', [name]);
        if (rows.length === 0)
            return null;
        else {
            return Tag.loadFromDb(rows[0]);
        }
    }
    static search(name) {
        return SingletonMysql_1.default.queries(async (conn) => {
            let [rows] = await conn.query('SELECT * FROM tag WHERE name="%' + conn.escape(name) + '"');
            return rows.map(row => Tag.loadFromDb(row));
        });
    }

    static async create(conn, name) {
        let [rows] = await SingletonMysql_1.default.query("INSERT INTO tag SET ?", {name: name});
        return Tag.loadFromDb({name: name, id: rows.insertId, count: 0});
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
