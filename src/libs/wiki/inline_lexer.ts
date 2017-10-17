/**
 * Created by Le Reveur on 2017-05-03.
 */
import * as Components from "./Components";
import {ETokenType, InlineToken} from "./Components";
import {EnvManager} from "./EnvManager";

let inlineTockens: [[ETokenType, RegExp]] = [
    [ETokenType.ESCAPE, /^\\([>\$\\\`'\^_~\(\)*{}\[\]#t])/],
    [ETokenType.ITALIC, /^''(?!')(?=\S)([\s\S]*?\S)''/],
    [ETokenType.BOLD, /^'''(?!')(?=\S)([\s\S]*?\S)'''/],
    [ETokenType.ITALICBOLD, /^'''''(?!')(?=\S)([\s\S]*?\S)'''''/],
    [ETokenType.UNDERLINE, /^__(.+)__/],
    [ETokenType.SUP, /^\^\^(.+?)\^\^/],
    [ETokenType.SUB, /^,,(.+),,/],
    [ETokenType.URLLINK, /^\[\[(?:(.+?):\s)?(https?:\/\/[^\|]+?)(?:\|([^\|]+?))?\]\]/],
    [ETokenType.LINK, /^\[\[([^\]\|]*?)(?:\|([^\]\|]+?))?\]\]/],
    [ETokenType.DEL, /^~~(?=\S)([\s\S]*?\S)~~/],
    [ETokenType.NEWLINE, /^ {2,}$/],
    [ETokenType.RFOOTNOTE, /^\(\((.+)\)\)/],
    // [ETokenType.FONTSIZE, /./],
    // [ETokenType.FONTCOLOR, /./],
    [ETokenType.INLINELATEX, /^\$([^\$]+?)\$/],
    [ETokenType.BLOCKLATEX, /^\$\$([^\$]+?)\$\$/],
    [ETokenType.MACRO, /^{{(.*?)(?:\((.*?)\))?(?: ([^\$\$]*?))?}}/],
    [ETokenType.TEXT, /^.+?(?={{|\\|\$|''|__|\^\^|,,| {2}|\[\[|~~| {2,}|\(\(|\n|$)/]
];

let linkSyntax = /^(?:(.*?):)?(.*?)(\#[^\#]+?)?$/;

export abstract class Lexer {
    TokenList: [[ETokenType, RegExp]];
    envManager: EnvManager;

    constructor(envManager: EnvManager) {
        this.envManager = envManager;
    }

    scan(src: string): Components.IToken[] {
        let cap;
        let type: ETokenType;
        let syntax: RegExp;
        let toks: Components.IToken[] = [];

        WhileLoop:
            while (src) {
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

    makeToken(type: Components.ETokenType, cap): Components.IToken {
        throw new Error("Error: Override 'makeToken'");
    };
}

export class InlineLexer extends Lexer {
    TokenList = inlineTockens;

    constructor(envManager: EnvManager) {
        super(envManager);
    }

    makeToken(type, cap): Components.InlineToken {
        switch (type) {
            case ETokenType.ITALICBOLD:
                let bold = new Components.SimpleTag('b', null, cap[1]);
                return new Components.TagDecorator('i', null, bold);

            case ETokenType.ITALIC:
                return new Components.SimpleTag('i', null, cap[1]);

            case ETokenType.BOLD:
                return new Components.SimpleTag('b', null, cap[1]);

            case ETokenType.UNDERLINE:
                return new Components.SimpleTag('u', null, cap[1]);

            case ETokenType.SUP:
                return new Components.SimpleTag('sup', null, cap[1]);

            case ETokenType.SUB:
                return new Components.SimpleTag('sub', null, cap[1]);

            case ETokenType.DEL:
                return new Components.SimpleTag('del', null, cap[1]);

            case ETokenType.URLLINK:
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

            case ETokenType.LINK:
                let text = cap[2] || cap[1];
                let parsedLink = linkSyntax.exec(cap[1]).slice(1, 4);
                return this.envManager.makeToken(type, [...parsedLink, text]) as InlineToken;

            case ETokenType.NEWLINE:
                return new Components.SelfClosingSimpleTag('br', null);

            case ETokenType.RFOOTNOTE:
                return this.envManager.makeToken(ETokenType.RFOOTNOTE, this.scan(cap[1])) as InlineToken;

            case ETokenType.INLINELATEX:
                return new Components.Math(cap[1], false);

            case ETokenType.BLOCKLATEX:
                return new Components.Math(cap[1], true);

// //macro
// case ETokenType.MACRO:
//         return sh({type: 'macro', text: cap[3], macro: cap[1], param: (cap[2] ? cap[2].split(',') : null)});
//     src = src.substr(cap[0].length);
//     continue;
// }

            case ETokenType.ESCAPE:
                let char: string;
                switch (cap[1]) {
                    case 't':
                        char = '&emsp;';
                        break;
                    default:
                        char = cap[1];
                }
                return new Components.Text(char);

            case ETokenType.TEXT:
                return new Components.Text(cap[0]);
        }
    }
}
