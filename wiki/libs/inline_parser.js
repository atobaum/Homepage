/**
 * Created by Le Reveur on 2017-05-03.
 */
var inlineTockens = {
    escape: /^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/,
    italic: /^''(?!')(?=\S)([\s\S]*?\S)''/,
    bold: /^'''(?!')(?=\S)([\s\S]*?\S)'''/,
    italicbold: /^'''''(?!')(?=\S)([\s\S]*?\S)'''''/,
    underline: /^__(.+)__/,
    sup: /^\^\^(.+?)\^\^/,
    sub: /^,,(.+),,/,
    urlLink: /^\[\[(https?:\/\/[^\|]+?)(\|([^\|]+?))?\]\]/,
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

var katex = require("katex");

function InlineParser(parser){
    this.parser = parser;
    this.renderer = parser.renderer;
    this.additional = parser.additional;
}

InlineParser.prototype.out = function(src) {
    var result='';
    var cap;
    var renderer = this.renderer;
    while (src) {
        //italicbold
        if (cap = inlineTockens.italicbold.exec(src)) {
            result += renderer.italicbold({text: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //italic
        if (cap = inlineTockens.italic.exec(src)) {
            result += renderer.italic({text: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //bold
        if (cap = inlineTockens.bold.exec(src)) {
            result += renderer.bold({text: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //underline
        if (cap = inlineTockens.underline.exec(src)) {
            result += renderer.underline({text: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //sup
        if (cap = inlineTockens.sup.exec(src)) {
            result += renderer.sup({text: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //sub
        if (cap = inlineTockens.sub.exec(src)) {
            result += renderer.sub({text: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //urlLink
        if (cap = inlineTockens.urlLink.exec(src)) {
            result += renderer.urlLink({text: cap[3], href: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //link
        if (cap = inlineTockens.link.exec(src)) {
            result += renderer.link({text: cap[3], href: cap[1]});
            src = src.substr(cap[0].length);
            continue;
        }

        //del
        if (cap = inlineTockens.del.exec(src)) {
            result += renderer.del({text: cap[1]});
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
            this.additional.footnotes.push({text: this.out(cap[1])});
            result += renderer.rfn({index: this.additional.footnotes.length, text: cap[1]});
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
        if(cap = inlineTockens.inlineLatex.exec(src)){
            try {
                result += katex.renderToString(cap[1]);
            } catch(e){
                result += this.renderer.error({name: "KaTeX parse error", text: "There's something wrong in LaTeX code: "+cap[1]});
            }
            src = src.substr(cap[0].length);
            continue;
        }


        if(cap = inlineTockens.blockLatex.exec(src)){
            result += katex.renderToString(cap[1], {displayMode: true});
            src = src.substr(cap[0].length);
            continue;
        }

        //macro
        if(cap = inlineTockens.macro.exec(src)){
            result += this.macro(cap[1], cap[2], cap[3]);
            src = src.substr(cap[0].length);
            continue;
        }

        //escape
        if(cap = inlineTockens.escape.exec(src)){
            switch (cap[1]) {
                case 't':
                    result += '&emsp;';
                    break;
                default:
                    result += cap[1];
            }
            src = src.substr(cap[0].length);
            continue;
        }
        //else: text
        if (cap = inlineTockens.text.exec(src)) {
            result += cap[0];
            src = src.substr(cap[0].length);
            continue;
        }

        result += this.renderer.error({name:"Infinite Loop in Inline Parser", text: 'Error occurred while processing '+src});
        break;
    }
    return result;
};

InlineParser.prototype.macro = function(type, param, text){
    switch (type.toLowerCase()){
        case '':
            return `<code>${this.renderer.escapeHTML(text)}</code>`;
            break;
        case 'html':
            if(param) return `<${param}>${text}</${param}>`;
            else return text;
        case 'cat':
        case 'category':
            this.parser.addCat(text);
            return '';
        case 'label':
            return `<a id="${text}"></a>`;
        case 'br':
            return `<br />`;
        default:
            return this.renderer.error({name:"Inline Macro Error", text: 'Inline macro '+type+' doesn\'t supported.'});
    }
};

module.exports = InlineParser;