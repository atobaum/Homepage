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
    this.parseAuthors = function(strAuthors){
        var result = [];
        var authors = strAuthors.split(', ');
        var typeRegex = /(?:\s)(\S+?)$/;
        authors.forEach(function(strAuthor){
            var type = typeRegex.exec(strAuthor)[1];
            var names = strAuthor.substr(0, strAuthor.length - type.length - 1).split('.');
            switch(type){
                case '지음':
                    type = 'author';
                    break;
                case '옮김':
                    type = 'translator';
                    break;
                case '감수':
                    type = 'supervisor';
                    break;
                case '사진':
                    type = 'photo';
                    break;
                case '그림':
                    type = 'illustrator';
                    break;
            }
            for(var i in names){
                result.push({name: names[i], type: type});
            }
        });
        return result;
    };

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
        var thisClass = this;
        var queryOption = {
            output: 'js',
            ttbkey: this.TTBKey,
            itemIdType: "ISBN13",
            ItemId: isbn,
            Version: 20131101
        };

        var query = this.host + "ItemLookUp.aspx?";
        query += querystring.stringify(queryOption);
        request(query, function(error, res, body){
            if(!error && res.statusCode == 200){
                var item = JSON.parse(body);
                if(item.errorCode){
                    callback(new Error(item.errorMessage));
                    return;
                }
                item = item.item[0];
                var result = {
                    title: item.title,
                    publisher: item.publisher,
                    published_date: item.pubDate,
                    isbn13: item.isbn13,
                    cover_URL: item.cover,
                    authors: thisClass.parseAuthors(item.author)
                };

                if(item.subInfo) {
                    result.subtitle = item.subInfo.subTitle;
                    result.original_title = item.subInfo.originalTitle;
                    result.pages = item.subInfo.itemPage;
                }
                callback(null, result);
            } else {
                callback(error);
            }
        });
    };

    /**
    * search books from aladin and arrange.
    * @function search
    * @param {string} type - It could be one of Keyword, Title, Author, Publisher
    * @param {string} keyword - search keyword.
    * @param {function} callback - run callback(books) after query.
    * @property {object[]} books - book info.
    * @property {string} books[].title
    * @property {string} books[].author
    * @property {string} books[].publishedDate
    * @property {string} books[].isbn13
    * @property {string} books[].coverURL
    */
    this.search = function(type, keyword, callback){
        var queryOption = {
            output: 'js',
            Version: '20131101',
            Cover: 'Small',
            MaxResults: 10,
            SearchTarget: 'Book',
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
                callback(null, result);
            } else {
                callback(error);
            }
        });
    };
};
