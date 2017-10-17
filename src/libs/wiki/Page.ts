/**
 * Created by Le Reveur on 2017-10-15.
 */
export class Page {
    private ns: string;
    private title: string;
    private id: number;
    private originalText: string;
    private parsedText: string;

    constructor(title?: string) {

    }

    async clearCache(): Promise<void> {
        return
    }

    async save(): Promise<void> {
        return
    }
}
//     /**
//      * @function
//      * @param{number} nsId
//      * @param{number} pageId
//      * @param{number} userId
//      * @param{number} type - create(8), read(4), update(2), delete(1)
//      * @param nsPAC
//      * @param pagePAC
//      * @property result - true if you can access.
//      */
//     checkAC(nsId, pageId, userId, type, nsPAC, pagePAC) {
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
//     };
//     /**
//      *
//      * @param title
//      * @returns page{Promise} - A promise object that gives the page. If namespace doesn't exist, page.noPage = 1. If namespace exists but page is not, page.noPage = 2. Otherwise, page.noPage = undefined.
//      */
//     getPageInfo(title) {
//         let parsedTitle = Wiki.parseTitle(title);
//         return this.makeWork(async (conn)=>{
//             let query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
//             let rows = await conn.query(query, [parsedTitle[0], parsedTitle[1]]).catch(e => {throw e});
//             let result;
//             if(rows.length === 0){
//                 query = "SELECT * FROM namespace WHERE ns_title = ?";
//                 rows = await conn.query(query, [parsedTitle[0]]).catch(e => {
//                     throw e
//                 });
//                 if (rows.length === 0) result = {ns_title: parsedTitle[0], page_title: parsedTitle[1], noPage: 1};
//                 else {
//                     result = rows[0];
//                     result.page_title = parsedTitle[1];
//                     result.noPage = 2;
//                 }
//             } else {
//                 result = rows[0];
//             }
//             result.title = (result.ns_title === "Main" ? '' : result.ns_title + ':') + result.page_title;
//             return result;
//         })();
//     }
//
//     /**
//      *
//      * @param conn
//      * @param title
//      * @returns page{Promise} - A promise object that gives the page. If namespace doesn't exist, page.noPage = 1. If namespace exists but page is not, page.noPage = 2. Otherwise, page.noPage = undefined.
//      */
//     async getPageInfoConn(conn, title) {
//         let parsedTitle = Wiki.parseTitle(title);
//         let query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
//         let rows = await conn.query(query, [parsedTitle[0], parsedTitle[1]]).catch(e => {
//             throw e
//         });
//         let result;
//         if (rows.length === 0) {
//             query = "SELECT * FROM namespace WHERE ns_title = ?";
//             rows = await conn.query(query, [parsedTitle[0]]).catch(e => {
//                 throw e
//             });
//             if (rows.length === 0) result = {ns_title: parsedTitle[0], page_title: parsedTitle[1], noPage: 1};
//             else {
//                 result = rows[0];
//                 result.page_title = parsedTitle[1];
//                 result.noPage = 2;
//             }
//         } else {
//             result = rows[0];
//         }
//         result.title = (result.ns_title === "Main" ? '' : result.ns_title + ':') + result.page_title;
//         return result;
//     }
//
//     updatePageCache(pageInfo) {
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
//     }
//
//     /**
//      *
//      * @param title
//      * @param userId
//      * @property page.title
//      * @property page.touched
//      * @property page.text
//      */
//     async getRawPage(title, userId) {
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
//         let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
//         let [row] = await this.makeWork(async conn => {
//             return await conn.query(query, [pageInfo.page_id, pageInfo.rev_id]).catch(e => {
//                 throw e
//             });
//         })().catch(e => {
//             throw e;
//         });
//         pageInfo.text = row.text;
//         pageInfo.readOnly = !(await this.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 2, pageInfo.ns_PAC, pageInfo.page_PAC).catch(e => {throw e;}));
//
//         delete pageInfo.ns_id;
//         delete pageInfo.page_id;
//         delete pageInfo.ns_PAC;
//         delete pageInfo.page_PAC;
//         delete pageInfo.cached;
//         delete pageInfo.rev_counter;
//         return pageInfo;
//     }
//
//     async getParsedPage(title, userId, updateCache) {
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
//     }
//
//     /**
//      * @function editPage - Edit page or Create page if not exists.
//      * @param{Object} page
//      * @param{String} page.title - Page title, include namespace.
//      * @param{String} page.userText - User text. Username or ip.
//      * @param{String} page.text - wiki text.
//      * @param{number} userId
//      */
//     editPage(page, userId) {
//         let thisClass = this;
//         return this.makeTransaction(async conn => {
//             let data = await this.getPageInfo(page.title);
//             if (data.noPage === 1) {//no namespace
//                 return data;
//             } else if (data.noPage === 2) { //check access control and make page if page doesn't exists but not namespace.
//                 if (await thisClass.checkAC(data.ns_id, null, userId, 8, data.ns_PAC, null)) {
//                     let query = "INSERT INTO page (ns_id, page_title, user_ID, user_text) VALUES (?, ?, ?, ?)";
//                     await conn.query(query, [data.ns_id, data.page_title, userId, page.userText]).catch(err => {
//                         throw err;
//                     });
//                 } else {
//                     let error = new Error('You have no privilege for this page.');
//                     error.name = "NO_PRIVILEGE";
//                     throw error;
//                 }
//             }
//
//             //get page_id
//             let query = 'SELECT page_id, rev_id, rev_counter, page_PAC FROM page WHERE ns_id=? and page_title=?';
//             let rows = await conn.query(query, [data.ns_id, data.page_title]).catch(e => {
//                 throw e;
//             });
//             data.page_id = rows[0].page_id;
//             data.rev_id = rows[0].rev_counter + 1;
//             data.parent_id = rows[0].rev_id;
//             let page_PAC = rows[0].page_PAC;
//
//             //check access control
//             if (!(await thisClass.checkAC(data.ns_id, data.page_id, userId, 2, data.ns_PAC, page_PAC))) {
//                 let error = new Error('You have no privilege for this page.');
//                 error.name = "NO_PRIVILEGE";
//                 throw error;
//             }
//
//             //add revision
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
//     }
//
//     deletePage(title, userId, callback) {
//
//     }
//
//     /**
//      *
//      * @param conn
//      * @param page_id
//      * @param categories
//      * @param type{number} - 0: subcategory, 1: page, 2:file
//      * @returns {*}
//      */
//     updateCategory(conn, page_id, categories, type = 1) {
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
//
//     clearCache(pageTitle) {
//         return this.makeWork2(async conn=>{
//             let pageInfo = await this.getPageInfoConn(conn, pageTitle).catch(e => {
//                 throw e;
//             });
//
//             await conn.query('DELETE FROM caching WHERE page_id = ?', [pageInfo.page_id]).catch(e => {
//                 throw e
//             });
//             return 1;
//         });
//     }
//
//     changeTitle(oldTitle, newTitle) {
//         return this.makeWork2(async conn => {
//             let pageInfo = await this.getPageInfoConn(conn, oldTitle).catch(e => {
//                 throw e;
//             });
//             let result = await conn.query('UPDATE page SET page_title=? WHERE page_id = ?', [newTitle, pageInfo.page_id]).catch(e => {
//                 throw e
//             });
//             if (result.affectedRows === 1) return pageInfo.ns_title + ':' + newTitle;
//             else return null;
//         });
//     }
//
//     checkAdmin(userId){
//         if (!userId) return Promise.resolve(false);
//         return this.makeWork2(async conn=> {
//             let users = await conn.query('SELECT admin FROM user WHERE user_id = ?', [userId]).catch(e => {
//                 throw e
//             });
//             if (users.length === 0) throw new Error("Wrong User Id");
//             else if (users[0].admin === 1) return true;
//             else return false;
//         });
//     }
// }

