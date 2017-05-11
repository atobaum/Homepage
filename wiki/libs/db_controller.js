/**
 * Created by Le Reveur on 2017-05-01.
 */

var mysql = require('mysql');
var async = require('async');

var dbController = function(config){
    this.conn = mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        dateStrings: 'date'
    }, function(err){
        console.error('Error occured while making connection with MySql server: ');
        console.error(err);
    });
};

dbController.prototype.getPage = function(title, callback){
    var query = "SELECT page_id, title, rev_id, content, user FROM pages JOIN revisions ON revisions.page_id = pages.id WHERE title = ? ORDER BY revisions.rev_id DESC LIMIT 1";
    this.conn.query(query, [title], function(err, rows){
        if(err){
            callback(err);
            return;
        }
        if(rows.length == 0){
            var error = new Error('There\'s no such page.');
            error.name = "NO_PAGE_ERROR";
            callback(error);
            return;
        }
        var page = rows[0];
        delete page.id;
        callback(null, rows[0]);
    });
};

dbController.prototype.editPage = function(data, callback){
    var page = {
        title: data.title
    };
    var thisClass = this;
    this.conn.beginTransaction(function(err) {
        if (err) {
            callback(err);
            return;
        }
        async.waterfall([function(next){ //get page_id
            thisClass.conn.query("INSERT INTO pages SET ?", [page], function (err, rows, fields) {
                if (err && err.code == 'ER_DUP_ENTRY') {    //if page exists
                    thisClass.conn.query('SELECT id FROM pages WHERE title = ?', [page.title], function(err, rows){
                        if(err){
                            next(err);
                            return;
                        }
                        next(null, rows[0].id, null);
                    });
                } else if(err){
                    next(err);
                } else{    //page inserted because page didn't exist.
                    next(null, rows.insertId, 1);
                }
            });
        }, function(page_id, rev_id, next){ //get rev_id
            if (rev_id) {
                next(null, page_id, rev_id);
                return;
            }
            thisClass.conn.query('SELECT rev_id FROM revisions WHERE page_id = ? ORDER BY rev_id DESC LIMIT 1', [page_id], function(err, rows){
                if(err){
                    next(err);
                    return;
                }
                next(null, page_id, rows[0].rev_id + 1);
            });
        }, function(page_id, rev_id, next){
            var revision = {
                page_id: page_id,
                rev_id: rev_id,
                user: data.user,
                content: data.content
            };

            thisClass.conn.query("INSERT INTO revisions SET ?", [revision], function(err, rows){
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

dbController.prototype.searchTitles = function(query, callback){
    var thisClass = this;
    this.conn.query('SELECT title FROM pages WHERE title LIKE '+ thisClass.conn.escape(query+'%')+ ' AND deleted = 0', [query], function(err, res, fields){
        callback(err, res);

    });
};

dbController.prototype.deletePage = function(callback){

};

dbController.prototype.backup = function(dest, callback){
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



module.exports = dbController;