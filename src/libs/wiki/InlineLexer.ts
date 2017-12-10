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
        [/^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/, escape], //escape
        [/^''(?!')([\s\S]*?)''/, (cap) => new Components.TagDecorator('i', null, new Components.SimpleTag('b', null, cap[1]))], //italic
        [/^'''(?!')([\s\S]*?)'''/, cap => new Components.SimpleTag('b', null, cap[1])], //bold
        [/^'''''(?!')([\s\S]*?)'''''/, cap => new Components.SimpleTag('strong', null, cap[1])], //italicbold
        [/^__(.+)__/, cap => new Components.SimpleTag('u', null, cap[1])], //underline
        [/^~~(?=\S)([\s\S]*?\S)~~/, cap => new Components.SimpleTag('del', null, cap[1])], //del
        [/^\^\^(.+?)\^\^/, cap => new Components.SimpleTag('sup', null, cap[1])], //sup
        [/^,,(.+),,/, cap => new Components.SimpleTag('sub', null, cap[1])], //sub
        [/^\[\[(?:(.+?):\s)?(https?:\/\/[^\|]+?)(?:\|([^\|]+?))?\]\]/, (cap) => { //urlink
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
        [/^\[\[([^\]\|]*?)(?:\|([^\]\|]+?))?\]\]/, (cap, em) => { //link
            let text = cap[2] || cap[1];
            let parsedLink = linkSyntax.exec(cap[1]).slice(1, 4);
            return em.makeToken(ETokenType.LINK, [...parsedLink, text]) as Token;
        }],
        [/^ {2,}$/, cap => new Components.SelfClosingSimpleTag('br', null)], //newline
        [/^\(\((.+)\)\)/, (cap, em) => new Components.Footnote(this.scan(cap[1]) as Token[])], //rfootnote
        [/^\$([^\$]+?)\$/, cap => new Components.Math(cap[1], false)], //inlinelatex
        [/^\$\$([^\$]+?)\$\$/, cap => new Components.Math(cap[1], false)], //blocklatex
        [/^`(.*)`/, cap => new Components.InlineCode(cap[1])], //inline code
        // [ETokenType.MACRO, /^{{(.*?)(?:\((.*?)\))?(?: ([^\$\$]*?))?}}/],
        [/^.+?(?={{|\\|\$|''|__|\^\^|,,| {2}|\[\[|~~|`| {2,}|\(\(|\n|$)/, cap => new Components.Text(cap[0])] //text
    ] as [[RegExp, (cap: any, em: any, lexer: any) => Token]];

    constructor(envManager: EnvManager) {
        super(envManager, "Inline", null);
        this.inlineLexer = this;
    }
}
