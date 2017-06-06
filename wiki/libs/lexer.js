/**
 * Created by Le Reveur on 2017-05-03.
 */

var InlineParser = require('./inline_parser');
var blocks = {
    heading: /^(={2,5}) (.+) ={2,5}(\r?\n|$)/,
    list: /^(\s+)([*-]) (.+)(\r?\n|$)/,
    // indent: /^:{1,}(.+)(\r?\n|$)/,
    hr: /^-{3,}\s*(\r?\n|$)/,
    quote: /^> (.*?)(\r?\n|$)/,
    // textbox: /^/,
    // code: /^<code>(.+)<\/code>(\r?\n|$)/,
    table: /^(\|\|.*)(\r?\n|$)/,
    emptyline: /^(?:\s*)\r?\n/,
    paragraph: /^(?:(?:\s*)\n)*([^\n]+?)(\r?\n|$)/,
    macro: /^{{{(.*?)(?:\((.*?)\))?\s*\r?\n([\s\S]*?)(\r?\n)?}}}\s*(\r?\n|$)/,
    comment: /^## .*(\r?\n|$)/,
    blockLaTeX: /^\$\$([^\$]+?)\$\$/
};

function Lexer(parser){
    this.additional = parser.additional;
    this.inlineParser = parser.inlineParser;
}

Lexer.prototype.scan = function(src){
    var toks = [];
    var cap;
    while (src) {
        //heading
        if (cap = blocks.heading.exec(src)) {
            var level = cap[1].length - 1;
            var toc = this.additional.toc;
            if(level > toc.curLevel.length)
                toc.curLevel.push(1);
            else if (level == toc.curLevel.length)
                toc.curLevel[level - 1]++;
            else {
                toc.curLevel.pop();
                toc.curLevel[toc.curLevel.length - 1]++;
            }

            var id = 'h-';
            var prefix = '';
            for(var i = 0; i < toc.curLevel.length; i++){
                id += toc.curLevel[i] + '-';
                prefix += toc.curLevel[i] + '.';
            }
            id = id.substr(0, id.length - 1);
            prefix = prefix.substr(0, prefix.length - 1);


            var text = this.inlineParser.out(cap[2]);
            toc.toks.push({
                level: cap[1].length - 1,
                text: text,
                id: id,
                prefix: prefix
            });

            toks.push({
                type: 'heading',
                level: cap[1].length - 1,
                text: text,
                id: id
            });
            src = src.substr(cap[0].length);
            continue;
        }

        //emptyline
        if(cap = blocks.emptyline.exec(src)){
            toks.push({
                type: 'emptyline'
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
                text: this.inlineParser.out(cap[3])
            });
            src = src.substr(cap[0].length);
            continue;
        }

        //blocklatex
        if (cap = blocks.blockLaTeX.exec(src)) {
            toks.push({
                type: 'LaTeX',
                displayMode: true,
                text: cap[1]
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

        //quote
        if (cap = blocks.quote.exec(src)) {
            toks.push({
                type: 'quote',
                text: this.inlineParser.out(cap[1])
            });
            src = src.substr(cap[0].length);
            continue;
        }

        //comment
        if (cap = blocks.comment.exec(src)) {
            src = src.substr(cap[0].length);
            continue;
        }

        //table
        if (cap = blocks.table.exec(src)) {
            var list = cap[1].split('||').slice(1).map(function(item){return item.trim();});
            toks.push({
                type: 'table',
                additional: list.pop(),
                row: list.map((text)=>{return this.inlineParser.out(text)})
            });

            src = src.substr(cap[0].length);
            continue;
        }

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

        //macro
        if (cap = blocks.macro.exec(src)){
            toks.push({
                type: 'macro',
                macro: cap[1],
                param: cap[2],
                text: cap[3]
            });
            src = src.substr(cap[0].length);
            continue;
        }


        //paragraph
        if (cap = blocks.paragraph.exec(src)) {
            toks.push({
                type: 'paragraph',
                text: this.inlineParser.out(cap[1])
            });
            src = src.substr(cap[0].length);
            continue;
        }


        if(src){
            toks.push({
                type: 'error',
                name: 'Scan Error',
                text: 'Disable to scan: '+src.substr(0, 10)+'...'
            });
            return toks;
        }
    }
    return toks;
};
module.exports = Lexer;