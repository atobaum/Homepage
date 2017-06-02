/**
 * Created by Le Reveur on 2017-05-01.
 */
var mysql = require('mysql');
var async = require('async');
var regexTitle = /^(?:(.*?):)?(.+?)$/;
function wiki(config){
    this.parser = require('./parser');
    this.parser = new this.parser();
    this.conn = mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        dateStrings: 'date'
    }, function(err){
        console.error('Error occured while making connection with MySql server: ');
        console.error(err);
    });
};

wiki.prototype.rawPage = function(title, callback){
    var thisClass = this;
    this.db.getRawPage(title, null, function(err, page){
        if(err){
            callback(err);
            return;
        }
        callback(null, page);
    });
};

wiki.prototype.parse = function(src){
    return this.parser.out(src);
};

wiki.prototype.getPageInfo = function(title, callback){
    var parsedTitle = regexTitle.exec(title);
    if (parsedTitle[1]){
        var nsTitle = parsedTitle[1];
    } else{
        var nsTitle = "Main";
    }
    var query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
    this.conn.query(query, [nsTitle, parsedTitle[2]], function(err, rows){
        if(err) callback(err);
        else if(rows.length == 0){
            var error = new Error('There\'s no such page.');
            error.name = "NO_PAGE_ERROR";
            callback(error);
        } else {
            callback(null, rows[0])
        }
    });
};

/**
 * @function
 * @param{number} nsId
 * @param{number} pageId
 * @param{number} userId
 * @param{number} type - create(8), read(4), update(2), delete(1)
 * @param callback(err, result)
 */
wiki.prototype.checkAC = function(nsId, pageId, userId, type, callback){
    var query = "SELECT AC FROM ACL WHERE user_id = ? and (ns_id = ? OR page_id = ?)";
    this.conn.query(query, [userId, nsId, pageId], function(err, rows){
        if(err) callback(err);
        else if(rows.length == 0) callback(null, false);
        else{
            for(var i = 1; i < rows.length; i++){
                if(rows[i].AC & type){
                    callback(null, true);
                    return;
                }
            }
            callback(null, false);
        }
    });
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
wiki.prototype.getRawPage = function(title, userId, callback){
    var thisClass = this;
    async.waterfall([function(next){
        thisClass.getPageInfo(title, next);
    }, function(pageInfo, next){
        if(pageInfo.deleted){
            var error = new Error('Page is deleted.');
            error.name = "DELETED_PAGE";
            callback(error);
        } else if((pageInfo.page_PAC && pageInfo.page_PAC & 4) || (pageInfo.ns_PAC & 4)){ //can read
            next(null, pageInfo);
        } else {
            if(userId){
                thisClass.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4, function(err, ac){
                    if(err) next(err);
                    else if(ac) next(null, pageInfo);
                    else{
                        var error = new Error('You have no privilege for this page.');
                        error.name = "NO_PRIVILEGE";
                        callback(error);
                    }
                });
            } else{
                var error = new Error('You have no privilege for this page.');
                error.name = "NO_PRIVILEGE";
                callback(error);
            }
        }
    }, function(pageInfo){ //read page
        query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
        thisClass.conn.query(query, [pageInfo.page_id, pageInfo.rev_id], function (err, rows) {
            if(err) callback(err);
            else callback(null, {title: title, touched: pageInfo.touched, text: rows[0].text});
        });
    }], callback);
};

wiki.prototype.updatePageCache = function(page_id, rev_id, callback){
    var thisClass = this;
    var query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
    thisClass.conn.query(query, [page_id, rev_id], function (err, rows) {
        if(err) callback(err);
        else {
            query = "INSERT INTO caching (page_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content=?";
            var content = thisClass.parse(rows[0].text);
            thisClass.conn.query(query, [page_id, content, content], function(err){
                callback(err, content);
            });
        }
    });
};

wiki.prototype.getParsedPage = function(title, userId, callback){
    var thisClass = this;
    async.waterfall([function(next){
        thisClass.getPageInfo(title, next);
    }, function(pageInfo, next){
        if(pageInfo.deleted){
            var error = new Error('Page is deleted.');
            error.name = "DELETED_PAGE";
            callback(error);
        } else if((pageInfo.page_PAC && pageInfo.page_PAC & 4) || (pageInfo.ns_PAC & 4)){ //can read
            next(null, pageInfo);
        } else {
            if(userId){
                thisClass.checkAC(pageInfo.ns_id, pageInfo.page_id, userId, 4, function(err, ac){
                    if(err) next(err);
                    else if(ac) next(null, pageInfo);
                    else{
                        var error = new Error('You have no privilege for this page.');
                        error.name = "NO_PRIVILEGE";
                        callback(error);
                    }
                });
            } else{
                var error = new Error('You have no privilege for this page.');
                error.name = "NO_PRIVILEGE";
                callback(error);
            }
        }
    }, function(pageInfo){ //read page
        if(pageInfo.redirect){
            callback(null, {redirectFrom: title, redirectTo: pageInfo.redirect});
        } else if(pageInfo.cached){
            query = "SELECT content FROM caching WHERE page_id = ?";
            thisClass.conn.query(query, [pageInfo.page_id], function (err, rows) {
                if(err) callback(err);
                else if(rows.length == 0) callback(new Error('fatal error: cache data doen\'t exists for page_id='+pageInfo.page_id));
                else callback(null, {title: title, touched: pageInfo.touched, parsedContent: rows[0].content});
            });
        } else{
            thisClass.updatePageCache(pageInfo.page_id, pageInfo.rev_id, function(err, parsedContent){
                if(err) callback(err);
                else callback(null, {title: title, touched: pageInfo.touched, parsedContent: parsedContent})
            });
        }
    }], callback);
};

