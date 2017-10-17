var fs = require('fs');
var mysql = require('mysql');
var async = require('async');

/** @module db_init
 * @desc initialize mysql using db_init.sql
 * @param config - configure of mysql db for book_shelf.
 */
module.exports = function (config, callback) {
    var sql = fs.readFileSync(__dirname + '/db_init.sql', 'utf8');
    var con = mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        multipleStatements: true
    });

    async.series([
        function (callback) {
            con.query('CREATE DATABASE ' + config.database, function (err, res) {
                if (err) {
                    console.log("Error occurred while creating database: " + err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }, function (callback) {
            con.query('USE ' + config.database, function (err, res) {
                if (err) {
                    console.log("Error occurred while selecting database: " + err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }, function (callback) {
            con.query(sql, function (err, results) {
                if (err) {
                    console.log("Error occurred while making tables: " + err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    ], function (err) {
        if (err) {
            console.log("Error occurred while initializing database: " + err);
            callback(err);
        } else {
            callback(null);
        }
    });
};
