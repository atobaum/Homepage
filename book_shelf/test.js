/*var config = require('./config.js').dev;
var aladin = require('./lib/aladin.js');
aladin = new aladin(config.api.aladin);

aladin.search('죽은자', "Keyword", console.log);
aladin.bookInfo(9788938202581, console.log);
*/

var config = require('./config.js').dev.db;
var knex = require('knex')({
    client: 'mysql'});
var dbController = require('./lib/db_controller.js');

dbController.isExistBook('1234567890123', function(){console.log(true);}, function(){console.log(false);});
