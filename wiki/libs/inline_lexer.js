/**
 * Created by Le Reveur on 2017-05-03.
 */
let Components = require('./Components');

let inlineTockens = {
    escape: /^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/,
    italic: /^''(?!')(?=\S)([\s\S]*?\S)''/,
    bold: /^'''(?!')(?=\S)([\s\S]*?\S)'''/,
    italicbold: /^'''''(?!')(?=\S)([\s\S]*?\S)'''''/,
    underline: /^__(.+)__/,
    sup: /^\^\^(.+?)\^\^/,
    sub: /^,,(.+),,/,
    urlLink: /^\[\[(?:(.+?):\s)?(https?:\/\/[^\|]+?)(?:\|([^\|]+?))?\]\]/,
    link: /^\[\[([^\|]+?)(\|([^\|]+?))?\]\]/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    newline: /^ {2,}$/,
    footnote: /^\(\((.+)\)\)/,
    fontsize: /./,
    fontcolor: /./,
    text: /^.+?(?={{|\\|\$|''|__|\^\^|,,| {2}|\[\[|~~| {2,}|\(\(|\n|$)/,
    inlineLatex: /^\$([^\$]+?)\$/,
    blockLatex: /^\$\$([^\$]+?)\$\$/,
    macro: /^{{(.*?)(?:\((.*?)\))?(?: ([^\$\$]*?))?}}/
};

class InlineLexer {
    static scan(src, pages) {
        let cap;
        let toks = [];
        while (src) {
            //italicbold
            if (cap = inlineTockens.italicbold.exec(src)) {
                toks.push({type: 'italicbold', text: cap[1]});
                src = src.substr(cap[0].length);
                continue;
            }

            //italic
            if (cap = inlineTockens.italic.exec(src)) {
                // toks.push({type: 'italic', text: cap[1]});
                toks.push(new Components.Italic(cap[1]));
                src = src.substr(cap[0].length);
                continue;
            }

            //bold
            if (cap = inlineTockens.bold.exec(src)) {
                // toks.push({type: 'bold', text: cap[1]});
                toks.push(new Components.Bold(cap[1]));
                src = src.substr(cap[0].length);
                continue;
            }

            //underline
            if (cap = inlineTockens.underline.exec(src)) {
                // toks.push({type: 'underline', text: cap[1]});
                toks.push(new Components.Underline(cap[1]));
                src = src.substr(cap[0].length);
                continue;
            }

            //sup
            if (cap = inlineTockens.sup.exec(src)) {
                // toks.push({type: 'sup', text: cap[1]});
                toks.push(new Components.Sup(cap[1]));
                src = src.substr(cap[0].length);
                continue;
            }

            //sub
            if (cap = inlineTockens.sub.exec(src)) {
                // toks.push({type: 'sub', text: cap[1]});
                toks.push(new Components.Sub(cap[1]));
                src = src.substr(cap[0].length);
                continue;
            }

            //del
            if (cap = inlineTockens.del.exec(src)) {
                // toks.push({type: 'del', text: cap[1]});
                toks.push(new Components.Del(cap[1]));
                src = src.substr(cap[0].length);
                continue;
            }

            //urlLink
            if (cap = inlineTockens.urlLink.exec(src)) {
                // toks.push({type: 'urlLink', type2: cap[1], text: cap[3], href: cap[2]});
                toks.push(new Components.ExtLink(cap[1], cap[3], cap[2]));
                src = src.substr(cap[0].length);
                continue;
            }

            //link
            if (cap = inlineTockens.link.exec(src)) {
                toks.push({type: 'link', text: cap[3], href: cap[1]});

                pages.push(cap[1].split('#')[0].toLowerCase());
                src = src.substr(cap[0].length);
                continue;
            }

            //newline
            if (cap = inlineTockens.newline.exec(src)) {
                // toks.push({type: 'newline'});
                toks.push(new Components.Newline());
                src = src.substr(cap[0].length);
                continue;
            }

            //footnote
            if (cap = inlineTockens.footnote.exec(src)) {
                toks.push({type: 'footnote', toks: InlineLexer.scan(cap[1], pages)});
                src = src.substr(cap[0].length);
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

            //math
            if (cap = inlineTockens.inlineLatex.exec(src)) {
                toks.push({type: 'LaTeX', text: cap[1], displayMode: false});
                src = src.substr(cap[0].length);
                continue;
            }


            if (cap = inlineTockens.blockLatex.exec(src)) {
                toks.push({type: 'LaTeX', text: cap[1], displayMode: true});
                src = src.substr(cap[0].length);
                continue;
            }

            //macro
            if (cap = inlineTockens.macro.exec(src)) {
                toks.push({type: 'macro', text: cap[3], macro: cap[1], param: (cap[2] ? cap[2].split(',') : null)});
                src = src.substr(cap[0].length);
                continue;
            }

            //escape
            if (cap = inlineTockens.escape.exec(src)) {
                let char;
                switch (cap[1]) {
                    case 't':
                        char = '&emsp;';
                        break;
                    default:
                        char = cap[1];
                }
                toks.push({type: 'text', text: char});
                src = src.substr(cap[0].length);
                continue;
            }
            //else: text
            if (cap = inlineTockens.text.exec(src)) {
                toks.push(new Components.Text(cap[0]));
                src = src.substr(cap[0].length);
                continue;
            }

            toks.push({
                type: 'error',
                name: "Infinite Loop in Inline Parser",
                text: 'Error occurred while processing ' + src
            });
            break;
        }

        console.log(toks);
        return new Components.Token(toks);
    }
}

module.exports = InlineLexer;