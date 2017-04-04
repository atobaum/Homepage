var mysql = require('mysql');
var config = require('../config.js').dev.db;

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
        log('insertData');
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
                if(callback)
                    callback(err, res);
                else {
                    console.log("No callback funcion in a function: 'insertData'");
                }
            }else{
                console.log('Error while inserting data: '+JSON.stringify(data)+'to table: '+table+'. '+err);
                callback(err);
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
        log('addAuthors');
        if(authors.length == 0){
            if(callback)
                callback();
            else {
                console.log("No callback function in addAuthors");
            }
            return;
        }

        var thisClass = this;
        var author = authors.pop();
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
                //throw new Error("지원하지 않는 저자 타입: "+author.type);
            }
        }
        conn.query('SELECT * FROM people WHERE name_ko="'+author.name+'"', function(err, rows, fields){
            if(err)
                callback(err);
            if(rows.length >= 1){
                thisClass.insertData('author_to_person', {book_id: bookId, person_id: rows[0].id, type_id: author.type}, function(){
                    return thisClass.addAuthors(bookId, authors);
                });
                thisClass.addAuthors(bookId, authors, callback);
                callback(err);
            }else{
                thisClass.insertData('people', {name_ko: author.name}, function(){
                    authors.push(author);
                    thisClass.addAuthors(bookId, authors, callback);
                    callback(err);
                });
            }
        });
    },

    editAuthor: function(id, author, callback){

    },

    deleteAuthor: function(id, callback){

    },

    addBook: function(book, callback){
        log('addBook');
        log(book);
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
        conn.query('SELECT * from publishers where name="'+book.publisher+'"', function(err, rows, fields){
            //getting publisher id
            var publisherId;
            if (rows.length >= 1){
                publisherId = rows[0].id;
            }else{ //If there's no such book
                conn.query('INSERT INTO publishers (name) values (?)', book.publisher, function(err, rows, fields){
                    if(!err)
                        thisClass.addBook(book, callback);
                    else {
                        console.log('Error while adding read.'+err);
                        callback(err);
                    }
                });
            }

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
                try{
                    thisClass.insertData('books', data, function(err, rows, fields){
                        thisClass.addAuthors(book.isbn13, book.authors, callback);
                        conn.commit(function (err) {
                            if (err) {
                                callback(err);
                                console.error(err);
                                conn.rollback(function (err) {
                                       console.error('rollback error');
                                       throw err;
                                    });
                            }
                         });
                    });
                } catch (e){
                    connection.rollback(function () {
                        callback(e);
                        console.error('rollback error');
                        throw e;
                    });
                }
            });
        });
        if(callback)
            callback(err);
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
        if(books.length == 0){
            return [];
        }
        var thisClass = this;
        var book = books[0];
        books.shift();
        console.log(books);

        var query = 'SELECT people.name_ko, people.name_eng, author_type.name_ko, author_type.name_en FROM author_to_person JOIN people ON people.id = author_to_person.person_id JOIN author_type ON author_type.id = author_to_person.type_id WHERE book_id = '+book.isbn13;
        conn.query(query, function(err, rows, fields){
            if(err)
                callback(err);
            book.author = rows;
            console.log(book);
            console.log();
            return thisClass.searchAuthorsForBooks(books).push(book);
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
