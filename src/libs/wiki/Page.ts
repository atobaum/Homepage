import SingletonMysql from "../SingletonMysql";
import Parser from "./Parser";
import User from "../User";
/**
 * Created by Le Reveur on 2017-10-15.
 */
/**
 * @todo checkAC
 * @todo deleted
 */
class PageError extends Error {
    code: EPageError;

    constructor(type: EPageError, stat: EPageStat, context: any) {
        let message = "ERROR: ";
        switch (type) {
            case EPageError.INVALID_OP:
                message += "Invalid Operation: " + context + " in " + PageStatToString(stat);
                break;
            case EPageError.NO_NS:
                message += "Invalid Namespace: " + context + " in " + PageStatToString(stat);
                break;
            case EPageError.NO_TITLE:
                message += "Invalid Title: " + context + " in " + PageStatToString(stat);
                break;
        }
        super(message);
        this.code = type;
    }
}
enum EPageError{
    NO_NS, NO_TITLE, INVALID_OP
}
export enum EPageStat{
    ONLY_ID,
    ONLY_TITLE, PAGE_INFO, NS_INFO, SET_SRC, GET_SRC, RENDERED, DELETED
}
enum EPageOp{
    PREVIEW,
    SAVE,
    GET_SRC,
    RENDER,
    LOAD_PAGE_INFO, SET_NS, SET_SRC, DELETE, LOAD_SRC, GET_RENDER
}
export enum EAccessControl {
    CREATE = 8, READ = 4, UPDATE = 2, DELETE = 1
}
function PageStatToString(stat: EPageStat): string {
    switch (stat) {
        case EPageStat.ONLY_TITLE:
            return "ONLY_TITLE";
        case EPageStat.PAGE_INFO :
            return "PAGE_INFO";
        case EPageStat.NS_INFO :
            return "NS_INFO";
        case EPageStat.SET_SRC :
            return "SET_SRC";
        case EPageStat.GET_SRC :
            return "GET_SRC";
        case EPageStat.RENDERED:
            return "RENDERED";
    }
}

export abstract class IPage {
    fulltitle: string;
    titles: [string, string];
    srcStr: string;
    renStr: string;
}

export class Page extends IPage {
    private PAC: [number, number];
    private nsId: number;
    private pageId: number;
    private isNew: boolean;
    private status: EPageStat;
    private revId: number;
    private rev_counter: number;
    private cached: boolean;
    private minor: boolean;
    private user: User;
    private comment: string;

    constructor(fulltitle: string, isNew: boolean) {
        super();
        if (!fulltitle) throw new Error("Error: title should be not empty.");
        this.titles = Page.parseTitle(fulltitle);
        this.fulltitle = (this.titles[0] === 'Main' || this.titles[0] == null ? this.titles[1] : this.titles.join(':'));
        this.isNew = isNew;
        this.status = EPageStat.ONLY_TITLE;
        this.PAC = [null, null];
    }

    static createPageWithId(id: number, user: User): Page {
        if (!id) throw new Error("Error: id should be not empty.");
        let page = new Page('temp', false);
        page.pageId = id;
        page.user = user;
        page.status = EPageStat.ONLY_ID;
        page.PAC = [null, null];
        return page;
    }

    static async getRenderedPage(fulltitle, userId) {
        let page = new Page(fulltitle, false);
        await page.loadPageInfo();
        await page.loadSrc();
        return await page.getRenderedPage();
    }

    static async getSrc(fulltitle, userId) {
        let page = new Page(fulltitle, false);
        await page.loadPageInfo();
        return await page.loadSrc();
    }

    static async edit(data, user) {
        if (!data.id)
            throw new Error('Error: required in function "edit" id');
        let page = Page.createPageWithId(parseInt(data.id), user);
        await page.loadPageInfo();
        page.srcStr = data.src;
        page.status = EPageStat.SET_SRC;
        page.minor = !data.major;
        page.comment = data.comment;
        await page.save();
        return;
    }

