/**
 * Created by Le Reveur on 2017-05-01.
 */
"use strict";
let mysql = require('mysql');
let promise_mysql = require('promise-mysql');
let async = require('async');
let regexTitle = /^(?:(.*?):)?(.+?)$/;
class Wiki {
    constructor(config) {
        this.parser = require('./parser');
        this.parser = new this.parser();
        this.config = config;
        this.conn = mysql.createConnection({
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            dateStrings: 'date'
        }, function (err) {
            console.error('Error occured while making connection with MySql server: ');
            console.error(err);
        });

        this.connPool = promise_mysql.createPool({
            connectionLimit : 5,
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            dateStrings: 'date',
            connectTimeout: 5000
        });
    }

    makeTransaction(work) {
        return async (...args) => {
            let conn = await this.connPool.getConnection().catch(e => {throw e});
            await conn.beginTransaction();
            let result = await work(conn, ...args).catch(e => {
                conn.rollback(()=>conn.connection.release());
                throw e;
            });

            await conn.commit().catch(e => {
                conn.rollback(()=>conn.connection.release());
                throw e;
            });

            conn.connection.release();
            return result;
        }
    }

    makeWork(work) {
        return async (...args) => {
            let conn = await this.connPool.getConnection().catch(e => {throw e});
            let result = await work(conn, ...args).catch(e => {throw e});
            conn.connection.release();
            return result;
        }
    }

    static parseTitle(title){
        let regexTitle = /^(?:(.*?):)?(.+?)$/;
        let parsedTitle = regexTitle.exec(title);
        return [(parsedTitle[1] ? parsedTitle[1] : 'Main'), parsedTitle[2]];
    }

    parse(src, title) {
        let parsedTitle = Wiki.parseTitle(title);
        try {
            return this.parser.out(src, parsedTitle[0], parsedTitle[1]);
        } catch (e) {
            console.log(e);
            return e.message;
        }
    }

    // getPageInfo(title, callback) {
    //     let parsedTitle = this.parseTitle(title);
    //     let query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
    //     this.conn.query(query, [parsedTitle[0], parsedTitle[1]], function (err, rows) {
    //         if (err) callback(err);
    //         else if (rows.length === 0) {
    //             let error = new Error('There\'s no such page.');
    //             error.name = "NO_PAGE_ERROR";
    //             callback(error);
    //         } else {
    //             let pageInfo = rows[0];
    //             pageInfo.title = (pageInfo.ns_title === "Main" ? '' : pageInfo.ns_title + ':') + pageInfo.page_title;
    //             callback(null, pageInfo);
    //         }
    //     });
    // }
    getPageInfo(title, callback) {
        let parsedTitle = Wiki.parseTitle(title);
        this.makeWork(async (conn)=>{
            let query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
            let rows = await conn.query(query, [parsedTitle[0], parsedTitle[1]]).catch(e => {throw e});
            if(rows.length === 0){
                let error = new Error('There\'s no such page.');
                error.name = "NO_PAGE_ERROR";
                throw error;
            } else {
                let row = rows[0];
                row.title = (row.ns_title === "Main" ? '' : row.ns_title + ':') + row.page_title;
                return row;
            }
        })().then(res => {callback(null, res)}).catch(e => {callback(e)});
    }

    promiseGetPageInfo(title, callback) {
        let parsedTitle = Wiki.parseTitle(title);
        return this.makeWork(async (conn)=>{
            let query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
            let rows = await conn.query(query, [parsedTitle[0], parsedTitle[1]]).catch(e => {throw e});
            if(rows.length === 0){
                let error = new Error('There\'s no such page.');
                error.name = "NO_PAGE_ERROR";
                throw error;
            } else {
                let row = rows[0];
                row.title = (row.ns_title === "Main" ? '' : row.ns_title + ':') + row.page_title;
                return row;
            }
        })();
    }

    /**
     * @function
     * @param{number} nsId
     * @param{number} pageId
     * @param{number} userId
     * @param{number} type - create(8), read(4), update(2), delete(1)
     * @param callback(err, result)
     * @property result - true if you can access.
     */

