/*var config = require('./config.js').dev;
var aladin = require('./lib/aladin.js');
aladin = new aladin(config.api.aladin);

aladin.search('죽은자', "Keyword", console.log);
aladin.bookInfo(9788938202581, console.log);
*/

var config = require('./config.js').dev;
var knex = require('knex')({
    client: 'mysql'});
var dbController = require('./lib/db_controller.js');
var aladin = require('./lib/aladin.js');
aladin = new aladin(config.api.aladin)
//dbController.isExistBook('1234567890123', console.log, function(){console.log(false);});
//dbController.searchPerson("name_ko", "훈", console.log);
var test_book = {
    title: '한글 가나다',
    subTitle: '',
    originalTitle: '',
    page: 123,
    authors: [
                {
                    name:'한국어',
                    type:'author'
                },
                {
                    name:'간고쿠고',
                    type: 'translator'
                }
            ],
    publisher:'중국어',
    publishedDate:'1994-05-23',
    isbn13:'1234325473879',
    coverURL:'www'
};

//dbController.addBook(test_book);
//dbController.addAuthors('0123456789123', test_book.authors);
aladin.bookInfo('9788950969103', console.log);
