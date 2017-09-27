/**
 * Created by Le Reveur on 2017-05-03.
 */
"use strict";
let InlineLexer = require('./inline_lexer');
let Components = require('./Components');

let blocks = {
    heading: /^(={2,6}) (.+) ={2,6}\s*(\r?\n|$)/,
    list: /^(\s+)([*-]) (.+)(\r?\n|$)/,
    // indent: /^:{1,}(.+)(\r?\n|$)/,
    hr: /^-{3,}\s*(\r?\n|$)/,
    quote: /^>(?:\((.*?)(?:\|(.*?))?\))? (.*?)(\r?\n|$)/,
    // textbox: /^/,
    table: /^(?:\|\|.*\r?\n|$)+/,
    emptyline: /^(\s*\r?\n)+/,
    paragraph: /^(?:(?:\s*)\n)*([^\n]+?)(\r?\n|$)/,
    macro: /^{{(\S*?)(?:\((\S*?)\))?\s+([\s\S]*?)}}/,
    comment: /^## .*(\r?\n|$)/,
    blockLaTeX: /^\$\$([^\$]+?)\$\$/
};

class Lexer {
    static scan(src) {
        let toks = [];
        let pages = [];
        let cap, subToks;
        while (src) {
            //heading
            if (cap = blocks.heading.exec(src)) {
                subToks = InlineLexer.scan(cap[2], pages);
                toks.push({type: 'heading', level: cap[1].length - 1, toks: subToks});
                src = src.substr(cap[0].length);
                continue;
            }

            //emptyline
            if (cap = blocks.emptyline.exec(src)) {
                toks.push({
                    type: 'emptyline'
                });
                // toks.push(new Components.Newline());
                src = src.substr(cap[0].length);
                continue;
            }

            //list
            if (cap = blocks.list.exec(src)) {
                toks.push({
                    type: 'list',
                    ordered: cap[2] === '-',
                    level: cap[1].length,
                    toks: InlineLexer.scan(cap[3], pages)
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
                    ref: cap[1],
                    title: cap[2],
                    toks: InlineLexer.scan(cap[3], pages)
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
                // let list = cap[1].split('||').slice(1).map(function (item) {
                //     return item.trim();
                // });
                // let option = list.pop();
                // list = list.map(item => {
                //     return InlineLexer.scan(item, pages);
                // });

                toks.push(new Components.Table(cap[0]));
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
                // toks.push({
                //     type: 'hr'
                // });
                toks.push(new Components.Hr());
                src = src.substr(cap[0].length);
                continue;
            }

            //macro
            if (cap = blocks.macro.exec(src)) {
                toks.push({
                    type: 'macro',
                    macro: cap[1] || '',
                    param: cap[2] ? cap[2].split(',') : null,
                    text: cap[3].trim()
                });
                src = src.substr(cap[0].length);
                continue;
            }

            //paragraph
            if (cap = blocks.paragraph.exec(src)) {
                toks = toks.concat(InlineLexer.scan(cap[1], pages));
                src = src.substr(cap[0].length);
                continue;
            }

            if (src) {
                toks.push({
                    type: 'error',
                    name: 'Scan Error',
                    text: 'Disable to scan: ' + src.substr(0, 10) + '...'
                });
                return toks;
            }
        }
        pages = pages.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        return [toks, {link: pages}];
    };
}

module.exports = Lexer;