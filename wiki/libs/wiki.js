/**
 * Created by Le Reveur on 2017-05-01.
 */
function wiki(config){
    this.parser = require('./parser');
    this.parser = new this.parser();
    this.db = require('./db_controller');
    this.db = new this.db(config.db);
};

wiki.prototype.rawPage = function(title, callback){
    var thisClass = this;
    this.db.getPage(title, function(err, page){
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
    this.db.getPage(title, function(err, page){
        if(err){
            callback(err);
            return;
        }
        page.parsedContent = thisClass.parser.out(page.content, page.title);
        delete page.content;
        callback(null, page);
    });
};

wiki.prototype.createPage = function(data, callback){
    this.db.createPage(data, callback);
};

wiki.prototype.editPage = function(data, callback){
    this.db.editPage(data, callback);
};

wiki.prototype.deletePage = function(){

};

wiki.prototype.searchTitles = function(title, callback){
    this.db.searchTitles(title, callback);
};


module.exports = wiki;


