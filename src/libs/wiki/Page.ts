import SingletonMysql from "../common/SingletonMysql";
import Parser from "./Parser";
import User from "../common/User";
/**
 * Created by Le Reveur on 2017-10-15.
 */
export enum EAccessControl {
    CREATE = 8, READ = 4, UPDATE = 2, DELETE = 1
}

export abstract class IPage {
    protected renStr: string;

    protected constructor(fulltitle: string, tags?: [string]) {
        if (!fulltitle) throw new Error("Error: title should be not empty.");
        this.titles = IPage.parseTitle(fulltitle);
        this.fulltitle = (this.titles[0] === 'Main' || this.titles[0] == null ? this.titles[1] : this.titles.join(':'));
        this.tags = tags;
    }

    protected fulltitle: string;
    protected titles: [string, string];
    protected tags: [string];
    protected srcStr: string;

    getFulltitle(): string {
        return this.fulltitle
    };

    setSrc(src): boolean {
        this.srcStr = src;
        return true;
    };

    getRen(user: User): Promise<string> {
        if (!this.srcStr)
            throw new Error("Source is not set");
        else {
            return Parser.render(this.titles, this.srcStr).then(ren => {
                this.renStr = ren;
                return ren;
            });
        }
    };

    abstract getSrc(user: User): Promise<string>;

    abstract save(user: User): Promise<IPage>;

    public static parseTitle(fulltitle: string): [string, string] {
        let regexTitle = /^(?:(.*?):)?(.+?)$/;
        let parsedTitle = regexTitle.exec(fulltitle);
        let ns;
        switch (parsedTitle[1]) {
            case undefined:
            case '':
                ns = 'Main';
                break;
            case '개인':
                ns = 'Private';
                break;
            case '분류':
                ns = 'Category';
                break;
            case '위키':
                ns = 'Wiki';
                break;
            default:
                ns = parsedTitle[1];
        }
        return [ns, parsedTitle[2]];
    }
}

export class TempPage extends IPage {
    save(user: User): Promise<IPage> {
        return Promise.reject(new Error("Temporary page cannot saved."));
    }

    constructor(fulltitle, tags?) {
        super(fulltitle, tags);
    }

    async getSrc(user: User): Promise<string> {
        if (this.srcStr)
            return this.srcStr;
        else
            throw new Error("Source is not set.");
    }
}

export abstract class Page extends IPage {
    protected PAC: [number, number];
    protected nsId: number;
    public pageId: number;
    protected revId: number;
    protected cached: boolean;
    protected minor: boolean;
    protected comment: string;

    constructor(fulltitle: string, tags?) {
        super(fulltitle, tags);
        this.PAC = [null, null];
        this.minor = false;
        this.tags = [] as [string];
    }

    protected saveRevision(conn, user) {
        let revision = {
            page_id: this.pageId,
            rev_id: this.revId + 1,
            user_id: user.getId(),
            user_text: user.getUsername(),
            text: this.srcStr,
            minor: this.minor,
            comment: this.comment
        };
        if (conn)
            return conn.query("INSERT INTO revision SET ?", [revision]).catch(e => {
                console.log(e)
            });
        else
            return SingletonMysql.query("INSERT INTO revision SET ?", [revision]);
    }

    protected async saveTags(conn): Promise<boolean> {
        if (!this.pageId)
            throw new Error('Page id is ' + this.pageId + ' in "saveTags".');
        let [rows] = await conn.query('SELECT * FROM wiki_tags WHERE wiki_id=?', [this.pageId]);
        let oldTags = rows.map((row) => {
            row.name = row.name.toLowerCase();
            return row;
        });
        let newTags = this.tags.map(a => a.toLowerCase());
        [rows] = await conn.query('SELECT * FROM tag WHERE name IN (?)', [newTags]);
        let existingTags: string[] = rows.map(tag => tag.name);
        let toDelete = oldTags.filter((tag) => newTags.indexOf(tag.name) >= 0);
        let toSave: string[] = this.tags.filter(tag => oldTags.indexOf(tag.toLowerCase()) >= 0);
        let toCreate: string[] = toSave.filter(tag => existingTags.indexOf(tag.toLowerCase()) < 0);

        await conn.query("DELETE FROM tag_to_wiki WHERE wiki_id=? AND tag_id IN ?", [this.pageId, toDelete]);
        await conn.query("INSERT INTO tag (name) VALUES ? ", [toCreate.map(str => [str])]);
        await conn.query("INSERT INTO tag_ti_wiki (tag_id, wiki_id) VALUES ? ", [toSave.map(str => [str, this.pageId])]);
        return true;
    }

