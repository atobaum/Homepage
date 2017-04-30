/**
 * Created by Le Reveur on 2017-04-24.
 */

var Renderer = require('./renderer');

var blocks = {
    heading: /^(={2,5}) (.+) ={2,5}(\n|$)/,
    list: /^(\s+)([*-]) (.+)(\n|$)/,
    newparagraph: /^\n+/,
    // indent: /^:{1,}(.+)(\n|$)/,
    hr: /^-{3,}/,
    // quote: /^/,
    // quote2: /^/,
    // code: /^<code>(.+)<\/code>(\n|$)/,
    // math: /^<math>(.+)<\/math>(\n|$)/,
    // table: /^/,
    emptyline: /^\n(?:\s*)/,
    paragraph: /^(?:(?:\s*)\n)*([^\n]+?)(\n|$)/,
    text: /^(\n|$)/
};

var inlineTockens = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    italic: /^''(?!')(?=\S)([\s\S]*?\S)''/,
    bold: /^'''(?!')(?=\S)([\s\S]*?\S)'''/,
    underline: /^__(.+)__/,
    sup: /^\^\^(.+?)\^\^/,
    sub: /^,,(.+),,/,
    urlLink: /^\[\[(https?:\/\/[^\|]+?)(\|([^\|]+?))?\]\]/,
    link: /^\[\[([^\|]+?)(\|([^\|]+?))?\]\]/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    newline: /^ {2,}$/,
    footnote: /\(\(.+\)\)/,
    fontsize: /./,
    fontcolor: /./,
    text: /^.+?(?=''|__|\^\^|,,|\[\[|~~| {2,}|\(\(|\n|$)/
};

function Lexer(){

}

Lexer.prototype.scan = function(src){
    var toks = [];
    var cap;
    while (src) {
        //heading
        if (cap = blocks.heading.exec(src)) {
            toks.push({
                type: 'heading',
                level: cap[1].length - 1,
                text: cap[2]
            });
            src = src.substr(cap[0].length);
            continue;
        }

        //list
        if (cap = blocks.list.exec(src)) {
            toks.push({
                type: 'list',
                ordered: cap[2] == '-',
                level: cap[1].length,
                text: cap[3]
            });
            src = src.substr(cap[0].length);
            continue;
        }

        //indent
        // if (cap = blocks.indent.exec(src)) {
        //     toks.push({
        //         type: 'indent',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }
        //
        // //quote
        // if (cap = blocks.quote.exec(src)) {
        //     toks.push({
        //         type: 'quote',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }

        //quote2
        // if (cap = blocks.quote2.exec(src)) {
        //     toks.push({
        //         type: '',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }

        // //code
        // if (cap = blocks.code.exec(src)) {
        //     toks.push({
        //         type: 'code',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }
        //
        // //math
        // if (cap = blocks.math.exec(src)) {
        //     toks.push({
        //         type: 'math',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }
        //
        // //table
        // if (cap = blocks.table.exec(src)) {
        //     toks.push({
        //         type: 'table',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }
        //
        // //html
        // if (cap = blocks.html.exec(src)) {
        //     toks.push({
        //         type: 'html',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }
        //
        // //nowiki
        // if (cap = blocks.nowiki.exec(src)) {
        //     toks.push({
        //         type: 'html',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }

        //text
        // if (cap = blocks.text.exec(src)) {
        //     toks.push({
        //         type: 'text',
        //         text:
        //     });
        //     src = src.substr(cap[0].length);
        //     continue;
        // }

        //hr
        if (cap = blocks.hr.exec(src)) {
            toks.push({
                type: 'hr'
            });
            src = src.substr(cap[0].length);
            continue;
        }


        //paragraph
        if (cap = blocks.paragraph.exec(src)) {
            toks.push({
                type: 'paragraph',
                text: cap[1]
            });
            src = src.substr(cap[0].length);
            continue;
        }


        if(src){
            console.log('error:');
            console.log(src);
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
    }
    console.log('toks: ', toks);
    return toks;
};

function InlineParser(renderer, additional){
    this.renderer = renderer;
    this.additional = additional;
}

InlineParser.prototype.out = function(src) {
    var result='';
    var cap;
    var renderer = this.renderer;
    while (src) {
        //italic
        if (cap = inlineTockens.italic.exec(src)) {
            result += renderer.italic(cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //bold
        if (cap = inlineTockens.bold.exec(src)) {
            result += renderer.bold(cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //underline
        if (cap = inlineTockens.underline.exec(src)) {
            result += renderer.underline(cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //sup
        if (cap = inlineTockens.sup.exec(src)) {
            result += renderer.sup(cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //sub
        if (cap = inlineTockens.sub.exec(src)) {
            result += renderer.sub(cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //urlLink
        if (cap = inlineTockens.urlLink.exec(src)) {
            result += renderer.urlLink(cap[3], cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //link
        if (cap = inlineTockens.link.exec(src)) {
            result += renderer.link(cap[3], cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //del
        if (cap = inlineTockens.del.exec(src)) {
            result += renderer.del(cap[1]);
            src = src.substr(cap[0].length);
            continue;
        }

        //newline
        if (cap = inlineTockens.newline.exec(src)) {
            result += renderer.newline();
            src = src.substr(cap[0].length);
            continue;
        }

        //footnote
        if (cap = inlineTockens.footnote.exec(src)) {
            var fn = renderer.footnote({index: this.additional.footnoteIndex++, text: cap[1]});
            result += fn[0];
            this.additional.footnote += fn[1];
            continue;
        }

        // //fontsize
        // if (cap = inlineTockens.bold.exec(src)) {
        //     result += renderer.bold(cap[1]);
        //     src = src.substr(cap[0].length);
        //     continue;
        // }
        //
        // //fontcolor
        // if (cap = inlineTockens.bold.exec(src)) {
        //     result += renderer.bold(cap[1]);
        //     src = src.substr(cap[0].length);
        //     continue;
        // }


        //else: text
        if (cap = inlineTockens.text.exec(src)) {
            result += cap[0];
            src = src.substr(cap[0].length);
            continue;
        }

        console.log('result: '+result);
        console.log('src: '+src);
        throw new Error('Infinite loop');
    }
    return result;
};



function Parser(){
    this.renderer = new Renderer();
    this.lexer = new Lexer();
    this.additional = {
        footnotes: ''
    };
    this.inlineParser = new InlineParser(this.renderer, this.additional);
}

Parser.prototype.init = function(){
  this.additional.footnote = '';
    this.additional.footnoteIndex = 1;
};

Parser.prototype.parse = function(){

};

Parser.prototype.reloadRenderer = function(){
    this.renderer = new Renderer();
    this.inlineParser = new InlineParser(this.renderer);
};

function parseList(toks, renderer){
    var nextItem,
        content,
        curOrdered = toks[0].ordered,
        curLevel = toks[0].level;
    if(curOrdered){
        content = '<ol>';
    } else{
        content = '<ul>';
    }

    do{
        nextItem = toks.shift();
        if(nextItem.level == curLevel)
            content += `<li>${nextItem.text}</li>`;
        else if(nextItem.level < curLevel) {
            break;
        }else {
            content += `<li>${parseList(toks, renderer)}</li>`;
        }
    } while(toks[0] && toks[0].type == 'list' && toks[0].ordered == curOrdered)

    if (curOrdered) {
        content += '</ol>';
    } else {
        content += '</ul>';
    }
    return content;
}

Parser.prototype.out = function(src){
    this.additional = {
        footnotes: ''
    };
    var content = '';
    var toks = this.lexer.scan(src);
    var preType = ''; //type of previous token.
    while (tok = toks.shift()){
        switch(tok.type){
            case 'heading':
                var result = this.inlineParser.out(tok.text);
                content += this.renderer.heading({level: tok.level, text: result});
                break;
            case 'list':
                content += parseList(toks, this.renderer);
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
    return content;
}

module.exports = new Parser();
