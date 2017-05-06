/**
 * Created by Le Reveur on 2017-05-03.
 */
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
    footnote: /^\(\((.+)\)\)/,
    fontsize: /./,
    fontcolor: /./,
    text: /^.+?(?=''|__|\^\^|,,|\[\[|~~| {2,}|\(\(|\n|$)/
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
            this.additional.footnotes.push({text: cap[1]});
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


        //else: text
        if (cap = inlineTockens.text.exec(src)) {
            result += cap[0];
            src = src.substr(cap[0].length);
            continue;
        }

        console.error('result: '+result);
        console.error('src: '+src);
        throw new Error('Infinite loop');
    }
    return result;
};

module.exports = InlineParser;