/**
 * Created by Le Reveur on 2017-05-01.
 */
"use strict";
let promise_mysql = require('promise-mysql');
class Wiki {
    constructor(config) {
        this.parser = require('./parser');
        this.parser = new this.parser(this);
        this.config = config;
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

    addMacro(macro) {

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

    async makeWork2(work) {
        let conn = await this.connPool.getConnection().catch(e => {
            throw e
        });
        let result = await work(conn).catch(e => {
            throw e
        });
        conn.connection.release();
        return result;
    }

    static parseTitle(title){
        let regexTitle = /^(?:(.*?):)?(.+?)$/;
        let parsedTitle = regexTitle.exec(title);
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

    async parse(src, title) {
        let parsedTitle = Wiki.parseTitle(title);
        return (await this.parser.out(src, parsedTitle[0], parsedTitle[1]).catch(e => e.message))[0];
    }

    /**
     *
     * @param title
     * @returns page{Promise} - A promise object that gives the page. If namespace doesn't exist, page.noPage = 1. If namespace exists but page is not, page.noPage = 2. Otherwise, page.noPage = undefined.
     */
    getPageInfo(title) {
        let parsedTitle = Wiki.parseTitle(title);
        return this.makeWork(async (conn)=>{
            let query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
            let rows = await conn.query(query, [parsedTitle[0], parsedTitle[1]]).catch(e => {throw e});
            let result;
            if(rows.length === 0){
                query = "SELECT * FROM namespace WHERE ns_title = ?";
                rows = await conn.query(query, [parsedTitle[0]]).catch(e => {
                    throw e
                });
                if (rows.length === 0) result = {ns_title: parsedTitle[0], page_title: parsedTitle[1], noPage: 1};
                else {
                    result = rows[0];
                    result.page_title = parsedTitle[1];
                    result.noPage = 2;
                }
            } else {
                result = rows[0];
            }
            result.title = (result.ns_title === "Main" ? '' : result.ns_title + ':') + result.page_title;
            return result;
        })();
    }

    /**
     * @function
     * @param{number} nsId
     * @param{number} pageId
     * @param{number} userId
     * @param{number} type - create(8), read(4), update(2), delete(1)
     * @property result - true if you can access.
     */
    checkAC(nsId, pageId, userId, type, nsPAC, pagePAC) {
        if((pagePAC && pagePAC & type) || (!pagePAC && nsPAC & type)) return Promise.resolve(true);
        else if(!userId) return Promise.resolve(false);
        else return this.makeWork2(async conn => {
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
        });
    };

    updatePageCache(ns_title, page_id, rev_id, title) {
        return this.makeWork(async (conn) => {
            let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
            let rows = await conn.query(query, [page_id, rev_id]).catch(e => {
                throw e
            });
            if (rows.length === 0) throw new Error('Wrong Page Id: ' + page_id + ', Rev Id: ' + rev_id);

            let parsedTitle = Wiki.parseTitle(title);
            let [content, category] = await this.parser.out(rows[0].text, parsedTitle[0], parsedTitle[1]).catch(e => e);
            query = "INSERT INTO caching (page_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content=?";
            await this.updateCategory(conn, page_id, category, ns_title === 'Category' ? 0 : 1);
            await conn.query(query, [page_id, content, content]).catch(e => {
                throw e
            });
            return content;
        })();
    }

    /**
     *
     * @param title
     * @param userId
     * @property page.title
     * @property page.touched
     * @property page.text
     */
    async getRawPage(title, userId) {
        let pageInfo = await this.getPageInfo(title);
        if (pageInfo.deleted) {
            let error = new Error('Page is deleted.');
            error.name = "DELETED_PAGE";
            throw error;
        }
        if (pageInfo.noPage) {//no page
            return pageInfo;
        } else if (!(pageInfo.page_PAC && pageInfo.page_PAC & 4) && !(!pageInfo.page_PAC && pageInfo.ns_PAC & 4)) { //can read
            if (userId) {
                let ac = await checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4).catch(e => {
                    throw e
                });
                if (!ac) return {noPrivilege: true, title: title};
            } else {
                return {noPrivilege: true, title: title};
            }
        }

        //read page
        let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
        let [row] = await this.makeWork(async conn => {
            return await conn.query(query, [pageInfo.page_id, pageInfo.rev_id]).catch(e => {
                throw e
            });
        })().catch(e => {
            throw e;
        });
        pageInfo.text = row.text;
        pageInfo.readOnly = !(await this.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 2, pageInfo.ns_PAC, pageInfo.page_PAC).catch(e => {throw e;}));

        delete pageInfo.ns_id;
        delete pageInfo.page_id;
        delete pageInfo.ns_PAC;
        delete pageInfo.page_PAC;
        delete pageInfo.cached;
        delete pageInfo.rev_counter;
        return pageInfo;
    }

    async getParsedPage(title, userId) {
        let pageInfo = await this.getPageInfo(title);
        if (pageInfo.deleted) {
            let error = new Error('Page is deleted.');
            error.name = "DELETED_PAGE";
            throw error;
        }
        if (pageInfo.noPage) {//no page
            return pageInfo;
        } else if (!(pageInfo.page_PAC && pageInfo.page_PAC & 4) && !(!pageInfo.page_PAC && pageInfo.ns_PAC & 4)) { //can read
            if (userId) {
                let ac = await checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4).catch(e => {
                    throw e
                });
                if (!ac) return {noPrivilege: true, title: pageInfo.title};
            } else {
                return {noPrivilege: true, title: pageInfo.title};
            }
        }

        //read page
        let parsedPage = null;
        if (pageInfo.redirect) {
            return {redirectFrom: pageInfo.title, redirectTo: pageInfo.redirect};
        } else if (pageInfo.cached) {
            parsedPage = await this.makeWork(async (conn) => {
                let query = "SELECT content FROM caching WHERE page_id = ?";
                let [parsedPage] = await conn.query(query, [pageInfo.page_id]).catch(e => {
                    throw e;
                });
                if (parsedPage === undefined) throw new Error('fatal error: cache data doen\'t exists for page_id=' + pageInfo.page_id);
                return parsedPage.content;
            })().catch(e => {
                throw e;
            });
        } else {
            parsedPage = await this.updatePageCache(pageInfo.ns_title, pageInfo.page_id, pageInfo.rev_id, pageInfo.title)
                .catch(e => {
                    throw e
                });
        }
        return {
            title: pageInfo.title,
            touched: pageInfo.touched,
            parsedContent: parsedPage
        }
    }