    private checkState(op: EPageOp) {
        // console.log(PageStatToString(this.status));
        switch (this.status) {
            case EPageStat.ONLY_ID:
                if ((op !== EPageOp.LOAD_PAGE_INFO))
                    throw new PageError(EPageError.INVALID_OP, EPageStat.ONLY_ID, op);
                return;
            case EPageStat.ONLY_TITLE:
                if ((op !== EPageOp.LOAD_PAGE_INFO) && (op !== EPageOp.SET_NS))
                    throw new PageError(EPageError.INVALID_OP, EPageStat.ONLY_TITLE, op);
                return;
            case EPageStat.NS_INFO:
                if ((op !== EPageOp.SET_SRC) && (op !== EPageOp.LOAD_SRC) && (op !== EPageOp.GET_RENDER))
                    throw new PageError(EPageError.INVALID_OP, EPageStat.NS_INFO, op);
                return;
            case EPageStat.GET_SRC:
                if ((op !== EPageOp.RENDER) && (op !== EPageOp.GET_SRC) && (op !== EPageOp.GET_RENDER))
                    throw new PageError(EPageError.INVALID_OP, EPageStat.GET_SRC, op);
                return;
            case EPageStat.PAGE_INFO:
                if ((op !== EPageOp.LOAD_SRC) && (op !== EPageOp.GET_RENDER))
                    throw new PageError(EPageError.INVALID_OP, EPageStat.PAGE_INFO, op);
                return;

            case EPageStat.DELETED:

            case EPageStat.SET_SRC:
                if ((op !== EPageOp.SAVE) && (op !== EPageOp.PREVIEW))
                    throw new PageError(EPageError.INVALID_OP, EPageStat.SET_SRC, op);
                return;

            case EPageStat.RENDERED:

            default:
                throw new Error('Unhandled status: ' + PageStatToString(this.status))

        }
    }

    private async updateNs(): Promise<void> {
        if (this.status !== EPageStat.ONLY_TITLE)
            throw new PageError(EPageError.INVALID_OP, this.status, "updateNs");
        return await SingletonMysql.queries(async conn => {
            let rows, row;
            rows = (await conn.query('SELECT * FROM namespace WHERE ns_title=?', [this.titles[0]]))[0];
            if (rows.length === 0)
                throw new PageError(EPageError.NO_NS, this.status, this.titles[0]);
            else {
                row = rows[0];
                this.titles[0] = row.ns_title;
                this.nsId = row.ns_id;
                this.PAC = [row.ns_PAC, 0];
                return;
            }
        })
    }

    /**
     *
     * @returns page{Promise} - A promise object that gives the page. If namespace doesn't exist, page.noPage = 1. If namespace exists but page is not, page.noPage = 2. Otherwise, page.noPage = undefined.
     */
    private loadPageInfo(): Promise<void> {
        this.checkState(EPageOp.LOAD_PAGE_INFO);
        let q, data;
        if (this.status == EPageStat.ONLY_TITLE) {
            q = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
            data = this.titles;
        }
        else {
            q = "SELECT * FROM fullpage WHERE page_id = ?";
            data = [this.pageId];
        }

        return SingletonMysql.queries(async conn => {
            let [rows] = await conn.query(q, data);
            if (rows.length === 0)
                throw new PageError(EPageError.NO_TITLE, this.status, this.titles.join(':'));
            let row = rows[0];
            this.titles = [row.ns_title, row.page_title];
            if (row.deleted) {
                this.status = EPageStat.DELETED;
                return;
            }
            this.nsId = row.ns_id;
            this.pageId = row.page_id;
            this.PAC = [row.ns_PAC, row.page_PAC];
            this.cached = row.cached === 1;
            this.revId = row.rev_id;
            this.rev_counter = row.rev_counter;
            this.status = EPageStat.PAGE_INFO;
        });
    }

    public async setSrc(src: string): Promise<void> {
        if (this.status !== EPageStat.ONLY_TITLE)
            throw new PageError(EPageError.INVALID_OP, this.status, "setSrc");
        if (this.isNew)
            await this.updateNs();
        else
            await this.loadPageInfo();
        this.srcStr = src;
        this.status = EPageStat.SET_SRC;
        return;
    }