    // checkAC(nsId, pageId, userId, type, callback) {
    //     let query = "SELECT AC FROM ACL WHERE user_id = ? and (ns_id = ? OR page_id = ?)";
    //     this.conn.query(query, [userId, nsId, pageId], function (err, rows) {
    //         if (err) callback(err);
    //         else if (rows.length === 0) callback(null, false);
    //         else {
    //             for (let i = 0; i < rows.length; i++) {
    //                 if (rows[i].AC & type) {
    //                     callback(null, true);
    //                     return;
    //                 }
    //             }
    //             callback(null, false);
    //         }
    //     });
    // };

    promiseCheckAC(nsId, pageId, userId, type) {
        return this.makeWork(async conn => {
            let query = "SELECT AC FROM ACL WHERE user_id = ? and (ns_id = ? OR page_id = ?)";
            let rows = await conn.query(query, [userId, nsId, pageId]).catch(e => {throw e});
            if (rows.length === 0) return false;
            else {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].AC & type) {
                        return true;
                    }
                }
                return false;
            }
        })()
    };
    checkAC(nsId, pageId, userId, type, callback) {
        this.makeWork(async conn => {
            let query = "SELECT AC FROM ACL WHERE user_id = ? and (ns_id = ? OR page_id = ?)";
            let rows = await conn.query(query, [userId, nsId, pageId]).catch(e => {throw e});
            if (rows.length === 0) return false;
            else {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].AC & type) {
                        return true;
                    }
                }
                return false;
            }
        })().then(res => {callback(null, res)}).catch(e => {callback(e)});
    };

    /**
     *
     * @param title
     * @param userId
     * @param callback(err, page)
     * @property page.title
     * @property page.touched
     * @property page.text
     */
    getRawPage(title, userId, callback) {
        let thisClass = this;
        this.promiseGetPageInfo(title)
            .then(pageInfo => {
                return new Promise((resolve, reject) => {
                    if(pageInfo.deleted){
                        let error = new Error('Page is deleted.');
                        error.name = "DELETED_PAGE";
                        resolve([error, pageInfo]);
                    } else if ((pageInfo.page_PAC && pageInfo.page_PAC & 4) || (!pageInfo.page_PAC && pageInfo.ns_PAC & 4)) { //can read
                        resolve([null, pageInfo]);
                    } else {
                        if (userId) {
                            promiseCheckAC(pageInfo.ns_id, pageInfo.page_id, userId, 4)
                                .then(ac => {
                                    if (err) reject(err);
                                    else if (ac) resolve([null, pageInfo]);
                                    else {
                                        let error = new Error('You have no privilege for this page.');
                                        error.name = "NO_PRIVILEGE";
                                        resolve([error, pageInfo]);
                                    }
                                })
                                .catch(e => {throw e});
                        } else {
                            let error = new Error('You have no privilege for this page.');
                            error.name = "NO_PRIVILEGE";
                            resolve([error, pageInfo]);
                        }
                    }
                });
            })
            .then(([error, pageInfo]) => {//read page
                return thisClass.makeWork(async conn => {
                    let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
                    let [row] = await conn.query(query, [pageInfo.page_id, pageInfo.rev_id]).catch(e => {throw e});
                    let data = {
                        title: pageInfo.title,
                        rev_id: pageInfo.rev_id,
                        touched: pageInfo.touched,
                        text: row.text
                    };
                    if ((pageInfo.page_PAC && pageInfo.page_PAC & 2) || (!pageInfo.page_PAC && pageInfo.ns_PAC & 2)) {}
                    else if (userId) {
                        let ac = await thisClass.promiseCheckAC(pageInfo.ns_id, pageInfo.page_id, userId, 2).catch(e => {throw e;});
                        if (!ac) data.readOnly = true;
                    } else {
                        data.readOnly = true;
                    }
                    return data;
                })();
            }).then(data => {callback(null, data);}).catch(e => {callback(e)});
    }
    // getRawPage(title, userId, callback) {
    //     let thisClass = this;
    //     async.waterfall([function (next) {
    //         thisClass.getPageInfo(title, next);
    //     }, function (pageInfo, next) {
    //         if (pageInfo.deleted) {
    //             let error = new Error('Page is deleted.');
    //             error.name = "DELETED_PAGE";
    //             callback(error);
    //         } else if ((pageInfo.page_PAC && pageInfo.page_PAC & 4) || (!pageInfo.page_PAC && pageInfo.ns_PAC & 4)) { //can read
    //             next(null, pageInfo);
    //         } else {
    //             if (userId) {
    //                 thisClass.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4, function (err, ac) {
    //                     if (err) next(err);
    //                     else if (ac) next(null, pageInfo);
    //                     else {
    //                         let error = new Error('You have no privilege for this page.');
    //                         error.name = "NO_PRIVILEGE";
    //                         callback(error);
    //                     }
    //                 });
    //             } else {
    //                 let error = new Error('You have no privilege for this page.');
    //                 error.name = "NO_PRIVILEGE";
    //                 callback(error);
    //             }
    //         }
    //     }, function (pageInfo) { //read page
    //         let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
    //         thisClass.conn.query(query, [pageInfo.page_id, pageInfo.rev_id], function (err, rows) {
    //             if (err) callback(err);
    //             else {
    //                 let data = {
    //                     title: pageInfo.title,
    //                     rev_id: pageInfo.rev_id,
    //                     touched: pageInfo.touched,
    //                     text: rows[0].text
    //                 };
    //                 if ((pageInfo.page_PAC && pageInfo.page_PAC & 2) || (!pageInfo.page_PAC && pageInfo.ns_PAC & 2)) callback(null, data);
    //                 else if (userId) {
    //                     thisClass.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 2, function (err, ac) {
    //                         if (err) {
    //                             next(err);
    //                             return;
    //                         }
    //                         else if (!ac) data.readOnly = true;
    //                         callback(null, data);
    //                     });
    //                 } else {
    //                     data.readOnly = true;
    //                     callback(null, data);
    //                 }
    //             }
    //         });
    //     }], callback);
    // }

    updatePageCache(page_id, rev_id, title, callback) {
        let thisClass = this;
        this.makeWork(async (conn)=>{
            let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
            let [row] = await conn.query(query, [page_id, rev_id]).catch(e => {throw e});
            if(row == undefined) throw new Error('Wrong Page Id: '+page_id+', Rev Id: '+rev_id);

            let parsedTitle = Wiki.parseTitle(title);
            let content = this.parser.out(row.text, parsedTitle[0], parsedTitle[1]);
            query = "INSERT INTO caching (page_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content=?";
            await conn.query(query, [page_id, content, content]).then(() => content).catch(e => {throw e});
        })().then(res => {callback(null, res)}, err => {callback(err)});
    }

    promiseUpdatePageCache(page_id, rev_id, title, callback) {
        return this.makeWork(async (conn)=>{
            let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
            let [row] = await conn.query(query, [page_id, rev_id]).catch(e => {throw e});
            if(row == undefined) throw new Error('Wrong Page Id: '+page_id+', Rev Id: '+rev_id);

            let parsedTitle = Wiki.parseTitle(title);
            let content = this.parser.out(row.text, parsedTitle[0], parsedTitle[1]);
            console.log(row, content);
            query = "INSERT INTO caching (page_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content=?";
            await conn.query(query, [page_id, content, content]).catch(e => {throw e});
            return content;
        })();
    }

    // getParsedPage(title, userId, callback) {
    //     let thisClass = this;
    //     async.waterfall([function (next) {
    //         thisClass.getPageInfo(title, next);
    //     }, function (pageInfo, next) {
    //         if (pageInfo.deleted) {
    //             let error = new Error('Page is deleted.');
    //             error.name = "DELETED_PAGE";
    //             callback(error, pageInfo);
    //         } else if ((pageInfo.page_PAC && pageInfo.page_PAC & 4) || (!pageInfo.page_PAC && pageInfo.ns_PAC & 4)) { //can read
    //             next(null, pageInfo);
    //         } else {
    //             if (userId) {
    //                 thisClass.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4, function (err, ac) {
    //                     if (err) next(err);
    //                     else if (ac) next(null, pageInfo);
    //                     else {
    //                         let error = new Error('You have no privilege for this page.');
    //                         error.name = "NO_PRIVILEGE";
    //                         callback(error, pageInfo);
    //                     }
    //                 });
    //             } else {
    //                 let error = new Error('You have no privilege for this page.');
    //                 error.name = "NO_PRIVILEGE";
    //                 callback(error, pageInfo);
    //             }
    //         }
    //     }, function (pageInfo) { //read page
    //         if (pageInfo.redirect) {
    //             callback(null, {redirectFrom: pageInfo.title, redirectTo: pageInfo.redirect});
    //         } else if (pageInfo.cached) {
    //             let query = "SELECT content FROM caching WHERE page_id = ?";
    //             thisClass.conn.query(query, [pageInfo.page_id], function (err, rows) {
    //                 if (err) callback(err);
    //                 else if (rows.length === 0) callback(new Error('fatal error: cache data doen\'t exists for page_id=' + pageInfo.page_id));
    //                 else callback(null, {
    //                         title: pageInfo.title,
    //                         touched: pageInfo.touched,
    //                         parsedContent: rows[0].content
    //                     });
    //             });
    //         } else {
    //             thisClass.updatePageCache(pageInfo.page_id, pageInfo.rev_id, pageInfo.title, function (err, parsedContent) {
    //                 if (err) callback(err);
    //                 else callback(null, {
    //                     title: pageInfo.title,
    //                     touched: pageInfo.touched,
    //                     parsedContent: parsedContent
    //                 })
    //             });
    //         }
    //     }], callback);
    // }
    getParsedPage(title, userId, callback) {
        let thisClass = this;
        this.promiseGetPageInfo(title)
            .then(pageInfo => {
                return new Promise((resolve, reject) => {
                    if(pageInfo.deleted){
                        let error = new Error('Page is deleted.');
                        error.name = "DELETED_PAGE";
                        resolve([error, pageInfo]);
                    } else if ((pageInfo.page_PAC && pageInfo.page_PAC & 4) || (!pageInfo.page_PAC && pageInfo.ns_PAC & 4)) { //can read
                        resolve([null, pageInfo]);
                    } else {
                        if (userId) {
                            promiseCheckAC(pageInfo.ns_id, pageInfo.page_id, userId, 4)
                                .then(ac => {
                                    if (err) reject(err);
                                    else if (ac) resolve([null, pageInfo]);
                                    else {
                                        let error = new Error('You have no privilege for this page.');
                                        error.name = "NO_PRIVILEGE";
                                        resolve([error, pageInfo]);
                                    }
                                })
                                .catch(e => {throw e});
                        } else {
                            let error = new Error('You have no privilege for this page.');
                            error.name = "NO_PRIVILEGE";
                            resolve([error, pageInfo]);
                        }
                    }
                });
            })
            .then(([error, pageInfo]) => {//read page
                if (pageInfo.redirect) {
                    callback(null, {redirectFrom: pageInfo.title, redirectTo: pageInfo.redirect});
                } else if (pageInfo.cached) {
                    thisClass.makeWork(async (conn) => {
                        let query = "SELECT content FROM caching WHERE page_id = ?";
                        let [parsedPage] = await conn.query(query, [pageInfo.page_id]).catch(e => {console.log(4);throw e;});
                        if (parsedPage === undefined) throw new Error('fatal error: cache data doen\'t exists for page_id=' + pageInfo.page_id);
                        return parsedPage.content;
                    })().then(parsedContent => {
                        callback(null, {
                            title: pageInfo.title,
                            touched: pageInfo.touched,
                            parsedContent: parsedContent
                        });
                    }).catch(e => {throw e;});
                } else {
                    thisClass.promiseUpdatePageCache(pageInfo.page_id, pageInfo.rev_id, pageInfo.title)
                        .then(parsedContent => {
                            callback(null, {
                                title: pageInfo.title,
                                touched: pageInfo.touched,
                                parsedContent: parsedContent
                            })
                        })
                        .catch(e => {throw e;});
                }
            });
    }

    /**
     * @function editPage - Edit page or Create page if not exists.
     * @param{Object} page
     * @param{String} page.title - Page title, include namespace.
     * @param{String} page.userText - User text. Username or ip.
     * @param{String} page.text - wiki text.
     * @param{number} userId
     * @param callback(err)
     */
    editPage(page, userId, callback) {
        let parsedTitle = Wiki.parseTitle(page.title);
        let thisClass = this;
        let data = {
            page_title: parsedTitle[1]
        };
        this.makeTransaction(async conn => {
            //get ns_id
            let rows = await conn.query("SELECT * FROM namespace WHERE ns_title = ?", [parsedTitle[0]]).catch(e=>{throw e;});
            if(rows.length === 0){
                let error = new Error("namespace doesn't exist: " + parsedTitle[0]);
                error.name = "NO_NAMESPACE";
                throw error;
            }
            data.ns_id = rows[0].ns_id;
            let ns_PAC = rows[0].ns_PAC;
            console.log(1, rows);
            //make page
            let isNewPage = false;
            let query = "INSERT INTO page (ns_id, page_title, user_ID, user_text) VALUES (?, ?, ?, ?)";
            await conn.query(query, [data.ns_id, data.page_title, userId, page.userText]).catch(err => {
                if (err.code == "ER_DUP_ENTRY") {
                    isNewPage = false;
                } else throw err;
            });

            //get page_id
            query = 'SELECT page_id, rev_id, rev_counter, page_PAC FROM page WHERE ns_id=? and page_title=?';
            rows = await conn.query(query, [data.ns_id, data.page_title]).catch(e => {throw e;});
            console.log(2, rows);
            data.page_id = rows[0].page_id;
            data.rev_id = rows[0].rev_counter + 1;
            data.parent_id = rows[0].rev_id;
            let page_PAC = rows[0].page_PAC;
            console.log(3, data);
            //check access control
            if (isNewPage) {
                if ((ns_PAC & 8) || await thisClass.checkAC(data.ns_id, null, userId, 8)) {
                } else{
                    let error = new Error('You have no privilege for this page.');
                    error.name = "NO_PRIVILEGE";
                    throw error;
                }
            } else if (!((page_PAC && page_PAC & 2) || (!page_PAC && ns_PAC & 2))) {
                let res = thisClass.promiseCheckAC(data.ns_id, data.page_id, userId, 2);
                if(!res){
                    let error = new Error('You have no privilege for this page.');
                    error.name = "NO_PRIVILEGE";
                    throw error;
                }
            }

            //add revision
            let revision = {
                page_id: data.page_id,
                rev_id: data.rev_id,
                user_id: userId,
                user_text: page.userText,
                text: page.text,
                parent_id: data.parent_id,
                minor: page.minor,
                comment: page.comment
            };
            return await conn.query("INSERT INTO revision SET ?", [revision]);
        })().then(data => {callback(null, data)}).catch(e => {callback(e)});
    }

    // editPage(page, userId, callback) {
    //     let parsedTitle = Wiki.parseTitle(page.title);
    //     let thisClass = this;
    //     this.conn.beginTransaction(function (err) {
    //         if (err) {
    //             callback(err);
    //             return;
    //         }
    //         let data = {
    //             page_title: parsedTitle[1]
    //         };
    //
    //         async.waterfall([function (next) { //get ns_id
    //             thisClass.conn.query("SELECT * FROM namespace WHERE ns_title = ?", [parsedTitle[0]], function (err, rows) {
    //                 if (err) next(err);
    //                 else if (rows.length === 0) {
    //                     let error = new Error("namespace doesn't exist: " + parsedTitle[0]);
    //                     error.name = "NO_NAMESPACE";
    //                     next(error);
    //                 } else {
    //                     data.ns_id = rows[0].ns_id;
    //                     next(null, rows[0].ns_PAC);
    //                 }
    //             });
    //         }, function (ns_PAC, next) { //insert page
    //             let query = "INSERT INTO page (ns_id, page_title, user_ID, user_text) VALUES (?, ?, ?, ?)";
    //             thisClass.conn.query(query, [data.ns_id, data.page_title, userId, page.userText], function (err) {
    //                 if (err && err.code == "ER_DUP_ENTRY") {
    //                     next(null, ns_PAC, false);
    //                 } else if (err) next(err);
    //                 else {
    //                     next(null, ns_PAC, true);
    //                 }
    //             });
    //         }, function (ns_PAC, created, next) { //get page_id
    //             thisClass.conn.query('SELECT page_id, rev_id, rev_counter, page_PAC FROM page WHERE ns_id=? and page_title=?', [data.ns_id, data.page_title], function (err, rows) {
    //                 if (err) {
    //                     next(err);
    //                     return;
    //                 }
    //                 data.page_id = rows[0].page_id;
    //                 data.rev_id = rows[0].rev_counter + 1;
    //                 data.parent_id = rows[0].rev_id;
    //                 next(null, ns_PAC, rows[0].page_PAC, created);
    //             });
    //         }, function (ns_PAC, page_PAC, created, next) { //check access control
    //             if (created) { //create page
    //                 if (ns_PAC & 8) {
    //                     next(null, true);
    //                     return;
    //                 } else {
    //                     thisClass.checkAC(data.ns_id, null, userId, 8, next);
    //                 }
    //             } else if ((page_PAC && page_PAC & 2) || (!page_PAC && ns_PAC & 2)) { //edit page
    //                 next(null, true);
    //             } else {
    //                 thisClass.checkAC(data.ns_id, data.page_id, userId, 2, next);
    //             }
    //         }, function (acResult, next) {
    //             if (acResult) next(null);
    //             else {
    //                 var error = new Error('You have no privilege for this page.');
    //                 error.name = "NO_PRIVILEGE";
    //                 next(error);
    //             }
    //         }, function (next) { //add revision
    //             let revision = {
    //                 page_id: data.page_id,
    //                 rev_id: data.rev_id,
    //                 user_id: userId,
    //                 user_text: page.userText,
    //                 text: page.text,
    //                 parent_id: data.parent_id,
    //                 minor: page.minor,
    //                 comment: page.comment
    //             };
    //             thisClass.conn.query("INSERT INTO revision SET ?", [revision], function (err, rows) {
    //                 next(err);
    //             });
    //         }], function (err) {
    //             if (err) {
    //                 thisClass.conn.rollback(function (roll_err) {
    //                     if (roll_err) callback(roll_err);
    //                     else callback(err);
    //                 });
    //             } else {
    //                 thisClass.conn.commit(function (com_err) {
    //                     if (com_err) callback(com_err);
    //                     else callback(null);
    //                 });
    //             }
    //
    //         });
    //     });
    // }


    // searchTitles(title, callback){
    //     let parsedTitle = Wiki.parseTitle(title);
    //     let query = 'SELECT ns_title, page_title FROM fullpage WHERE ns_title LIKE "%' + parsedTitle[0] + '%" AND page_title LIKE "' + parsedTitle[1] + '%" AND deleted = 0 LIMIT 7';
    //     this.conn.query(query, function (err, res) {
    //         if (!err) {
    //             let result = res.map((item) => {
    //                 let title = (item.ns_title === 'Main' ? '' : item.ns_title+':') + item.page_title;
    //                 return {
    //                     title: title,
    //                     url: '/wiki/view/' + title
    //                 };
    //             });
    //
    //             callback(null, result);
    //         } else {
    //             callback(err);
    //         }
    //     });
    // }
    searchTitles(title, callback) {
        let parsedTitle = Wiki.parseTitle(title);
        return this.makeWork(async (conn)=>{
            let query = 'SELECT ns_title, page_title FROM fullpage WHERE ns_title LIKE "%' + parsedTitle[0] + '%" AND page_title LIKE "' + parsedTitle[1] + '%" AND deleted = 0 LIMIT 7';
            let res = await conn.query(query).catch(e=>{throw e;});

            return res.map((item) => {
                let title = (item.ns_title === 'Main' ? '' : item.ns_title+':') + item.page_title;
                return {
                    title: title,
                    url: '/wiki/view/' + title
                };
            });
        })().then(res => {callback(null, res)}, err => {callback(err)});
    }

    deletePage(title, userId, callback) {

    }

    backup(dest, callback) {
        let mysqlDump = require('mysqldump');
        mysqlDump({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
            dest: dest
        }, function (err) {
            callback(err);
        })
    }

    login(username, password) {
        return this.makeWork(async (conn) => {
            console.log(username, password);
            let [user] = await conn.query("SELECT user_id, nickname, password = PASSWORD(?) as correct FROM user WHERE username = ?", [password, username]).catch(e => {throw e});
            return [(user ? user.correct : 2), user];
        })();
    }

    userInfo() {

    }

    // createUser(user, callback) {
    //     this.conn.query("INSERT INTO user (username, nickname, password, email) VALUES (?, ?, PASSWORD(?), ?)", [user.username, user.nickname, user.password, user.email], callback);
    // }

    updateUser() {

    }

    // checkUsername(username, callback) {
    //     this.conn.query("SELECT user_id FROM user WHERE username=?", [username], function (err, rows) {
    //         callback(err, rows.length !== 0);
    //     });
    // }

    // checkNickname(nickname, callback) {
    //     this.conn.query("SELECT user_id FROM user WHERE nickname=?", [nickname], function (err, rows) {
    //         callback(err, rows.length !== 0);
    //     });
    // }
}

module.exports = Wiki;


