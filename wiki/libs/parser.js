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
    this.lexer = new Lexer(this.additional);
    this.inlineParser = new InlineParser(this.renderer, this.additional);
}

Parser.prototype.initAdditional = function(){
    this.additional.footnotes = [];
    this.additional.toc = [];
};

Parser.prototype.reloadRenderer = function(){
    this.renderer = new Renderer();
    this.inlineParser = new InlineParser(this.renderer);
};

Parser.prototype.parseList = function(first, toks){

    var list = [first],
        curOrdered = first.ordered,
        curLevel = first.level;
    while(toks[0] && toks[0].type == 'list' && (toks[0].level > curLevel || (toks[0].level == curLevel && toks[0].ordered == curOrdered))) {
        var tok = toks.shift();
        tok.text = this.inlineParser.out(tok.text);
        list.push(tok);
    }

    return this.renderer.list(list);
    // if(curOrdered){
    //     content = '<ol>';
    // } else{
    //     content = '<ul>';
    // }
    //     content += `<li>${this.inlineParser.out(first.text)}`
    // while(toks[0] && toks[0].type == 'list' && (toks[0].level >= curLevel || toks[0].ordered == curOrdered)) {
    //     nextItem = toks.shift();
    //     if(nextItem.level == curLevel)
    //         content += `</li><li>${this.inlineParser.out(nextItem.text)}`;
    //     else {
    //         content += `${this.parseList(nextItem, toks, renderer)}`;
    //     }
    // }
    //
    // if (curOrdered) {
    //     content += '</li></ol>';
    // } else {
    //     content += '</li></ul>';
    // }
    // return content;
}

Parser.prototype.out = function(src){
    this.initAdditional();
    var content = '';
    var toks = this.lexer.scan(src);
    var preType = ''; //type of previous token.
    while (tok = toks.shift()){
        if(tok.text) tok.text = this.inlineParser.out(tok.text);
        switch(tok.type){
            case 'heading':
                var result = this.inlineParser.out(tok.text);
                content += this.renderer.heading({level: tok.level, text: result});
                break;
            case 'list':
                content += this.parseList(tok, toks);
                break;
            default:
                if(this.renderer[tok.type])
                    content += this.renderer[tok.type](tok);
                else{
                    throw new Error('지원하지 않는 토큰: ' + JSON.stringify(tok));
                }
                break;
        }
        preType = tok.type;
    }
    //console.log(this.additional);
    content += '<hr>'+this.renderer.footnotes(this.additional.footnotes);
    return content;
};

module.exports = Parser;
