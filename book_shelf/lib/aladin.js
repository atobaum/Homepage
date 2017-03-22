var request = require('request');
var querystring = require('querystring');

/** @module aladin
* @author Hanjitori
* @param {object} config - configure object of aladin api.
* @version 20170322
*/
module.exports = function(config){
    this.TTBKey = config.TTBKey;
    this.host = 'http://www.aladin.co.kr/ttb/api/';

    /**
    * get book information.
    * @function bookInfo
    * @param {(string|int)} isbn
    * @param {function} callback - run after processing is finished with book info.
    * @property {object} book - book info.
    * @property {string} book.title
    * @property {string} book.subtitle
    * @property {string} book.page
    * @property {object[]} book.authors
    * @property {string} book.authors[].name
    * @property {string} book.authors[].type
    * @property {string} book.publisher
    * @property {string} book.publishedDate
    * @property {string} book.isbn13
    * @property {string} book.coverURL
    */
    this.bookInfo = function(isbn, callback){
        var queryOption = {
            output: 'js',
            ttbkey: this.TTBKey,
            itemIdType: "ISBN13",
            ItemId: isbn,
            Version: 20070901
        };

        var query = this.host + "ItemLookUp.aspx?";
        query += querystring.stringify(queryOption);
        request(query, function(error, res, body){
            if(!error && res.statusCode == 200){
                var item = JSON.parse(body.slice(0, -1).replace("\'", "\\")).item[0];
                // slice(0, -1) is for deleting ';' in the end of string. JSON.parse can't parse correctily if string has single quotes. So I used replace("\'", "\\"))
                //console.log("body: ", body);
                //console.log(item);
                var authors = [];
                for (var i in item.bookinfo.authors) {
                    var author = item.bookinfo.authors[i];
                    authors.push({
                        name: author.name,
                        type: author.authorType
                    });
                }

                var result = {
                    title: item.title,
                    sub_title: item.bookinfo.subTitle,
                    original_title: item.bookinfo.originalTitle,
                    authors: authors,
                    publisher: item.publisher,
                    published_date: item.pubDate,
                    isbn13: item.isbn13,
                    cover_URL: item.cover,
                    pages: item.bookinfo.itemPage,
                };
                callback(result);

            } else {
                callback({
                    error: error,
                    statusCode: statusCode
                });
            }
        });
    };

    /**
    * search books from aladin and arrange.
    * @function search
    * @param {string} keyword - search keyword.
    * @param {string} type - Keyword, Title, Author, Publisher
    * @param {function} callback - run callback(books) after query.
    * @property {object[]} books - book info.
    * @property {string} books[].title
    * @property {string} books[].author
    * @property {string} books[].publishedDate
    * @property {string} books[].isbn13
    * @property {string} books[].coverURL
    */
    this.search = function(keyword, type, callback){
        /*
        Search books from aladin and arrange
        type shoud be one of : Keyword, Title, Author, Publisher
        Using Keyword, you can search books by title and author both.

        return
        [
        {
            title,
            author,
            publishedDate,
            isbn13,
            coverURL
        }
        ]
        */

        var queryOption = {
            output: 'js',
            Version: '20131101',
            Cover: 'Small',
            MaxResults: 10,
            SearchTarget: 'All',
            ttbkey: this.TTBKey,
            QueryType: type,
            Query: keyword
        };


        var query = this.host + "ItemSearch.aspx?";
        query += querystring.stringify(queryOption);

        request(query, function(error, res, body){
            if(!error && res.statusCode == 200){
                var data = JSON.parse(body);
                var result = [];
                for (var i in data.item) {
                    var item = data.item[i];
                    if (item.mallType == "BOOK" || item.mallType == "FOREIGN") {
                        //if item is book, not DVD
                        result.push({
                            title: item.title,
                            author: item.author,
                            published_date: item.pubDate,
                            publisher: item.publisher,
                            isbn13: item.isbn13,
                            cover_URL: item.cover
                        });
                    }
                }
                callback(result);
            } else {
                console.log({
                    error: error,
                    statusCode: statusCode
                });
            }
        });
    };
};
