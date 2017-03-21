var mysql = require('mysql');
var config = require('../config.js').dev.db;
var knex = require('knex')({client: 'mysql'});

var conn = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

function insertData(data){
    /*
    data:
    {
        table,
        values: {
            a: 1,
            b: 2
        }
    }

    insert into table (a, b) values (1, 2)
    */
    conn.query(knex(data.table).insert(data.values).timeout(1000).toString(), function(err, res){

    });
}

function selectData(data){

}

module.exports = {


    addCaterory: function(name){
        conn.query('INSERT INTO category (name) values (?)', name, function(err, res){
            if(err){
                console.log(err);
            }
        });
    },

    addPerson: function(person){
        conn.query(knex('people').insert(person), function(err, res){

        });
    },

    addSeries: function(series){

    },

    addTitle: function(title){
        /*book is form of
        {
            title,
            subTitle,
            originalTitle,
            page,
            authors: [
                        {
                            name, type
                        }
                    ]
            publisher,
            publishedDate,
            isbn13,
            coverURL
        }
        */

        
    },

    addRead: function(read, next){
        conn.query('INSERT INTO read_list (book_id, start_date, finishe_dated, rating, comment) values (?, ?, ?, ?)', read.isbn13, read.start_date, read.finished_date, read.rating, read.comment, function(err, rows, fields){
            if(!err){

            } else{
                console.log('Error while adding read.'+err);
            }
        });
        next();
    },

    searchCategory: function(){

    },

    searchPerson: function(){

    },

    searchSeries: function(){

    },

    searchTitleByISBN: function(isbn){
        var query = connection.query(knex('titles').select('count(*)').where({id:isbn}) ,function(err,rows){
        console.log(rows);
        res.json(rows);
    });
    console.log(query);
    },

    isExistBook: function(isbn, trueCallback, falseCallback){
        // run trueCallback when there is a book and falseCallback if not.
        var query = 'select count(*) from Titles where isbn13 = ' + isbn;
        conn.query(query, function(err, rows, fields){
            if(!err){
                if(rows[0]['count(*)'] == 0)
                    falseCallback(isbn);
                else
                    trueCallback(isbn);
            } else{
                console.log('Error while performing Query.'+err);
            }
        });
    },

    searchTitle: function(book){


    },

    searchRead: function(){

    }
};
