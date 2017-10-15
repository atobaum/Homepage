/**
 * Created by Le Reveur on 2017-05-03.
 */
"use strict";
import * as InlineLexer from "./inline_lexer";
import * as Components from "./Components";
import {ETokenType} from "./Components";
import {EnvManager} from "./EnvManager";

let blockTokens = [
    // [ETokenType.SECTION, /^(={2,6}) (.+) ={2,6}\s*(\r?\n|$)/],
    [ETokenType.LI, /^(\s+)([*-]) (.+)(\r?\n|$)/],
    // [ETokenType.INDENT, /^:{1,}(.+)(\r?\n|$)/],
    [ETokenType.HR, /^-{3,}\s*(\r?\n|$)/],
    // [ETokenType.QUOTE, /^>(?:\((.*?)(?:\|(.*?))?\))? (.*?)(\r?\n|$)/],
    // [ETokenType.TEXTBOX, /^/],
    // [ETokenType.TABLE, /^(?:\|\|.*\r?\n|$)+/],
    [ETokenType.EMPTYLINE, /^(\s*\r?\n)+/],
    // [ETokenType.PARAGRAPH, /^(?:(?:\s*)\n)*([^\n]+?)(\r?\n|$)/],
    // [ETokenType.MACRO, /^{{(\S*?)(?:\((\S*?)\))?\s+([\s\S]*?)}}/],
    [ETokenType.COMMENT, /^## .*(\r?\n|$)/],
    [ETokenType.BLOCKLATEX, /^\$\$([^\$]+?)\$\$/]
];

export class BlockLexer extends InlineLexer.Lexer {
    TokenList = blockTokens;
    inlineLexer: InlineLexer.InlineLexer;

    constructor(envManager: EnvManager) {
        super(envManager);
    }

    makeToken(type, cap): Components.IToken {
        switch (type) {
            case ETokenType.SECTION:
                return this.envManager.makeToken(type, cap);

            case ETokenType.EMPTYLINE:
                return new Components.EmptyLine();

            case ETokenType.LIST:
                throw new Error('');

            case ETokenType.BLOCKLATEX:
                throw new Error('');

            case ETokenType.INDENT:
                throw new Error('');

            case ETokenType.QUOTE:
                throw new Error('');

            case ETokenType.COMMENT:
                return new Components.Text('');

            case ETokenType.TABLE:
                throw new Error('');

            case ETokenType.HR:
                return new Components.SelfClosingSimpleTag('hr', null);

            case ETokenType.MACRO:
                throw new Error('');
        }
    }
}