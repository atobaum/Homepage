/**
 * Created by Le Reveur on 2017-05-01.
 */
function wiki(config){
    this.parser = require('./parser');
    this.parser = new this.parser();
    this.db = require('./db_controller');
    this.db = new this.db(config.db, {wiki: this});
};

wiki.prototype.rawPage = function(title, callback){
    var thisClass = this;
    this.db.getRawPage(title, null, function(err, page){
        if(err){
            callback(err);
            return;
        }
        callback(null, page);
    });
};

wiki.prototype.parse = function(src){
    return this.parser.out(src);
};

wiki.prototype.viewPage = function(title, callback){
    var thisClass = this;
    this.db.getParsedPage(title, null, function(err, page){
        if(err){
            callback(err);
            return;
        }
        callback(null, page);
    });
};

wiki.prototype.editPage = function(data, callback){
    this.db.editPage(data, null, callback);
};

wiki.prototype.deletePage = function(title, callback){
    this.db.deletePage(title, null, callback)
};

module.exports = wiki;


