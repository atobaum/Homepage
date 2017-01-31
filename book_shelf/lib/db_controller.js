var mysql = require('mysql');
var config = require('../config.js').dev;
var conn = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

module.exports = {
    addCaterory: function(name){
        conn.query('INSERT INTO category (name) values (?)', name, function(err, res){

        });
    },
    addPerson: function(){

    },
    addSeries: function(){

    },
    addTitle: function(title){

    },
    addRead: function(){

    },
    searchCategory: function(){

    },
    searchPerson: function(){

    },
    searchSeries: function(){

    },
    searchTitle: function(){

    },
    searchRead: function(){

    }
};