    static async load(fulltitle): Promise<Page> {
        if (!fulltitle) throw new Error("Error: title should be not empty.");
        let titles = IPage.parseTitle(fulltitle);
        let res = await SingletonMysql.query("SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?", titles);
        let rows = res[0];
        if (rows.length === 0) {
            res = await SingletonMysql.query("SELECT * FROM namespace WHERE ns_title = ?", [titles[0]]);
            rows = res[0];
            if (rows.length === 0)
                throw new Error("Non exist namespace: " + titles[0]);
            else
                return new NewPage(fulltitle, rows[0]);
        }
        else
            return new OldPage(fulltitle, rows[0]);
    }

    loadSrc(): Promise<any> {
        let tmp = this;
        return SingletonMysql.queries(async conn => {
            let rows, row;
            row = (await conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [this.pageId, this.revId]))[0][0];
            if (!row)
                throw new Error('Invalid page id and rev_id: ' + this.pageId + ' , ' + this.revId + ' , ' + "title: " + this.titles);
            this.srcStr = row.text;
            this.minor = row.minor;
            // this.userId = row.user_id;
            // this.userText = row.userText;
            // this.comment = row.comment;
            // this.created = row.created;
            return this;
        })
    }

    checkAC(user: User, type: EAccessControl): Promise<boolean> {
        if ((this.PAC[1] && this.PAC[1] & type) || (!this.PAC[1] && this.PAC[0] & type)) {
            if (user)
                return Promise.resolve(true);
            else {
                return Promise.resolve((type & EAccessControl.READ) != 0)
            }
        } else
            return Promise.resolve(false);
    };
}

export class NewPage extends Page {
    async getSrc(user: User): Promise<string> {
        if (this.srcStr)
            return this.srcStr;
        else
            throw new Error("Source is not set.");
    }

    constructor(fulltitles, data) {
        super(fulltitles, data.tags);
        this.PAC[0] = data.ns_PAC;
        this.nsId = data.ns_id;
        this.titles[0] = data.ns_title;
    }

    async save(user: User): Promise<IPage> {
        if (!this.srcStr)
            throw new Error("Source is not set.");
        else {
            return SingletonMysql.transaction(async conn => {
                if (this.checkAC(user, EAccessControl.CREATE)) {
                    let [rows] = await conn.query('SELECT * FROM namespace WHERE ns_title = ?', [this.titles[0]]);
                    if (rows.length === 0)
                        throw new Error("Namespace '" + this.titles[0] + "' doesn't exist.");
                    if (!(rows[0].ns_PAC & EAccessControl.CREATE))
                        throw new Error("Access denied.");

                    this.nsId = rows[0].ns_id;
                    let page = {
                        ns_id: this.nsId,
                        page_title: this.titles[1]
                    };
                    [rows] = await conn.query('INSERT INTO page SET ?', [page]);
                    this.pageId = rows.insertId;
                    this.revId = 0;

                    return await this.saveRevision(conn, user);
                } else
                    throw new Error('You have not enough AC to create new page.');
            });
        }
    }
}

export class OldPage extends Page {
    private edited: boolean;

    constructor(fulltitles, data) {
        super(fulltitles, data.tags);
        this.PAC = [data.ns_PAC, data.page_PAC];
        this.nsId = data.ns_id;
        this.pageId = data.page_id;
        this.revId = data.rev_id;
        this.cached = data.cached;
        this.titles = [data.ns_title, data.page_title];
        this.edited = false;
    }

    setSrc(str) {
        this.srcStr = str;
        this.edited = true;
        return true;
    }

    async getSrc(user: User): Promise<string> {
        this.checkAC(user, EAccessControl.READ);
        if (this.srcStr)
            return this.srcStr;
        else {
            let rows = await SingletonMysql.query('SELECT * FROM revision WHERE page_id = ? AND rev_id = ?', [this.pageId, this.revId]);
            this.srcStr = rows[0][0].text;
            return this.srcStr;
        }
    }

    save(user): Promise<IPage> {
        if (!this.srcStr)
            throw new Error("Source is not set");
        else if (this.checkAC(user, EAccessControl.UPDATE))
            throw new Error('You have not enough AC to edit new page.');
        else
            return SingletonMysql.transaction(conn => {
                this.saveTags(conn);
                return this.saveRevision(conn, user).then(() => this);
            });
    }
}

class Revision {
    pageId: number;
    revId: number;
    text: string;
    userId: number;
    userText: string;
    comment: string;
    minor: boolean;
    created: string;
    deleted: boolean;

    private constructor() {
    };

    static async load(conn, pageId, revId) {
        let [rows] = await conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [pageId, revId]);
        if (rows.length === 0)
            throw new Error("Non-exists revision: page " + pageId + ", rev: " + revId);
        let row = rows[0];
        let rev = new Revision();
        rev.pageId = pageId;
        rev.revId = revId;
        rev.text = row.text;
        rev.userId = row.user_id;
        rev.userText = row.user_text;
        rev.comment = row.comment;
        rev.minor = row.minor;
        rev.created = row.created;
        rev.deleted = row.deleted;
    }
}