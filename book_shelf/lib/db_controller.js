var mysql = require('mysql');
var config = require('../config.js').dev.db;

var conn = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

function selectData(data, callback){

}

function generate_query_values(parameter){
    var q1 = "(";
    var q2 = " values (";
    var isLastString = 0;
    for (var key in parameter){
        q1 += key + ', ';
        if(typeof(parameter[key]) == "string"){
            q2 += '"'+parameter[key]+'", ';
        }
        else {
            q2 += parameter[key]+', ';
        }
    }
    q1 = q1.substring(0, q1.length - 2) + ")";
    q2 = q2.substring(0, q2.length - 2) + ")";
    return q1 + q2;
}

/**
* @module db_controller
* @todo write addPerson, addSeries, addTitle, searchCategory, searchSeries, searchTitle, searchRead
*/
module.exports = {
    insertData : function (table, data, callback){
        /*
        data:
        {
            a:1,
            b:2
        }

        insert into table (a, b) values (1, 2)
        */
        conn.query('INSERT INTO '+table+' '+generate_query_values(data), function(err, res, fields){
            if(!err){
                callback(res);
            }else{
                console.log('Error while inserting data: '+data+'to table: '+table+'. '+err);
            }
        });
    },

    addCaterory: function(name){
        conn.query('INSERT INTO category (name) values (?)', name, function(err, res){
            if(err){
                console.log(err);
            }
        });
    },

    addPerson: function(person, callback){
    },

    addSeries: function(series){

    },

    addAuthors: function(bookId, authors){
        if(authors.length == 0)
            return;

        var thisClass = this;
        var author = authors.pop();
        if (typeof(author.type) == "string"){
            if(author.type == "저자" || author.type == "author")
                author.type = 1;
            else if(author.type == "옮김" || author.type == "translator")
                author.type = 2;
            else if(author.type == "감수" || author.type == "supervisor")
                author.type = 3;
            else {
                throw new Error("지원하지 않는 저자 타입: "+author.type);
            }
        }
        conn.query('SELECT * FROM people WHERE name_ko="'+author.name+'"', function(err, rows, fields){
            if(err)
                throw err;
            if(rows.length >= 1){
                thisClass.insertData('authors_people', {book_id: bookId, person_id: rows[0].id, type_id: author.type}, function(){
                    return thisClass.addAuthors(bookId, authors);
                });
                thisClass.addAuthors(bookId, authors);
            }else{
                thisClass.insertData('people', {name_ko: author.name}, function(){
                    authors.push(author);
                    thisClass.addAuthors(bookId, authors);
                });
            }
        });
    },

    addBook: function(book){
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
        var thisClass = this;
        conn.query('SELECT * from publisher where name="'+book.publisher+'"', function(err, rows, fields){
            var publisherId;
            if (rows.length >= 1){
                publisherId = rows[0].id;
            }else{
                conn.query('INSERT INTO publisher (name) values (?)', book.publisher, function(err, rows, fields){
                    if(!err)
                        this.addBook(book);
                    else {
                        console.log('Error while adding read.'+err);
                    }
                });
            }

            var data = {
                isbn13: book.isbn13,
                title_ko: book.title,
                title_original: book.originalTitle,
                subtitle: book.subTitle,
                pages: book.page,
                publisher_id: publisherId,
                published_date: book.publishedDate,
                cover_URL: book.coverURL
            };
            thisClass.insertData('books', data, function(err, rows, fields){
                thisClass.addAuthors(book.isbn13, book.authors);
            });
        });
    },

    addRead: function(read, next){
        conn.query('INSERT INTO read_list (book_id, start_date, finishe_dated, rating, comment) values (?, ?, ?, ?)', read.isbn13, read.start_date, read.finished_date, read.rating, read.comment, function(err, rows, fields){
            if(!err){
                return
            } else{
                console.log('Error while adding read.'+err);
            }
        });
        next();
    },

    searchCategory: function(){

    },

    /**
    * @function searchPerson
    * @param type - This should be one of name_ko, name_eng, name_original, nationality.
    * @param keyword
    * @param callback
    */
    searchPerson: function(type, keyword, callback){
        conn.query('select * from people where '+type+' LIKE "%'+keyword+'%"', function(err, rows, fields){
            if(!err){
                callback(rows);
            } else{
                console.log('Error while performing Query.'+err);
            }
        });
    },

    searchSeries: function(){

    },

    searchBookByISBN: function(isbn, callback){
        var query = 'select * from books where isbn13 = ' + isbn;
        conn.query(query, function(err, rows, fields){
            if(!err){
                callback(rows[0]);
            } else{
                console.log('Error while performing Query.'+err);
            }
        });
    },

    /** Is there a book already?
    * @function isExistBook
    * @param isbn
    * @param trueCallback - Run this callback function when there is the book.
    * @param flaseCallback - Run this callback function when there isn't the book.
    */
    isExistBook: function(isbn, trueCallback, falseCallback){
        // run trueCallback when there is a book and falseCallback if not.
        var query = 'select count(*) from books where isbn13 = ' + isbn;
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

    searchBook: function(book){


    },

    searchRead: function(){

    }
};
