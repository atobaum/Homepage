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
    this.inlineParser = new InlineParser(this.renderer, this.additional);
    this.lexer = new Lexer(this.additional, this.inlineParser);
}

Parser.prototype.initAdditional = function(){
    this.additional.footnotes = [];
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

Parser.prototype.out = function(src, title){
    var content = '';
    this.initAdditional();
    var toks = this.lexer.scan(src);
    var preType = ''; //type of previous token.
    while (tok = toks[0]){
        //if(tok.text) tok.text = this.inlineParser.out(tok.text);
        switch(tok.type){
            case 'heading':
                content += this.renderer.heading(toks.shift());
                break;
            case 'list':
                content += this.renderer.list(this.parseList(toks));
                break;
            default:
                if(this.renderer[tok.type])
                    content += this.renderer[tok.type](toks.shift());
                else{
                    throw new Error('지원하지 않는 토큰: ' + JSON.stringify(tok));
                }
                break;
        }
        preType = tok.type;
    }
    content += '<br>'+this.renderer.footnotes(this.additional.footnotes);
    content = (this.additional.toc.toks.length == 0 ? '' : this.renderer.toc(this.parseHeadings(this.additional.toc.toks))) + content;
    return content;
};

module.exports = Parser;