    async render() {
        if (this.status !== EPageStat.SET_SRC)
            throw new PageError(EPageError.INVALID_OP, this.status, "render");
        return await Parser.render(this.titles, this.srcStr);
    }

    loadSrc(): Promise<any> {
        let tmp = this;
        this.checkState(EPageOp.LOAD_SRC);
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
            this.status = EPageStat.GET_SRC;
            return this;
        });
    }

    /**
     *
     * @param fulltitle
     * @returns {[string,string]} [ns, title]
     */
    static parseTitle(fulltitle: string): [string, string] {
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

    async save(): Promise<void> {
        this.checkState(EPageOp.SAVE);
        if (this.isNew) {
            throw new Error('not supported yet: create new page');
        } else {
            //add revision
            let revision = {
                page_id: this.pageId,
                rev_id: this.revId + 1,
                user_id: this.user.getId(),
                user_text: this.user.getUsername(),
                text: this.srcStr,
                parent_id: this.revId,
                minor: this.minor,
                comment: this.comment
            };
            await SingletonMysql.query("INSERT INTO revision SET ?", [revision]);
            return;
        }
    }

    /**
     * @function
     * @param{number} nsId
     * @param{number} pageId
     * @param{number} userId
     * @param{number} type - create(8), read(4), update(2), delete(1)
     * @param nsPAC
     * @param pagePAC
     * @property result - true if you can access.
     */
    checkAC(nsId, pageId, userId, type, nsPAC, pagePAC) {
//         if ((pagePAC && pagePAC & type) || (!pagePAC && nsPAC & type)) return Promise.resolve(true);
//         else if (!userId) return Promise.resolve(false);
//         else return this.makeWork2(async conn => {
//                 let query = "SELECT AC FROM ACL WHERE user_id = ? and (ns_id = ? OR page_id = ?)";
//                 let rows = await conn.query(query, [userId, nsId, pageId]).catch(e => {
//                     throw e
//                 });
//                 if (rows.length === 0) return false;
//                 else {
//                     for (let i = 0; i < rows.length; i++) {
//                         if (rows[i].AC & type) {
//                             return true;
//                         }
//                     }
//                     return false;
//                 }
//             });
    };

    updatePageCache(pageInfo) {
//         return this.makeWork2(async (conn) => {
//             if (pageInfo.ns_title === 'Category')
//                 await conn.query('INSERT INTO category (page_id, cat_title) VALUES (?, ?) ON DUPLICATE KEY UPDATE cat_title = ?', [pageInfo.page_id, pageInfo.page_title, pageInfo.page_title]).catch(e => {
//                     throw e;
//                 });
//
//             let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
//             let rows = await conn.query(query, [pageInfo.page_id, pageInfo.rev_id]).catch(e => {
//                 throw e;
//             });
//             if (rows.length === 0) throw new Error('Wrong Page Id: ' + pageInfo.page_id + ', Rev Id: ' + pageInfo.rev_id);
//             let row = rows[0];
//
//             let [content, additional] = await this.parser.out(row.text, pageInfo.ns_title, pageInfo.page_title).catch(e => e);
//
//             if (additional.category.length === 0)
//                 additional.category.push('미분류');
//             await this.updateCategory(conn, pageInfo.page_id, additional.category, pageInfo.ns_title === 'Category' ? 0 : 1);
//             if(pageInfo.cached === 0)
//                 query = "INSERT INTO caching (page_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content=?";
//             await conn.query(query, [pageInfo.page_id, content, content]).catch(e => {
//                 throw e
//             });
//             return content;
//         });
    }

    // async getPageRenderedPage(userId): Promise<string>  {
    //     this.checkState();
//         let pageInfo = await this.getPageInfo(title);
//         if (pageInfo.deleted) {
//             let error = new Error('Page is deleted.');
//             error.name = "DELETED_PAGE";
//             throw error;
//         }
//         if (pageInfo.noPage) {//no page
//             return pageInfo;
//         } else if (!(await this.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4, pageInfo.ns_PAC, pageInfo.page_PAC).catch(e => {throw e}))) { //can read
//             return {noPrivilege: true, title: title};
//         }
//
//         //read page
//         let parsedPage = null;
//         if (pageInfo.redirect) {
//             return {redirectFrom: pageInfo.title, redirectTo: pageInfo.redirect};
//         } else if (pageInfo.cached === 1 && !updateCache) {
//             parsedPage = await this.makeWork2(async (conn) => {
//                 let query = "SELECT content FROM caching WHERE page_id = ?";
//                 let [parsedPage] = await conn.query(query, [pageInfo.page_id]).catch(e => {
//                     throw e;
//                 });
//                 if (parsedPage === undefined) throw new Error('fatal error: cache data doen\'t exists for page_id=' + pageInfo.page_id);
//                 return parsedPage.content;
//             }).catch(e => {throw e;});
//         } else {
//             parsedPage = await this.updatePageCache(pageInfo)
//                 .catch(e => {throw e});
//         }
//
//         return {
//             title: pageInfo.title,
//             touched: pageInfo.touched,
//             parsedContent: parsedPage
//         }
// }

//
//             let revision = {
//                 page_id: data.page_id,
//                 rev_id: data.rev_id,
//                 user_id: userId,
//                 user_text: page.userText,
//                 text: page.text,
//                 parent_id: data.parent_id,
//                 minor: parseInt(page.major) ^ 1,
//                 comment: page.comment
//             };
//
//             if (!(revision.rev_id === 1 || revision.rev_id === 2)) {
//                 await conn.query('UPDATE revision SET ? WHERE page_id = ? AND rev_id = ?', [{
//                     user_id: userId,
//                     user_text: page.userText,
//                     text: page.text,
//                     comment: page.comment
//                 },
//                     data.page_id,
//                     data.rev_id - 1,
//                 ]).catch(e => {
//                     throw e;
//                 });
//
//                 if (revision.minor === 0)
//                     return await conn.query("INSERT INTO revision SET ?", [revision]);
//             } else
//                 return await conn.query("INSERT INTO revision SET ?", [revision]);
//         })();
// }

    /**
     *
     * @param conn
     * @param page_id
     * @param categories
     * @param type{number} - 0: subcategory, 1: page, 2:file
     * @returns {*}
     */
// updateCategory(conn, page_id, categories, type = 1) {
//         return this.makeTransaction(async conn => {
//             let query = "DELETE FROM categorylink WHERE \`to\` = ?";
//             await conn.query(query, [page_id]).catch(e => {
//                 throw e
//             });
//             if (categories.length === 0) return;
//
//             query = "SELECT page_id, cat_title FROM category WHERE " +
//                 categories.map(title => 'cat_title = ' + conn.escape(title)).join(' OR ');
//             let rows = await conn.query(query).catch(e => {
//                 throw e
//             });
//             if (rows.length === 0) return categories;
//             query = "INSERT INTO categorylink (\`from\`, \`to\`, \`type\`) VALUES ?";
//             await conn.query(query, [rows.map(row => [row.page_id, page_id, type])]).catch(e => {
//                 throw e
//             });
//
//             let lowercaseCat = categories.map(title => title.toLowerCase());
//             rows.forEach(row => {
//                 let i = lowercaseCat.indexOf(row.cat_title.toLowerCase());
//                 if (i >= 0) {
//                     categories.splice(i, 1);
//                     lowercaseCat.splice(i, 1);
//                 }
//             });
//             return categories;
//         })();
//     }

    async clearCache(): Promise<void> {
        if (this.status !== EPageStat.PAGE_INFO)
            throw new PageError(EPageError.INVALID_OP, this.status, "clearCache");
        return SingletonMysql.queries(async conn => {
            await conn.query('DELETE FROM caching WHERE page_id = ?', [this.pageId]);
            return;
        });
    }

    async changeTitle(oldTitle, newTitle) {
        throw new Error("Not implemented.");
    }

    async getRenderedPage(): Promise<IPage> {
        this.checkState(EPageOp.RENDER);
        this.renStr = await Parser.render(this.titles, this.srcStr);
        return this;
    }
}
