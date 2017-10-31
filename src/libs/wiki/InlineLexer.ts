/**
 * Created by Le Reveur on 2017-05-03.
 */
import * as Components from "./Components";
import {ETokenType, Token} from "./Components";
import {EnvManager} from "./EnvManager";
import Lexer from "./Lexer";

let linkSyntax = /^(?:(.*?):)?(.*?)(\#[^\#]+?)?$/;

function escape(cap) {
    let char: string;
    switch (cap[1]) {
        case 't':
            char = '&emsp;';
            break;
        default:
            char = cap[1];
    }
    return new Components.Text(char);
}
export class InlineLexer extends Lexer {
    TokenList = [
        [ETokenType.ESCAPE, /^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/, escape],
        [ETokenType.ITALIC, /^''(?!')(?=\S)([\s\S]*?\S)''/, (cap) => new Components.TagDecorator('i', null, new Components.SimpleTag('b', null, cap[1]))],
        [ETokenType.BOLD, /^'''(?!')(?=\S)([\s\S]*?\S)'''/, cap => new Components.SimpleTag('b', null, cap[1])],
        [ETokenType.ITALICBOLD, /^'''''(?!')(?=\S)([\s\S]*?\S)'''''/, cap => new Components.SimpleTag('i', null, cap[1])],
        [ETokenType.UNDERLINE, /^__(.+)__/, cap => new Components.SimpleTag('u', null, cap[1])],
        [ETokenType.DEL, /^~~(?=\S)([\s\S]*?\S)~~/, cap => new Components.SimpleTag('del', null, cap[1])],
        [ETokenType.SUP, /^\^\^(.+?)\^\^/, cap => new Components.SimpleTag('sup', null, cap[1])],
        [ETokenType.SUB, /^,,(.+),,/, cap => new Components.SimpleTag('sub', null, cap[1])],
        [ETokenType.URLLINK, /^\[\[(?:(.+?):\s)?(https?:\/\/[^\|]+?)(?:\|([^\|]+?))?\]\]/, (cap) => {
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
        [ETokenType.LINK, /^\[\[([^\]\|]*?)(?:\|([^\]\|]+?))?\]\]/, (cap, em) => {
            let text = cap[2] || cap[1];
            let parsedLink = linkSyntax.exec(cap[1]).slice(1, 4);
            return em.makeToken(ETokenType.LINK, [...parsedLink, text]) as Token;
        }],
        [ETokenType.NEWLINE, /^ {2,}$/, cap => new Components.SelfClosingSimpleTag('br', null)],
        [ETokenType.RFOOTNOTE, /^\(\((.+)\)\)/, (cap, em) => em.makeToken(ETokenType.RFOOTNOTE, this.scan(cap[1])) as Token],
        [ETokenType.INLINELATEX, /^\$([^\$]+?)\$/, cap => new Components.Math(cap[1], false)],
        [ETokenType.BLOCKLATEX, /^\$\$([^\$]+?)\$\$/, cap => new Components.Math(cap[1], false)],
        // [ETokenType.MACRO, /^{{(.*?)(?:\((.*?)\))?(?: ([^\$\$]*?))?}}/],
        [ETokenType.TEXT, /^.+?(?={{|\\|\$|''|__|\^\^|,,| {2}|\[\[|~~| {2,}|\(\(|\n|$)/, cap => new Components.Text(cap[0])]
    ] as [[ETokenType, RegExp, (cap: any, em: any, lexer: any) => Token]];

    constructor(envManager: EnvManager) {
        super(envManager, "Inline", null);
        this.inlineLexer = this;
    }
}