    /**
     * @function editPage - Edit page or Create page if not exists.
     * @param{Object} page
     * @param{String} page.title - Page title, include namespace.
     * @param{String} page.userText - User text. Username or ip.
     * @param{String} page.text - wiki text.
     * @param{number} userId
     */
    editPage(page, userId) {
        let thisClass = this;
        return this.makeTransaction(async conn => {
            let data = await this.getPageInfo(page.title);
            if (data.noPage === 1) {//no namespace
                return data;
            } else if (data.noPage === 2) { //check access control and make page if page doesn't exists but not namespace.
                if (await thisClass.checkAC(data.ns_id, null, userId, 8, data.ns_PAC, null)) {
                    let query = "INSERT INTO page (ns_id, page_title, user_ID, user_text) VALUES (?, ?, ?, ?)";
                    await conn.query(query, [data.ns_id, data.page_title, userId, page.userText]).catch(err => {
                        throw err;
                    });
                } else {
                    let error = new Error('You have no privilege for this page.');
                    error.name = "NO_PRIVILEGE";
                    throw error;
                }
            }

            //get page_id
            let query = 'SELECT page_id, rev_id, rev_counter, page_PAC FROM page WHERE ns_id=? and page_title=?';
            let rows = await conn.query(query, [data.ns_id, data.page_title]).catch(e => {
                throw e;
            });
            data.page_id = rows[0].page_id;
            data.rev_id = rows[0].rev_counter + 1;
            data.parent_id = rows[0].rev_id;
            let page_PAC = rows[0].page_PAC;

            //check access control
            if (!(await thisClass.checkAC(data.ns_id, data.page_id, userId, 2, data.ns_PAC, page_PAC))) {
                let error = new Error('You have no privilege for this page.');
                error.name = "NO_PRIVILEGE";
                throw error;
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
        })();
    }

    searchTitles(title) {
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
        })();
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
            let [user] = await conn.query("SELECT user_id, nickname, password = PASSWORD(?) as correct FROM user WHERE username = ?", [password, username]).catch(e => {throw e});
            return [(user ? user.correct : 2), user];
        })();
    }

    /**
     *
     * @param conn
     * @param page_id
     * @param categories
     * @param type{number} - 0: subcategory, 1: page, 2:file
     * @returns {*}
     */
    updateCategory(conn, page_id, categories, type = 1) {
        return this.makeTransaction(async conn => {
            let query = "DELETE FROM categorylink WHERE \`to\` = ?";
            await conn.query(query, [page_id]).catch(e => {
                throw e
            });
            if (categories.length === 0) return;

            query = "SELECT page_id, cat_title FROM category WHERE " +
                categories.map(title => 'cat_title = ' + conn.escape(title)).join(' OR ');
            let rows = await conn.query(query).catch(e => {
                throw e
            });
            if (rows.length === 0) return categories;
            query = "INSERT INTO categorylink (\`from\`, \`to\`, \`type\`) VALUES ?";
            await conn.query(query, [rows.map(row => [row.page_id, page_id, type])]).catch(e => {
                throw e
            });

            let lowercaseCat = categories.map(title => title.toLowerCase());
            rows.forEach(row => {
                let i = lowercaseCat.indexOf(row.cat_title.toLowerCase());
                if (i >= 0) {
                    categories.splice(i, 1);
                    lowercaseCat.splice(i, 1);
                }
            });
            return categories;
        })();
    }

    getPageList(catTitle) {
        return this.makeWork2(async conn => {
            let query = 'SELECT page_id, cat_title, num_page, num_subcat, num_file FROM category WHERE cat_title = ?';
            let [cat] = await conn.query(query, [catTitle]).catch(e => {
                throw e;
            });
            if (!cat) throw new Error('Wrong category title: ' + catTitle);

            query = 'SELECT categorylink.type as type, fullpage.ns_title as ns_title, fullpage.page_title as page_title FROM categorylink, fullpage WHERE categorylink.from = ? AND fullpage.page_id = categorylink.to';
            let rows = await conn.query(query, [cat.page_id]).catch(e => {
                throw e
            });
            let result = [[], [], []]; //result[0] is for subcategory, result[1] for page, result[2] for file
            rows.forEach(item => {
                if (item.type > 2 && item.type < 0) throw new Error('Invalid categorylink.type = ' + item.type);
                result[item.type].push((item.ns_title === 'Main' ? '' : item.ns_title + ':') + item.page_title);
            });
            return result;
        });
    }

    existPages(titles) {
        let thisClass = this;
        return this.makeWork2(async conn => {
            for (let i = 0; i < titles.length; i++) {
                let parsedTitle = Wiki.parseTitle(titles[i]);
                titles[i] = (await conn.query('SELECT page_id from fullpage where ns_title = ? and page_title = ?', parsedTitle)).length !== 0;
            }
        })
    }

    userInfo() {

    }

    // createUser(user, callback) {
    //     this.conn.query("INSERT INTO user (username, nickname, password, email) VALUES (?, ?, PASSWORD(?), ?)", [user.username, user.nickname, user.password, user.email], callback);
    // }

    updateUser() {

    }

    checkUsername(username) {
        return this.makeWork2(async conn => {
            let rows = await conn.query("SELECT user_id FROM user WHERE username=?", [username]);
            return rows.length !== 0
        })
    }

    checkNickname(username) {
        return this.makeWork2(async conn => {
            let rows = await conn.query("SELECT user_id FROM user WHERE nickname=?", [username]);
            return rows.length !== 0
        })
    }


}

module.exports = Wiki;


