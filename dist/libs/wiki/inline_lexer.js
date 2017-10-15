"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-05-03.
 */
const Components = require("./Components");
const Components_1 = require("./Components");
let inlineTockens = [
    [Components_1.ETokenType.ESCAPE, /^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/],
    [Components_1.ETokenType.ITALIC, /^''(?!')(?=\S)([\s\S]*?\S)''/],
    [Components_1.ETokenType.BOLD, /^'''(?!')(?=\S)([\s\S]*?\S)'''/],
    [Components_1.ETokenType.ITALICBOLD, /^'''''(?!')(?=\S)([\s\S]*?\S)'''''/],
    [Components_1.ETokenType.UNDERLINE, /^__(.+)__/],
    [Components_1.ETokenType.SUP, /^\^\^(.+?)\^\^/],
    [Components_1.ETokenType.SUB, /^,,(.+),,/],
    [Components_1.ETokenType.URLLINK, /^\[\[(?:(.+?):\s)?(https?:\/\/[^\|]+?)(?:\|([^\|]+?))?\]\]/],
    [Components_1.ETokenType.LINK, /^\[\[([^\]\|]*?)(?:\|([^\]\|]+?))?\]\]/],
    [Components_1.ETokenType.DEL, /^~~(?=\S)([\s\S]*?\S)~~/],
    [Components_1.ETokenType.NEWLINE, /^ {2,}$/],
    [Components_1.ETokenType.RFOOTNOTE, /^\(\((.+)\)\)/],
    // [ETokenType.FONTSIZE, /./],
    // [ETokenType.FONTCOLOR, /./],
    [Components_1.ETokenType.INLINELATEX, /^\$([^\$]+?)\$/],
    [Components_1.ETokenType.BLOCKLATEX, /^\$\$([^\$]+?)\$\$/],
    [Components_1.ETokenType.MACRO, /^{{(.*?)(?:\((.*?)\))?(?: ([^\$\$]*?))?}}/],
    [Components_1.ETokenType.TEXT, /^.+?(?={{|\\|\$|''|__|\^\^|,,| {2}|\[\[|~~| {2,}|\(\(|\n|$)/]
];
let linkSyntax = /^(?:(.*?):)?(.*?)(\#[^\#]+?)?$/;
class Lexer {
    constructor(envManager) {
        this.envManager = envManager;
    }
    scan(src) {
        let cap;
        let type;
        let syntax;
        let toks = [];
        WhileLoop: while (src) {
            for ([type, syntax] of this.TokenList) {
                if (cap = syntax.exec(src)) {
                    toks.push(this.makeToken(type, cap));
                    src = src.substr(cap[0].length);
                    continue WhileLoop;
                }
            }
            toks.push(new Components.Error('Infinite Loop in InlineParser', "Error occurred in processing " + src));
            break;
        }
        return toks;
    }
    makeToken(type, cap) {
        throw new Error("Error: Override 'makeToken'");
    }
    ;
}
exports.Lexer = Lexer;
class InlineLexer extends Lexer {
    constructor(envManager) {
        super(envManager);
        this.TokenList = inlineTockens;
    }
    makeToken(type, cap) {
        switch (type) {
            case Components_1.ETokenType.ITALICBOLD:
                let bold = new Components.SimpleTag('b', null, cap[1]);
                return new Components.TagDecorator('i', null, bold);
            case Components_1.ETokenType.ITALIC:
                return new Components.SimpleTag('i', null, cap[1]);
            case Components_1.ETokenType.BOLD:
                return new Components.SimpleTag('b', null, cap[1]);
            case Components_1.ETokenType.UNDERLINE:
                return new Components.SimpleTag('u', null, cap[1]);
            case Components_1.ETokenType.SUP:
                return new Components.SimpleTag('sup', null, cap[1]);
            case Components_1.ETokenType.SUB:
                return new Components.SimpleTag('sub', null, cap[1]);
            case Components_1.ETokenType.DEL:
                return new Components.SimpleTag('del', null, cap[1]);
            case Components_1.ETokenType.URLLINK:
                let linkType;
                switch (cap[1]) {
                    case 'img':
                    case '이미지':
                        linkType = Components.ExtLinkType.IMG;
                        break;
                    default:
                        linkType = Components.ExtLinkType.DEFAULT;
                }
                return new Components.ExtLink(linkType, cap[3], cap[2]);
            case Components_1.ETokenType.LINK:
                let text = cap[2] || cap[1];
                let parsedLink = linkSyntax.exec(cap[1]).slice(1, 4);
                return this.envManager.makeToken(type, [...parsedLink, text]);
            case Components_1.ETokenType.NEWLINE:
                return new Components.SelfClosingSimpleTag('br', null);
            case Components_1.ETokenType.RFOOTNOTE:
                return this.envManager.makeToken(Components_1.ETokenType.RFOOTNOTE, this.scan(cap[1]));
            case Components_1.ETokenType.INLINELATEX:
                return new Components.Math(cap[1], false);
            case Components_1.ETokenType.BLOCKLATEX:
                return new Components.Math(cap[1], true);
            // //macro
            // case ETokenType.MACRO:
            //         return sh({type: 'macro', text: cap[3], macro: cap[1], param: (cap[2] ? cap[2].split(',') : null)});
            //     src = src.substr(cap[0].length);
            //     continue;
            // }
            case Components_1.ETokenType.ESCAPE:
                let char;
                switch (cap[1]) {
                    case 't':
                        char = '&emsp;';
                        break;
                    default:
                        char = cap[1];
                }
                return new Components.Text(char);
            case Components_1.ETokenType.TEXT:
                return new Components.Text(cap[0]);
        }
    }
}
exports.InlineLexer = InlineLexer;
