"use strict";
let mysql = require('mysql');
let async = require('async');

function formatAuthors(authors){
    let strAuthor = '';
    for(let author of authors){
        switch(author.type){
            case "author":
                strAuthor += author.name + " 지음, ";
                break;
            case "translator":
                strAuthor += author.name + " 번역, ";
                break;
            case "supervisor":
                strAuthor += author.name + " 감수, ";
                break;
            case "illustrator":
                strAuthor += author.name + " 그림, ";
                break;
        }
    }
    strAuthor =  strAuthor.substring(0, strAuthor.length-2) + '.';
    return strAuthor;
}

/**
 * @module db_controller
 * @todo write addPerson, addSeries, addTitle, searchCategory, searchSeries, searchTitle, searchRead
 */
let dbController = function(config){
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

dbController.prototype.addCaterory = function(name, callback){
    this.conn.query('INSERT INTO category (name) values (?)', name, function(err, res){
        callback(err);
    });
};

dbController.prototype.editCategory = function(id, callback){

};

dbController.prototype.deleteCategory = function(id, callback){

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
    let thisClass = this;
    async.each(authors, function(author, callback){
        //refine author
        if (typeof(author.type) === "string"){
            switch(author.type){
                case '저자':
                case 'author':
                    author.type = 1;
                    break;
                case '옮김':
                case 'translator':
                    author.type = 2;
                    break;
                case '감수':
                case 'supervisor':
                    author.type = 3;
                    break;
                case '그림':
                case 'illustrator':
                    author.type = 4;
                    break;
                case '사진':
                case 'photo':
                    author.type = 5;
                    break;
                case '엮음':
                case 'editor':
                    author.type = 6;
                    break;
                default:
                    callback(new Error("지원하지 않는 저자 타입: "+author.type));
                    return;
            }
        }

        async.waterfall([
            (next) => {
                thisClass.conn.query('INSERT INTO people (name_ko) VALUES (?)', [author.name], (err, result) => {
                    if(err && err.code === 'ER_DUP_ENTRY'){
                        next(null, null);
                    } else {next(err, (result ? result.insertId : null));}
                });
            },
            (person_id, next) => {
                if(person_id) next(null, person_id);
                else {
                    thisClass.conn.query('SELECT * FROM people WHERE name_ko=?', [author.name], (err, rows) => {
                        next(err, (rows ? rows[0].id : null));
                    });
                }
            },
            (person_id, next) => {
                let query = 'INSERT INTO author_to_person (book_id, person_id, type_id) VALUES (?, ?, ?)';
                thisClass.conn.query(query, [bookId, person_id, author.type], (err) => {
                    next(err);
                });
            }
        ], callback);
    }, function(err){ //callback for async.each
        if(callback){
            callback(err);
        }else{
            if(err){
                console.log('Error occured when inserting in addAuthors: ');
                console.error(err);
            }
        }
    });
};

dbController.prototype.editAuthor = function(id, author, callback){

};

dbController.prototype.deleteAuthor = function(id, callback){

};

dbController.prototype.addBook = function(book, callback){
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
    let thisClass = this;
    async.waterfall([
        (next) => {
            thisClass.conn.beginTransaction((err) => {next(err);});
        },
        (next) => { //add publisher
            thisClass.conn.query('INSERT INTO publishers SET name=?', [book.publisher], function(err, result){
                if(err && err.code === 'ER_DUP_ENTRY'){
                    next(null, null);
                } else {next(err, (result ? result.insertId : null));}
            });
        },
        (publisher_id, next) => { //get publisher id
            if(publisher_id) next(null, publisher_id);
            else{
                thisClass.conn.query('SELECT id FROM publishers WHERE name=?', [book.publisher], (err, rows) => {
                    if(err) next(err);
                    else next(null, rows[0].id);
                });
            }
        },
        (publisherId, next) => { //inserting book info
            let data = {
                isbn13: book.isbn13,
                title_ko: book.title,
                title_original: book.original_title,
                subtitle: book.sub_title,
                pages: book.pages,
                publisher_id: publisherId,
                published_date: book.published_date,
                cover_URL: book.cover_URL
            };
            thisClass.conn.query('INSERT INTO books SET ?', [data], function(err){
                if(err && err.code === 'ER_DUP_ENTRY') {
                    next(null, false);
                } else next(err, true)
            });
        },
        (newBook, next) => { //addAuthors
            if(newBook)
                thisClass.addAuthors(book.isbn13, book.authors, next);
            else next(null);
        }
    ], function(err){
        if(err) {
            thisClass.conn.rollback(function (rollerr) {
                if(rollerr) callback(rollerr);
                else callback(err);
            });
        } else{
            thisClass.conn.commit(function (comerr) {
                if(comerr) {
                    thisClass.conn.rollback(function (rollerr) {
                        if(rollerr) callback(rollerr);
                        else callback(comerr);
                    });
                }else{
                    callback();
                }
            });
        }
    });
};

dbController.prototype.editBook = function(isbn13, book, callback){

};

dbController.prototype.deleteBook = function(isbn13, callback){
    this.conn.query('DELETE FROM books where isbn13 = '+isbn13, callback);
};

dbController.prototype.addReading = function(reading, callback){
    let thisClass = this;
    if(reading.date_finished.length === 0) delete reading.date_finished;
    if(reading.comment.length === 0) delete reading.comment;
    let book = reading.book;
    async.series([
        (next) => {
            thisClass.addBook(book, next);
        },
        (next) => {
            let data = {
                date_started: reading.date_started,
                date_finished: reading.date_finished,
                book_id: reading.book.isbn13,
                rating: reading.rating,
                comment: reading.comment,
                link: reading.link,
                user_id: reading.user_id,
                user: reading.user,
                is_secret: reading.is_secret,
                password: reading.password
            };
            thisClass.conn.query('INSERT INTO readings SET ?', [data], next);
        }
    ], callback);
};

dbController.prototype.editReading = function(reading, callback){
    let data = {
        date_started: reading.date_started,
        date_finished: (reading.date_finished.length ? reading.date_finished: null),
        rating: reading.rating,
        comment: reading.comment,
        link: reading.link,
        is_secret: reading.is_secret
    };
    let id = reading.id;
    let query = 'UPDATE readings SET ? WHERE id = ? AND (user_id=? OR password = ?)';
    this.conn.query(query, [data, id, reading.user_id, reading.password], function(err, rows){
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

dbController.prototype.deleteReading = function(reading, callback){
    let thisClass = this;
    this.conn.query('SELECT * FROM readings WHERE id = ?', [reading.id], function(err, rows){
        if(err){
            callback(err);
        } else if(rows[0].password != reading.password){
            let error = new Error("Wrong Password");
            error.name = "WrongPasswordError";
            callback(error);
        } else{
            thisClass.conn.query('UPDATE readings SET deleted = 1 WHERE id = ?', [reading.id], function(err, rows){
                callback(err, rows);
            });
        }
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
    this.conn.query('select * from people where '+type+' LIKE "'+keyword+'%"', function(err, rows){
        if(!err){
            if(callback)
                callback(err, rows);
        } else{
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
 * @param callback
 */
dbController.prototype.bookInfo = function(isbn13, callback){
    let thisClass = this;
    let query = 'select books.title_ko, books.subtitle, publishers.name, books.published_date, books.pages, books.title_original, books.language, books.description, books.link,  books.cover_URL, books.isbn13, books.checked from books JOIN publishers ON publishers.id = books.publisher_id where books.isbn13 = ' + isbn13;
    thisClass.conn.query(query, function(err, rows){
        if(!err){
            if(rows.length === 0){
                let error = new Error("There's no such book.");
                error.name = "NoBookError";
                callback(error);
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
    let thisClass = this;
    let articlePerPage = 10;
    let query = '';
    if(data.type === 'recent'){
        query = 'SELECT * FROM readings WHERE deleted = 0 ORDER BY date_started DESC LIMIT '+(data.page-1) * articlePerPage + ', '+articlePerPage;
    }
    async.parallel([
        (next) => {
            thisClass.conn.query(query, function(err, rows){
                if(err || rows.length === 0) {
                    next(err);
                    return;
                }
                async.map(rows, function(reading, callback){
                    thisClass.bookInfo(reading.book_id, function(err, book){
                        if(err) {
                            if(err.name === "NoBookError"){
                                callback(null, reading);
                            }
                            else {
                                callback(err);
                            }
                        }else{
                            reading.book = book;
                            delete reading.book_id;
                            callback(err, reading);
                        }
                    });
                }, next);
            });
        },
        (next) => {
            thisClass.conn.query('SELECT count(*) FROM readings', function(err, rows){
                if(err) {
                    next(err);
                    return;
                }
                let numOfReadings = parseInt( rows[0]['count(*)']);
                next(null, Math.ceil(numOfReadings / articlePerPage));
            });
        }
    ], (err, results) => {
        callback(err, (!err ? {readings: results[0], maxPage: results[1]} : null));
    });
};

dbController.prototype.readingInfo = function (bookId, userId, callback){
    let thisClass = this;
    let query = 'SELECT * FROM readings WHERE id = '+bookId;
    thisClass.conn.query(query, function(err, rows){
        if(err){
            callback(err);
        } else if(rows.length === 0){
            callback(new Error('잘못된 id:' + bookId));
        } else {
            let reading = rows[0];
            if(reading.deleted == 1){
                callback(new Error('DELETED_DATA'));
                return;
            }
            if(reading.is_secret && reading.user_id !== userId){
                delete reading.comment;
                reading.hideComment = true;
            }
            delete reading.password;
            thisClass.bookInfo(reading.book_id, function(err, book){
                if(err && err.name === "NoBookError"){
                    callback(null, reading);
                }else if(err){
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
    let thisClass = this;
    let query = 'SELECT people.id, people.name_ko as name, author_type.name_en as type FROM author_to_person JOIN people ON people.id = author_to_person.person_id JOIN author_type ON author_type.id = author_to_person.type_id WHERE book_id = '+book.isbn13;
    thisClass.conn.query(query, function(err, rows){
        if(err)
            callback(err);
        else{
            book.authors = rows;
            callback(err, book);
        }
    });
};

dbController.prototype.getSecretComment = function (readingId, userId, passwd, callback){
    let query = "SELECT comment, user_id, password FROM readings WHERE id=?";
    this.conn.query(query, [readingId], (err, rows) => {
        if(err){
            callback(err);
        } else if(rows.length === 0) {
            let error = new Error('Wrong reading id: '+readingId);
            error.name="WrongReadingId";
            callback(error);
        }else if(rows[0].user_id === userId || rows[0].password == passwd){
            callback(null, rows[0].comment);
        } else{
            let error = new Error('Wrong password');
            error.name="WrongPasswordError";
            callback(error);
        }
    });
};

dbController.prototype.backup = function(dest, callback){
    let mysqlDump = require('mysqldump');
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
