import SingletonMysql from "./SingletonMysql";
import {Page} from "../wiki/Page";
/**
 * Created by Le Reveur on 2017-12-25.
 */
export interface ITag {
    name: string;
    count: number;
}

class Tag implements ITag {
    private id: number;

    private constructor(id, name, count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }

    static loadFromDb(data) {
        return new Tag(data.id, data.name, data.tagging_count);
    }
}

export class TagManager {
    private static async load(conn, name: string): Promise<ITag> {
        let [rows] = await SingletonMysql.query('SELECT * FROM tag WHERE name=?', [name]);
        if (rows.length === 0)
            return null;
        else {
            return Tag.loadFromDb(rows[0]);
        }
    }

    static search(name: string): Promise<ITag[]> {
        return SingletonMysql.queries(async conn => {
            let [rows] = await conn.query('SELECT * FROM tag WHERE name="%' + conn.escape(name) + '"')
            return rows.map(row => Tag.loadFromDb(row));
        });
    }

    private static async create(conn, name: string): Promise<ITag> {
        let [rows] = await SingletonMysql.query("INSERT INTO tag SET ?", {name: name});
        return Tag.loadFromDb({name: name, id: rows.insertId, count: 0});
    }

    static updateWiki(wiki: Page): Promise<boolean> {
        let wikiId = wiki.pageId;
        SingletonMysql.queries(conn => {
            conn.query("SELECT * FROM tag_to_wiki WHERE ")
        })

        TagManager.load(name)
    }
}
