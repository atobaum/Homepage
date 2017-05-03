/**
 * Created by Le Reveur on 2017-05-03.
 */
var blocks = {
    heading: /^(={2,5}) (.+) ={2,5}(\r?\n|$)/,
    list: /^(\s+)([*-]) (.+)(\r?\n|$)/,
    // indent: /^:{1,}(.+)(\r?\n|$)/,
    hr: /^-{3,}\s*(\r?\n|$)/,
    // quote: /^/,
    // quote2: /^/,
    // code: /^<code>(.+)<\/code>(\r?\n|$)/,
    // math: /^<math>(.+)<\/math>(\r?\n|$)/,
    // table: /^/,
    emptyline: /^\r?\n(?:\s*)/,
    paragraph: /^(?:(?:\s*)\n)*([^\n]+?)(\r?\n|$)/,
    text: /^(\r?\n|$)/
};

function Lexer(additional){
    this.additional = additional;
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
                text: cap[2],
                id: ''
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
    //console.log('toks: ', toks);
    return toks;
};
module.exports = Lexer;