var fs = require('fs');
var mysql = require('mysql');

/** @module db_init
* @desc initialize mysql using db_init.sql
* @param config - configure of mysql db for book_shelf.
*/
module.exports = function(config){
    var sql = fs.readFileSync(__dirname+'/db_init.sql', 'utf8');
    var con = mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        multipleStatements: true
    });
    console.log('CREATE DATABASE ' + config.database);
    con.query('CREATE DATABASE ' + config.database, function(err, res){
        console.log(res);
    });

    con.query('USE ' + config.database, function(err, res){
        console.log(res);
    });

    con.query(sql, function(err, results){
        for (var result in results) {
            console.log(result);
        }
    });
};
