"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * Created by Le Reveur on 2017-05-03.
 */
const Components = require("./Components");
const Components_1 = require("./Components");
const Lexer_1 = require("./Lexer");
let linkSyntax = /^(?:(.*?):)?(.*?)(\#[^\#]+?)?$/;
function escape(cap) {
    let char;
    switch (cap[1]) {
        case 't':
            char = '&emsp;';
            break;
        default:
            char = cap[1];
    }
    return new Components.Text(char);
}
class InlineLexer extends Lexer_1.default {
    constructor(envManager) {
        super(envManager, "Inline", null);
        this.TokenList = [
            [/^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/, escape],
            [/^''(?!')([\s\S]*?)''/, (cap) => new Components.TagDecorator('i', null, new Components.SimpleTag('b', null, cap[1]))],
            [/^'''(?!')([\s\S]*?)'''/, cap => new Components.SimpleTag('b', null, cap[1])],
            [/^'''''(?!')([\s\S]*?)'''''/, cap => new Components.SimpleTag('strong', null, cap[1])],
            [/^__(.+)__/, cap => new Components.SimpleTag('u', null, cap[1])],
            [/^~~(?=\S)([\s\S]*?\S)~~/, cap => new Components.SimpleTag('del', null, cap[1])],
            [/^\^\^(.+?)\^\^/, cap => new Components.SimpleTag('sup', null, cap[1])],
            [/^,,(.+),,/, cap => new Components.SimpleTag('sub', null, cap[1])],
            [/^\[\[(?:(.+?):\s)?(https?:\/\/[^\|]+?)(?:\|([^\|]+?))?\]\]/, (cap) => {
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
            }],
            [/^\[\[([^\]\|]*?)(?:\|([^\]\|]+?))?\]\]/, (cap, em) => {
                let text = cap[2] || cap[1];
                let parsedLink = linkSyntax.exec(cap[1]).slice(1, 4);
                return em.makeToken(Components_1.ETokenType.LINK, [...parsedLink, text]);
            }],
            [/^ {2,}$/, cap => new Components.SelfClosingSimpleTag('br', null)],
            [/^\(\((.+)\)\)/, (cap, em) => new Components.Footnote(this.scan(cap[1]))],
            [/^\$([^\$]+?)\$/, cap => new Components.Math(cap[1], false)],
            [/^\$\$([^\$]+?)\$\$/, cap => new Components.Math(cap[1], false)],
            [/^`(.*)`/, cap => new Components.InlineCode(cap[1])],
            // [ETokenType.MACRO, /^{{(.*?)(?:\((.*?)\))?(?: ([^\$\$]*?))?}}/],
            [/^.+?(?={{|\\|\$|''|__|\^\^|,,| {2}|\[\[|~~|`| {2,}|\(\(|\n|$)/, cap => new Components.Text(cap[0])] //text
        ];
        this.inlineLexer = this;
    }
}
exports.InlineLexer = InlineLexer;