/**
 * @function editPage - Edit page or Create page if not exists.
 * @param{Object} page
 * @param{String} page.title - Page title, include namespace.
 * @param{String} page.userText - User text. Username or ip.
 * @param{String} page.text - wiki text.
 * @param{number} userId
 * @param callback(err)
 */
wiki.prototype.editPage = function(page, userId, callback){
    console.log(page);
    var parsedTitle = regexTitle.exec(page.title);
    var ns_title = parsedTitle[1] || "Main";
    var page_title = parsedTitle[2];
    var thisClass = this;
    this.conn.beginTransaction(function(err) {
        if (err) {
            callback(err);
            return;
        }
        var data = {
            page_title: page_title
        };

        async.waterfall([function(next) { //get ns_id
            thisClass.conn.query("SELECT * FROM namespace WHERE ns_title = ?", [ns_title], function(err, rows){
                if(err) next(err);
                else if(rows.length == 0){
                    var error = new Error("namespace doesn't exist: "+ns_title);
                    error.name = "NO_NAMESPACE";
                    next(error);
                } else next(null, rows[0].ns_id, rows[0].ns_PAC);
            });
        }, function(ns_id, ns_PAC, next){ //check ac
            if(ns_PAC & 8) {
                data.ns_id = ns_id;
                next(null);
            } else{
                thisClass.checkAC(ns_id, null, userId, 8, function(err, ac){
                    if(err) next(err);
                    else if(ac) {
                        data.ns_id = ns_id;
                        console.log(data);
                        next(null);
                    }
                    else{
                        var error = new Error('You have no privilege for this page.');
                        error.name = "NO_PRIVILEGE";
                        next(error);
                    }
                });
            }
        }, function(next){ //insert page
            var query = "INSERT INTO page (ns_id, page_title) select ?, ? from dual where not exists (select * from page where ns_id=? and page_title=?);";
            thisClass.conn.query(query, [data.ns_id, data.page_title, data.ns_id, data.page_title], function (err) {
                next(err);
            });
        }, function(next){ //get page_id
            thisClass.conn.query('SELECT page_id, rev_counter, page_PAC FROM page WHERE ns_id=? and page_title=?', [data.ns_id, data.page_title], function(err, rows){
                if(err){
                    next(err);
                    return;
                }
                data.page_id = rows[0].page_id;
                data.rev_id = rows[0].rev_counter + 1;
                next(null, rows[0].page_id, rows[0].rev_counter + 1);
            });
        }, function(page_id, rev_id, next){ //add revision
            var revision = {
                page_id: page_id,
                rev_id: rev_id,
                user_id: userId,
                user_text: page.userText,
                text: page.text
            };

            thisClass.conn.query("INSERT INTO revision SET ?", [revision], function(err, rows){
                next(err);
            });
        }], function(err){
            if(err){
                thisClass.conn.rollback(function(roll_err){
                    if(roll_err) callback(roll_err);
                    else callback(err);
                });
            } else{
                thisClass.conn.commit(function(com_err){
                    if(com_err) callback(com_err);
                    else callback(null);
                });
            }

        });
    });
};

wiki.prototype.searchTitles = function(query, callback){
    var parseTitle = regexTitle.exec(query);
    var thisClass = this;
    var ns_title = parseTitle[1] || 'Main';
    var query = 'SELECT ns_title, page_title FROM fullpage WHERE ns_title LIKE "%'+ns_title+'%" AND page_title LIKE "'+parseTitle[2]+'%" AND deleted = 0';
    this.conn.query(query, function(err, res, fields){
        callback(err, res);
    });
};

wiki.prototype.deletePage = function(title, userId, callback){

};

wiki.prototype.backup = function(dest, callback){
    var mysqlDump = require('mysqldump');
    mysqlDump({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        dest: dest
    },function(err){
        callback(err);
    })
};

module.exports = wiki;


