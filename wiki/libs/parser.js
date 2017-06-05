/**
 * Created by Le Reveur on 2017-04-24.
 */

var Lexer = require('./lexer');
var InlineParser = require('./inline_parser');
var Renderer = require('./renderer');

function Parser(){
    this.additional = {};
    this.initAdditional();
    this.renderer = new Renderer();
    this.inlineParser = new InlineParser(this);
    this.lexer = new Lexer(this);
}

Parser.prototype.initAdditional = function(){
    this.additional.footnotes = [];
    this.additional.cat = [];
    this.additional.toc = {curLevel: [], toks: []};
};

Parser.prototype.reloadRenderer = function(){
    this.renderer = new Renderer();
    this.inlineParser = new InlineParser(this.renderer);
};

Parser.prototype.parseList = function(toks){
    var list = [],
        curOrdered = toks[0].ordered,
        curLevel = toks[0].level;

    while(toks[0] && toks[0].type == 'list' && (toks[0].level == curLevel) && (toks[0].ordered == curOrdered)){
        var tok = toks.shift();
        if(toks[0] && toks[0].type == 'list' && toks[0].level > curLevel)
            tok.child = this.parseList(toks);
        list.push(tok);
    }
    return list;
};

Parser.prototype.parseHeadings = function(toks){
    if(toks.length == 0)
        return [];
    var list = [],
        curOrdered = toks[0].ordered,
        curLevel = toks[0].level;

    while(toks[0] && (toks[0].level == curLevel)){
        var tok = toks.shift();
        if(toks[0] && toks[0].level > curLevel)
            tok.child = this.parseHeadings(toks);
        list.push(tok);
    }
    return list;
};

Parser.prototype.parseTable = function(toks){
    var tables = [];
    while (toks[0] && toks[0].type == 'table'){
        tables.push(toks.shift());
    }
    return tables;
};

Parser.prototype.macro = function(tok){
    "use strict";
    switch (tok.macro.toLowerCase()){
        case('syntax'):
            return this.renderer.syntax(tok);
            break;
    }
};

Parser.prototype.parseQuote = function(toks){
    "use strict";
    var text = toks.shift().text;
    while (toks[0] && toks[0].type == 'quote'){
        text += ' '+toks.shift().text;
    }
    return text;
};

Parser.prototype.out = function(src, title){
    var content = '';
    this.initAdditional();
    var toks = this.lexer.scan(src);
    var preType = ''; //type of previous token.
    while (tok = toks[0]){
        switch(tok.type){
            case 'heading':
                content += this.renderer.heading(toks.shift());
                break;
            case 'list':
                content += this.renderer.list(this.parseList(toks));
                break;
            case 'table':
                content += this.renderer.table(this.parseTable(toks));
                break;
            case 'macro':
                content += this.macro(toks.shift());
                break;
            case 'quote':
                content += this.renderer.blockquote(this.parseQuote(toks));
                break;
            default:
                if(this.renderer[tok.type])
                    content += this.renderer[tok.type](toks.shift());
                else{
                    content += this.renderer.error({name: "Unsupported Token", text: "Token type is unsupported: "+tok.type});
                    return content;
                }
                break;
        }
        preType = tok.type;
    }
    content += '<br>'+this.renderer.footnotes(this.additional.footnotes);
    content = (this.additional.toc.toks.length == 0 ? '' : this.renderer.toc(this.parseHeadings(this.additional.toc.toks))) + content + (this.additional.cat.length != 0 ? this.renderer.cat(this.additional.cat) : '');
    return content;
};

Parser.prototype.addCat = function(title){
    this.additional.cat.push(title);
};

module.exports = Parser;
