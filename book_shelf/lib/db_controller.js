var mysql = require('mysql');
var config = require('../config.js').dev.db;
var async = require('async');

var conn = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
}, function(err){
    console.log('Error occured while making connection with MySql server: ');
    console.log(err);
});

var env = 0; //0 for dev, 1 for

function log(msg){
    if(env===0){
        console.log(msg);
    }
}

function selectData(data, callback){

}

function generate_query_values(parameter){
    var q1 = "(";
    var q2 = " values (";
    var isLastString = 0;
    for (var key in parameter){
        if(parameter[key] == undefined){
            continue;
        }
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
            if(callback){
                callback(err, res);
                console.log('inserting data:');
                console.log(err);
                console.log(res);
                console.log();
            }
        });
    },

    addCaterory: function(name, callback){
        conn.query('INSERT INTO category (name) values (?)', name, function(err, res){
            if(err){
                console.log(err);
                callback(err);
            }
        });
    },

    editCategory: function(id, callback){

    },

    deleteCategory: function(id, callback){

    },

    addPerson: function(person, callback){
        this.insertData('people', person, function(err){
            callback(err);
        });
    },

    editPerson: function(id, person, callback){

    },

    deletePerson: function(id, callback){

    },

    addSeries: function(series, callback){

    },

    editSeries: function(id, callback){

    },

    deleteSeries: function(id, callback){

    },

    addAuthors: function(bookId, authors, callback){
        console.log('addAuthors');
        var thisClass = this;
        async.each(authors, function(author, callback){
            //refine author
            if (typeof(author.type) == "string"){
                if(author.type == "저자" || author.type == "author")
                    author.type = 1;
                else if(author.type == "옮김" || author.type == "translator")
                    author.type = 2;
                else if(author.type == "감수" || author.type == "supervisor")
                    author.type = 3;
                else if(author.type == "그림" || author.type == "illustrator")
                    author.type = 4;
                else {
                    callback(new Error("지원하지 않는 저자 타입: "+author.type));
                }
            }


            conn.query('SELECT * FROM people WHERE name_ko="'+author.name+'"', function(err, rows, fields){
                if(err){
                    callback(err); //failed to search athor.
                    return;
                }

                if(rows.length >= 1){ //is there's a author
                    thisClass.insertData('author_to_person', {book_id: bookId, person_id: rows[0].id, type_id: author.type}, function(err){
                        callback(err);  //failed to insert data into author_to_person
                    });
                } else { // if there's no person
                    thisClass.insertData('people', {name_ko: author.name}, function(err){
                        if(err){
                            callback(err);
                            return;
                        }

                        conn.query('SELECT * FROM people WHERE name_ko="'+author.name+'"', function(err, rows, fields){
                            if(err){
                                callback(err);
                                return;
                            }

                            if(rows.length >= 1){ //is there's a author
                                thisClass.insertData('author_to_person', {book_id: bookId, person_id: rows[0].id, type_id: author.type}, function(err){
                                    callback(err);
                                });
                            } else{ //no person.
                                callback(new Error('No person after adding person.'));
                            }
                        });
                    });
                }
            });
        }, function(err){ //callback for async.each
            if(callback){
                callback(err);
            }else{
                if(err){
                    console.log('Error occured when inserting in addAuthors: ');
                    console.error(err);
                }else{
                    console.log("Finished addAuthors");
                }
            }
        });
    },

    editAuthor: function(id, author, callback){

    },

    deleteAuthor: function(id, callback){

    },

    addBook: function(book, callback){
        console.log('addBook');
        console.log(book);
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

        async.waterfall([
            function(next){ //add publisher
                conn.query('SELECT * from publishers where name="'+book.publisher+'"', function(err, rows, fields){
                    if(err){
                        next(err);
                    } else{
                        if (rows.length >= 1){
                            next(err, rows[0].id); //rows[0].id is the publisherId;
                        }else{ //If there's no such publisher
                            thisClass.insertData('publishers', {name: book.publisher}, function(err, result){
                                if(err){
                                    if(callback) callback(err);
                                    else console.log('Error while adding book.'+err);
                                }else{ //publisher addded
                                    next(err, result.insertId); //result.insertID is the publisher id.
                                }
                            });
                        }
                    }
                });
            },
            function(publisherId, next){
                //inserting book info
                var data = {
                    isbn13: book.isbn13,
                    title_ko: book.title,
                    title_original: book.original_title,
                    subtitle: book.sub_title,
                    pages: book.pages,
                    publisher_id: publisherId,
                    published_date: book.published_date,
                    cover_URL: book.cover_URL
                };
                conn.beginTransaction(function(err){
                    thisClass.insertData('books', data, function(err, result){
                        if(err) {
                            conn.rollback(function (rollerr) {
                                if(rollerr) next(rollerr);
                                else next(err);
                            });
                            return;
                        }
                        thisClass.addAuthors(book.isbn13, book.authors, function(err){
                            if(err) {
                                conn.rollback(function (rollerr) {
                                    if(rollerr) next(rollerr);
                                    else next(err);
                                });
                            }
                            conn.commit(function (err) {
                                if(err) {
                                    conn.rollback(function (rollerr) {
                                        if(rollerr) next(rollerr);
                                        else next(err);
                                    });
                                }
                            });
                        });
                    });
                });
            }
        ], function(err, result){
            if(callback) callback(err);
            else console.log(err);
        });
    },

    editBook: function(isbn13, book, callback){

    },

    deleteBook: function(isbn13, callback){

    },

    addRead: function(read, callback){
        log('addRead');
        log(read);
        read.book_id = read.isbn13;
        delete read.isbn13;
        this.insertData('readings', read, function(err, res){
            if(callback){
                callback(err, res);
            }
        });
    },

    editRead: function(id, read, callback){

    },

    deleteRead: function(id, read, callback){

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
        log('searchPerson');
        conn.query('select * from people where '+type+' LIKE "%'+keyword+'%"', function(err, rows, fields){
            if(!err){
                if(callback)
                    callback(err, rows);
            } else{
                console.log('Error while performing Query.'+err);
                callback(err);
            }
        });
    },

    searchSeries: function(){

    },

    searchBook: function(type, keyword, callback){
        var query = 'select * from books where isbn13 = ' + isbn;
        conn.query(query, function(err, rows, fields){
            if(!err){
                if(callback)
                    callback(err, rows[0]);
                else {
                    console.log("No callback function in searchBookByISBN");
                }
            } else{
                console.log('Error while performing Query.'+err);
                callback(err);
            }
        });
    },

    /**
    * data is JSON of paires.
    */
    searchRead: function(data, callback){
        var query = 'SELECT * FROM readings JOIN books ON books.isbn13 = readings.book_id JOIN publishers ON publishers.id = books.publisher_id LIMIT  10, '+data.page;
        conn.query(quert, function(err, rows){
            for(var i in rows){

            }
        });
    },

    searchAuthorsForBooks: function(books, callback){
        console.log(books);
        var thisClass = this;
        async.map(books, function(book, callback){//mapping fuction
            var query = 'SELECT people.name_ko, people.name_eng, author_type.name_ko, author_type.name_en FROM author_to_person JOIN people ON people.id = author_to_person.person_id JOIN author_type ON author_type.id = author_to_person.type_id WHERE book_id = '+book.isbn13;
            conn.query(query, function(err, rows, fields){
                if(err)
                    callback(err);
                else{
                    book.authors = rows;
                    callback(err, book);
                }
            });
        }, function(err, results){
            if(callback){
                callback(err, results);
            } else {
                console.log('searchAuthorsForBooks');
                if(err){
                    console.error(err);
                    return;
                }
                console.log(results);
                console.log();
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
        log('isExistBook');
        // run trueCallback when there is a book and falseCallback if not.
        var query = 'select count(*) from books where isbn13 = ' + isbn;
        conn.query(query, function(err, rows, fields){
            if(!err){
                if(rows[0]['count(*)'] == 0)
                    falseCallback(err, isbn);
                else
                    trueCallback(err, isbn);
            } else{
                console.log('Error while performing Query.'+err);
            }
        });
    }
};
