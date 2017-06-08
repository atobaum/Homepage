/**
 * Created by Le Reveur on 2017-04-24.
 */
"use strict";

let Lexer = require('./lexer');
let InlineParser = require('./inline_parser');
let Renderer = require('./renderer');

class Parser{
    constructor(){
        this.additional = {};
        this.initAdditional();
        this.renderer = new Renderer();
        this.inlineParser = new InlineParser(this);
        this.lexer = new Lexer(this);
        this.headings;
    }

    initAdditional(){
        this.additional.footnotes = [];
        this.additional.cat = [];
        this.toks = [];
    }

    reloadRenderer(){
        this.renderer = new Renderer();
        this.inlineParser = new InlineParser(this.renderer);
    }

    parseList(){
        let list = [],
            curOrdered = this.toks[0].ordered,
            curLevel = this.toks[0].level;

        while(this.toks[0] && this.toks[0].type === 'list' && (this.toks[0].level === curLevel) && (this.toks[0].ordered === curOrdered)){
            let tok = this.toks.shift();
            if(this.toks[0] && this.toks[0].type === 'list' && this.toks[0].level > curLevel)
                tok.child = this.parseList(this.toks);
            list.push(tok);
        }
        return list;
    }

    parseTable(){
        let tables = [];
        while (this.toks[0] && this.toks[0].type === 'table'){
            tables.push(this.toks.shift());
        }
        return tables;
    }

    macro(tok){
        switch (tok.macro.toLowerCase()){
            case(''):
            case(null):
                return '<pre>'+this.renderer.escapeHTML(tok.text)+'</pre>';
                break;
            case('syntax'):
                return this.renderer.syntax(tok);
                break;
            case('html'):
                return tok.text;
                break;
            default:
                return this.renderer.error({name:"Block Macro Error", text: 'Block macro '+tok.macro+' doesn\'t supported.'});
        }
    };

    parseQuote(){
        let tok = this.toks.shift();
        let title = tok.title;
        let text = tok.text;
        let ref = tok.ref;
        while (this.toks[0] && this.toks[0].type === 'quote'){
            text += ' '+this.toks.shift().text;
        }
        return {title: title, ref: ref, text:text};
    };

    out(src, title){
        let content = '';
        this.initAdditional();
        [this.toks, this.headings] = this.lexer.scan(src);
        this.headings = parseHeadings(this.headings);
        let headingInfo = iteratorList(this.headings);
        let tok;
        while (tok = this.toks[0]){
            switch(tok.type){
                case 'heading':
                    this.toks.shift();
                    content += this.renderer.heading(headingInfo.next().value);
                    break;
                case 'list':
                    content += this.renderer.list(this.parseList());
                    break;
                case 'table':
                    content += this.renderer.table(this.parseTable());
                    break;
                case 'macro':
                    content += this.macro(this.toks.shift());
                    break;
                case 'quote':
                    content += this.renderer.blockquote(this.parseQuote());
                    break;
                case 'LaTeX':
                    content += this.renderer.KaTeX(this.toks.shift());
                    break;
                default:
                    if(this.renderer[tok.type])
                        content += this.renderer[tok.type](this.toks.shift());
                    else{
                        content += this.renderer.error({name: "Unsupported Token", text: "Token type is unsupported: "+tok.type});
                        return content;
                    }
                    break;
            }
        }
        content += (this.additional.footnotes.length !== 0 ? '<br>'+this.renderer.footnotes(this.additional.footnotes) : '');
        content = (this.headings.length === 0 ? '' : this.renderer.toc(this.headings)) + content + (this.additional.cat.length !== 0 ? this.renderer.cat(this.additional.cat) : '');
        return content;
    };

    addCat(title){
        this.additional.cat.push(title);
    };
}

/**
 *
 * @param headings{[[num, String]]}
 * @param headings[*].level{num} - heading level
 * @param headings[*].text{String} - heading text
 * @returns {Array}
 */
function parseHeadings(headings, level=[0]){
    if(headings.length === 0)
        return [];
    let list = [];
    while(headings[0] && (headings[0].level >= level.length)) {
        if (headings[0].level > level.length){
            list = list.concat(parseHeadings(headings, [...level, 0]));
        }else{
            level[level.length-1]++;
            let tok = headings.shift();
            //console.log(tok);
            tok.level = level.slice();
            list.push(tok);
        }
    }
    return list;
}

function* iteratorList(list){
    for(let i = 0; i < list.length; i++){
        yield list[i];
    }
}

module.exports = Parser;
