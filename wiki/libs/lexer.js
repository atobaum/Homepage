/**
 * Created by Le Reveur on 2017-05-03.
 */
"use strict";
var InlineParser = require('./inline_parser');
var blocks = {
    heading: /^(={2,6}) (.+) ={2,6}\s*(\r?\n|$)/,
    list: /^(\s+)([*-]) (.+)(\r?\n|$)/,
    // indent: /^:{1,}(.+)(\r?\n|$)/,
    hr: /^-{3,}\s*(\r?\n|$)/,
    quote: /^>(?:\((.*?)(?:\|(.*?))?\))? (.*?)(\r?\n|$)/,
    // textbox: /^/,
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

Lexer.prototype.scan = function(src, ns){
    let toks = [];
    let links = [];
    let cap;
    let headings = [];
    while (src) {
        //heading
        if (cap = blocks.heading.exec(src)) {
            headings.push({level: cap[1].length - 1, text: this.inlineParser.out(cap[2], ns)}); //[level, text]
            toks.push({type: 'heading'});
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
                text: this.inlineParser.out(cap[3], ns)
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
                text: this.inlineParser.out(cap[3], ns),
                ref: cap[1],
                title: cap[2]
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
                row: list.map((text)=>{return this.inlineParser.out(text, ns)})
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
                text: this.inlineParser.out(cap[1], ns)
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
    return [toks, headings];
};
module.exports = Lexer;