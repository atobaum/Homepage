"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SingletonMysql_1 = require("../common/SingletonMysql");
const Parser_1 = require("./Parser");
/**
 * Created by Le Reveur on 2017-10-15.
 */
class WikiError extends Error {
    constructor(title, AC) {
        super();
        this.title = title;
        this.AC = AC;
    }
}
exports.WikiError = WikiError;
var EAccessControl;
(function (EAccessControl) {
    EAccessControl[EAccessControl["LIST"] = 16] = "LIST";
    EAccessControl[EAccessControl["CREATE"] = 8] = "CREATE";
    EAccessControl[EAccessControl["READ"] = 4] = "READ";
    EAccessControl[EAccessControl["UPDATE"] = 2] = "UPDATE";
    EAccessControl[EAccessControl["DELETE"] = 1] = "DELETE";
})(EAccessControl = exports.EAccessControl || (exports.EAccessControl = {}));
class IPage {
    constructor(fulltitle, tags) {
        if (!fulltitle)
            throw new Error("Error: title should be not empty.");
        this.titles = IPage.parseTitle(fulltitle);
        this.fulltitle = (this.titles[0] === 'Main' || this.titles[0] == null ? this.titles[1] : this.titles.join(':'));
        this.tags = tags;
    }
    getFulltitle() {
        return this.fulltitle;
    }
    ;
    setSrc(src) {
        this.srcStr = src;
        return true;
    }
    ;
    setTags(tags) {
        this.tags = tags;
        return true;
    }
    getRen(user) {
        if (!this.srcStr)
            throw new Error("Source is not set");
        else {
            return Parser_1.default.render(this.titles, this.srcStr).then(ren => {
                this.renStr = ren;
                return ren;
            });
        }
    }
    ;
    static parseTitle(fulltitle) {
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
exports.IPage = IPage;
class TempPage extends IPage {
    save(user) {
        return Promise.reject(new Error("Temporary page cannot be saved."));
    }
    constructor(fulltitle, tags) {
        super(fulltitle, tags);
    }
    getSrc(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.srcStr)
                return this.srcStr;
            else
                throw new Error("Source is not set.");
        });
    }
}
exports.TempPage = TempPage;
class Page extends IPage {
    constructor(fulltitle, tags = []) {
        super(fulltitle, tags);
        this.PAC = [null, null];
        this.major = false;
        this.tags = tags;
    }
    saveRevision(conn, user) {
        let revision = {
            page_id: this.pageId,
            rev_id: this.revId + 1,
            user_id: user.getId(),
            user_text: user.getUsername(),
            text: this.srcStr,
            major: this.major,
            tags: this.tags.join(',')
        };
        if (conn)
            return conn.query("INSERT INTO revision SET ?", [revision]);
        else
            return SingletonMysql_1.default.query("INSERT INTO revision SET ?", [revision]);
    }
    saveTags(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pageId)
                throw new Error('Page id is ' + this.pageId + ' in "saveTags".');
            try {
                let [rows] = yield conn.query('SELECT * FROM wiki_tags WHERE wiki_id=?', [this.pageId]);
                let oldTagsLowCase = rows.map((row) => {
                    row.name = row.name.toLowerCase();
                    return row;
                });
                let oldTagsNameLowCase = oldTagsLowCase.map(i => i.name);
                let newTagsLowCase = this.tags.map(t => t.toLowerCase());
                let existingTagsLowCase = [];
                if (this.tags.length) {
                    [rows] = yield conn.query('SELECT * FROM tag WHERE name IN (?)', [newTagsLowCase]);
                    existingTagsLowCase = rows.map(tag => tag.name.toLowerCase());
                }
                let toDelete = oldTagsLowCase.filter((OTag) => newTagsLowCase.indexOf(OTag.name) < 0);
                let toSave = this.tags.filter(tag => oldTagsNameLowCase.indexOf(tag.toLowerCase()) < 0);
                let toCreate = toSave.filter(tag => existingTagsLowCase.indexOf(tag.toLowerCase()) < 0);
                if (toDelete.length)
                    yield conn.query("DELETE FROM tag_to_wiki WHERE wiki_id=? AND tag_id IN (?)", [this.pageId, toDelete.map(tag => tag.tag_id)]);
                if (toCreate.length)
                    yield conn.query("INSERT INTO tag (name) VALUES ? ", [toCreate.map(str => [str])]);
                if (toSave.length) {
                    [rows] = yield conn.query('SELECT * FROM tag WHERE name IN (?)', [toSave]);
                    yield conn.query("INSERT INTO tag_to_wiki (tag_id, wiki_id) VALUES ? ", [rows.map(row => [row.id, this.pageId])]);
                }
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
    static load(fulltitle) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fulltitle)
                throw new Error("Title should be not empty. In load of class Page");
            let titles = IPage.parseTitle(fulltitle);
            let res = yield SingletonMysql_1.default.query("SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?", titles);
            let rows = res[0];
            if (rows.length === 0) {
                res = yield SingletonMysql_1.default.query("SELECT * FROM namespace WHERE ns_title = ?", [titles[0]]);
                rows = res[0];
                if (rows.length === 0)
                    throw new Error("Non exist namespace: " + titles[0]);
                else
                    return new NewPage(fulltitle, rows[0]);
            }
            else {
                let data = rows[0];
                res = yield SingletonMysql_1.default.query('SELECT * FROM wiki_tags WHERE wiki_id=?', [data.page_id]);
                rows = res[0];
                data.tags = rows.map(row => row.name);
                return new OldPage(fulltitle, data);
            }
        });
    }
    loadSrc() {
        return SingletonMysql_1.default.queries((conn) => __awaiter(this, void 0, void 0, function* () {
            let row;
            row = (yield conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [this.pageId, this.revId]))[0][0];
            if (!row)
                throw new Error('Invalid page id and rev_id: ' + this.pageId + ' , ' + this.revId + ' , ' + "title: " + this.titles);
            this.srcStr = row.text;
            this.major = row.major;
            // this.userId = row.user_id;
            // this.userText = row.userText;
            // this.comment = row.comment;
            // this.created = row.created;
            return this;
        }));
    }
    getPAC() {
        return this.PAC;
    }
    /**
     *
     * admin이면 pass. 로그인 되있어도 pass...
     * @param user
     * @param type
     * @returns {Promise<boolean>}
     */
    checkAC(user, type) {
        if (user && user.getAdmin())
            return Promise.resolve(true);
        else if ((this.PAC[1] && this.PAC[1] & type) || (!this.PAC[1] && this.PAC[0] & type)) {
            if (user)
                return Promise.resolve(true);
            else {
                return Promise.resolve((type & EAccessControl.READ) != 0);
            }
        }
        else
            return Promise.resolve(false);
    }
    ;
}
exports.Page = Page;
class NewPage extends Page {
    getSrc(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.srcStr)
                return this.srcStr;
            else
                throw new Error("Source is not set.");
        });
    }
    constructor(fulltitle, data) {
        super(fulltitle);
        this.PAC[0] = data.ns_PAC;
        this.nsId = data.ns_id;
        this.titles[0] = data.ns_title;
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.srcStr)
                throw new Error("Source is not set.");
            else {
                return SingletonMysql_1.default.transaction((conn) => __awaiter(this, void 0, void 0, function* () {
                    if (yield this.checkAC(user, EAccessControl.CREATE)) {
                        let [rows] = yield conn.query('SELECT * FROM namespace WHERE ns_title = ?', [this.titles[0]]);
                        if (rows.length === 0)
                            throw new Error("Namespace '" + this.titles[0] + "' doesn't exist.");
                        if (!(rows[0].ns_PAC & EAccessControl.CREATE))
                            throw new Error("Access denied.");
                        this.nsId = rows[0].ns_id;
                        let page = {
                            ns_id: this.nsId,
                            page_title: this.titles[1]
                        };
                        [rows] = yield conn.query('INSERT INTO page SET ?', [page]);
                        this.pageId = rows.insertId;
                        this.revId = 0;
                        yield this.saveTags(conn);
                        return yield this.saveRevision(conn, user);
                    }
                    else
                        throw new WikiError(this.fulltitle, EAccessControl.CREATE);
                }));
            }
        });
    }
}
exports.NewPage = NewPage;
class OldPage extends Page {
    constructor(fulltitles, data) {
        super(fulltitles, data.tags);
        this.PAC = [data.ns_PAC, data.page_PAC];
        this.nsId = data.ns_id;
        this.pageId = data.page_id;
        this.revId = data.rev_id;
        this.cached = data.cached;
        this.titles = [data.ns_title, data.page_title];
        this.edited = false;
        this.readOnly = true;
    }
    setSrc(str) {
        this.srcStr = str;
        this.edited = true;
        return true;
    }
    getSrc(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkAC(user, EAccessControl.READ)))
                throw new WikiError(this.fulltitle, EAccessControl.READ);
            this.readOnly = !(yield this.checkAC(user, EAccessControl.UPDATE));
            if (this.srcStr)
                return this.srcStr;
            else {
                let rows = yield SingletonMysql_1.default.query('SELECT * FROM revision WHERE page_id = ? AND rev_id = ?', [this.pageId, this.revId]);
                this.srcStr = rows[0][0].text;
                return this.srcStr;
            }
        });
    }
    save(user) {
        if (!this.srcStr)
            throw new Error("Source is not set");
        else
            return SingletonMysql_1.default.transaction((conn) => __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.checkAC(user, EAccessControl.UPDATE)))
                    throw new WikiError(this.fulltitle, EAccessControl.UPDATE);
                else {
                    yield this.saveTags(conn);
                    yield this.saveRevision(conn, user);
                    return this;
                }
            }));
    }
    setPAC(pac) {
        if (pac !== this.PAC[1]) {
            return SingletonMysql_1.default.query("UPDATE page SET page_PAC = ? WHERE page_id = ?", [pac, this.pageId]);
        }
        else
            return Promise.resolve(true);
    }
}
exports.OldPage = OldPage;
class Revision {
    constructor() {
    }
    ;
    static load(conn, pageId, revId) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows] = yield conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [pageId, revId]);
            if (rows.length === 0)
                throw new Error("Non-exists revision: page " + pageId + ", rev: " + revId);
            let row = rows[0];
            let rev = new Revision();
            rev.pageId = pageId;
            rev.revId = revId;
            rev.text = row.text;
            rev.userId = row.user_id;
            rev.userText = row.user_text;
            rev.major = row.major;
            rev.created = row.created;
            rev.deleted = row.deleted;
        });
    }
}
