var mysql = require('mysql');
var async = require('async');

function generate_query_values(parameter){
    var q1 = "(";
    var q2 = " values (";
    var isLastString = 0;
    for (var key in parameter){
        if(parameter[key] === undefined){
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

function generate_update_query_values(parameter){
    var q = "";
    for (var key in parameter){
        if(parameter[key] === undefined){
            continue;
        }
        q += key + '=';
        if(typeof(parameter[key]) == "string"){
            q += '"'+parameter[key]+'", ';
        }
        else {
            q += parameter[key]+', ';
        }
    }
    q = q.substring(0, q.length - 2);
    return q;
}

function formatAuthors(authors){
    var author = '';
    for(var i in authors){
        var aut = authors[i];
        switch(aut.type){
            case "author":
                author += aut.name + " 지음, ";
                break;
            case "translator":
                author += aut.name + " 번역, ";
                break;
            case "supervisor":
                author += aut.name + " 감수, ";
                break;
            case "illustrator":
                author += aut.name + " 그림, ";
                break;
        }
    }
    author =  author.substring(0, author.length-2) + '.';
    return author;
}

/**
* @module db_controller
* @todo write addPerson, addSeries, addTitle, searchCategory, searchSeries, searchTitle, searchRead
*/
 var dbController = function(config){
    this.conn = mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      dateStrings: 'date'
    }, function(err){
        console.log('Error occured while making connection with MySql server: ');
        console.log(err);
    });
};

dbController.prototype.insertData = function (table, data, callback){
    /*
    data:
    {
        a:1,
        b:2
    }

    insert into table (a, b) values (1, 2)
    */
     this.conn.query('INSERT INTO '+table+' '+generate_query_values(data), function(err, res, fields){
        if(callback){
            callback(err, res);
            console.log('inserting data:' + 'INSERT INTO '+table+' '+generate_query_values(data));
            console.log('error: '+err);
            console.log(res);
            console.log();
        }
    });
};


dbController.prototype.addCaterory = function(name, callback){
     this.conn.query('INSERT INTO category (name) values (?)', name, function(err, res){
        if(err){
            console.log(err);
            callback(err);
        }
    });
};

dbController.prototype.editCategory = function(id, callback){

};

dbController.prototype.deleteCategory = function(id, callback){

};

dbController.prototype.addPerson = function(person, callback){
    this.insertData('people', person, function(err){
        callback(err);
    });
};

dbController.prototype.editPerson = function(id, person, callback){

};

dbController.prototype.eletePerson = function(id, callback){

};

dbController.prototype.addSeries = function(series, callback){

};

dbController.prototype.editSeries = function(id, callback){

};

dbController.prototype.deleteSeries = function(id, callback){

};

dbController.prototype.addAuthors = function(bookId, authors, callback){
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


         thisClass.conn.query('SELECT * FROM people WHERE name_ko="'+author.name+'"', function(err, rows, fields){
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

                     thisClass.conn.query('SELECT * FROM people WHERE name_ko="'+author.name+'"', function(err, rows, fields){
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
};

dbController.prototype.editAuthor = function(id, author, callback){

};

dbController.prototype.deleteAuthor = function(id, callback){

};

dbController.prototype.addBook = function(book, callback){
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
             thisClass.conn.query('SELECT * from publishers where name="'+book.publisher+'"', function(err, rows, fields){
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
             thisClass.conn.beginTransaction(function(err){
                if(err) {
                    next(err);
                    return;
                }
                thisClass.insertData('books', data, function(err, result){
                    if(err) {
                         thisClass.conn.rollback(function (rollerr) {
                            if(rollerr) next(rollerr);
                            else next(err);
                        });
                        return;
                    }
                    thisClass.addAuthors(book.isbn13, book.authors, function(err){
                        if(err) {
                             thisClass.conn.rollback(function (rollerr) {
                                if(rollerr) next(rollerr);
                                else next(err);
                            });
                        }
                         thisClass.conn.commit(function (err) {
                            if(err) {
                                 thisClass.conn.rollback(function (rollerr) {
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
};

dbController.prototype.editBook = function(isbn13, book, callback){

};

dbController.prototype.deleteBook = function(isbn13, callback){
    var thisClass = this;
     thisClass.conn.beginTransaction(function(err){
        if(err) callback(err);
        else{
             thisClass.conn.query('DELETE FROM books where isbn13 = '+isbn13, function(err){
                if(err){
                     thisClass.conn.rollback(function(rollerr){
                        if(rollerr) callback(rollerr);
                        else callback(err);
                    });
                } else {
                     thisClass.conn.query('DELETE FROM author_to_person WHERE book_id = '+isbn13, function(err){
                        if(err){
                             thisClass.conn.rollback(function(rollerr){
                                if(rollerr) callback(rollerr);
                                else callback(err);
                            });
                        } else {
                             thisClass.conn.commit(function(err){
                                if(err){
                                     thisClass.conn.rollback(function(rollerr){
                                        if(rollerr) callback(rollerr);
                                        else callback(err);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

dbController.prototype.addRead = function(read, callback){
    console.log('addRead');
    console.log(read);
    read.book_id = read.isbn13;
    delete read.isbn13;
    this.insertData('readings', read, function(err, res){
        if(callback){
            callback(err, res);
        }
    });
};

dbController.prototype.addReading = function(read, callback){
    console.log('addRead');
    console.log(read);
    read.book_id = read.isbn13;
    delete read.isbn13;
    this.insertData('readings', read, function(err, res){
        if(callback){
            callback(err, res);
        }
    });
};

dbController.prototype.editReading = function(reading, callback){
    var id = reading.id;
    if(reading.date_finished.length === 0){
        delete reading.date_finished;
    }
    delete reading.id;
    var query = 'UPDATE readings SET '+generate_update_query_values(reading)+' WHERE id = '+id;
     this.conn.query(query, function(err, rows){
        if(err){
            callback(err);
        } else{
            if(rows.affectedRows === 0){
                callback(new Error('해당하는 책이 없다.:' + id));
            } else
                callback(null, rows);
        }
    });
};

dbController.prototype.deleteReading = function(read, callback){
    var id = read.id;
    delete read.id;

    var query = 'UPDATE readings SET '+generate_update_query_values(read)+' WHERE id = '+id;
     this.conn.query(query, function(err, rows, fields){
        callback(err, rows);
    });
};

dbController.prototype.searchCategory = function(){

};

/**
* @function searchPerson
* @param type - This should be one of name_ko, name_eng, name_original, nationality.
* @param keyword
* @param callback
*/
dbController.prototype.searchPerson = function(type, keyword, callback){
    console.log('searchPerson');
     this.conn.query('select * from people where '+type+' LIKE "%'+keyword+'%"', function(err, rows, fields){
        if(!err){
            if(callback)
                callback(err, rows);
        } else{
            console.log('Error while performing Query.'+err);
            callback(err);
        }
    });
};

dbController.prototype.searchSeries = function(){

};

/**
* @function bookInfo
* @param isbn13
# @param callback - A callback which is called when processing  has finished, or an error occurs. Results is an Object of the  book with publisher and authors. Invoked with (err, book).
*/
dbController.prototype.bookInfo = function(isbn13, callback){
    var thisClass = this;
    var query = 'select books.title_ko, books.subtitle, publishers.name, books.published_date, books.pages, books.title_original, books.language, books.description, books.link,  books.cover_URL, books.isbn13, books.checked from books JOIN publishers ON publishers.id = books.publisher_id where books.isbn13 = ' + isbn13;
     thisClass.conn.query(query, function(err, rows, fields){
        if(!err){
            if(rows.length === 0){
                callback(new Error("There's no such book."));
                return;
            }
            thisClass.searchAuthorsForBook(rows[0], function(err, book){
                if(err){
                    callback(err);
                    return;
                }
                book.publisher = book.name;
                delete book.name;
                book.formatted_authors = formatAuthors(book.authors);
                callback(err, book);
            });
        } else{
            console.log('Error while performing Query.'+err);
            callback(err);
        }
    });
};

//
dbController.prototype.searchBook = function(type, keyword, callback){

};

/**
* @function searchReading
* @param data -
* @param callback
*/
dbController.prototype.searchReading = function(data, callback){
    var thisClass = this;
    var query = 'SELECT * FROM readings LIMIT '+(data.page-1) * 10 + ', 10';
     thisClass.conn.query(query, function(err, rows){
        if(err){
            callback(err);
            return;
        }
        if(rows.length === 0){
            callback(err, rows);
            return;
        }
        async.map(rows, function(reading, callback){
            thisClass.bookInfo(reading.book_id, function(err, book){
                if(err) {
                    callback(err);
                }else{
                    reading.book = book;
                    delete reading.book_id;
                    callback(err, reading);
                }
            });
        }, function(err, result){
            callback(err, result);
        });
    });
};

dbController.prototype.readingInfo = function(id, callback){
    var thisClass = this;
    var query = 'SELECT * FROM readings WHERE id = '+id;
     thisClass.conn.query(query, function(err, rows){
        if(err){
            callback(err);
        } else if(rows.length === 0){
            callback(new Error('잘못된 id:' + id));
        } else {
            var reading = rows[0];
            thisClass.bookInfo(reading.book_id, function(err, book){
                if(err){
                    callback(err);
                } else{
                    reading.book = book;
                    delete reading.book_id;
                    callback(null, reading);
                }
            });
        }
    });
};

/*
get books returns books with authors info
* @param callback: Invoked with (err, book)
*/
dbController.prototype.searchAuthorsForBook = function(book, callback){
    var thisClass = this;
    var query = 'SELECT people.name_ko as name, author_type.name_en as type FROM author_to_person JOIN people ON people.id = author_to_person.person_id JOIN author_type ON author_type.id = author_to_person.type_id WHERE book_id = '+book.isbn13;
     thisClass.conn.query(query, function(err, rows, fields){
        if(err)
            callback(err);
        else{
            book.authors = rows;
            callback(err, book);
        }
    });
};

/** Is there a book already?
* @function isExistBook
* @param isbn
* @param trueCallback - Run this callback function when there is the book.
* @param flaseCallback - Run this callback function when there isn't the book.
*/
dbController.prototype.isExistBook = function(isbn, trueCallback, falseCallback){
    console.log('isExistBook');
    // run trueCallback when there is a book and falseCallback if not.
    var query = 'select count(*) from books where isbn13 = ' + isbn;
     this.conn.query(query, function(err, rows, fields){
        if(!err){
            if(rows[0]['count(*)'] === 0)
                falseCallback(err, isbn);
            else
                trueCallback(err, isbn);
        } else{
            trueCallback(err);
        }
    });
};

module.exports = dbController;
