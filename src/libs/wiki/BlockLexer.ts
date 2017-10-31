/**
 * Created by Le Reveur on 2017-05-03.
 */
"use strict";
import * as InlineLexer from "./InlineLexer";
import * as Components from "./Components";
import {ETokenType, Token} from "./Components";
import {EnvManager} from "./EnvManager";
import Lexer from "./Lexer";
import {TCell, TRow} from "./Components/Table";

function table(cap, em, il) {
    let caps = cap[0].split('||');
    caps.shift();
    let head = caps.pop().trim() == 'h';
    return new TRow(caps.map(item => new TCell(il.scan(item.trim()), head)));
}
export default class BlockLexer extends Lexer {
    TokenList = [
        [ETokenType.SECTION, /^(={2,6}) (.+) ={2,6}\s*(\r?\n|$)/, (cap, em, il) => em.makeToken(ETokenType.SECTION, [cap[1].length - 1, il.scan(cap[2])])],
        [ETokenType.LI, /^(\s+)([*-]) (.+)(\r?\n|$)/, (cap, _, il) => new Components.Li(il.scan(cap[3]), cap[2] == '-', cap[1].length)],
        // [ETokenType.INDENT, /^:{1,}(.+)(\r?\n|$)/],
        [ETokenType.HR, /^-{3,}\s*(\r?\n|$)/, cap => new Components.SelfClosingSimpleTag('hr', null)],
        // [ETokenType.QUOTE, /^>(?:\((.*?)(?:\|(.*?))?\))? (.*?)(\r?\n|$)/],
        // [ETokenType.TEXTBOX, /^/],
        [ETokenType.TABLE, /^\|\|.*?(\r?\n|$)/, table],
        [ETokenType.EMPTYLINE, /^(\s*\r?\n)+/, cap => new Components.EmptyLine()],
        // [ETokenType.PARAGRAPH, /^(?:(?:\s*)\n)*([^\n]+?)(\r?\n|$)/],
        // [ETokenType.MACRO, /^{{(\S*?)(?:\((\S*?)\))?\s+([\s\S]*?)}}/],
        [ETokenType.COMMENT, /^## .*(\r?\n|$)/, () => null],
        [ETokenType.BLOCKLATEX, /^\$\$([^\$]+?)\$\$/, cap => new Components.Math(cap[1], false)],
        [ETokenType.LINETEXT, /^(.*?)(?:\r?\n|$)/, (cap, _, il) => new Components.Line(il.scan(cap[1]))]
    ] as [[ETokenType, RegExp, (cap: any, em: any, lexer: any) => Token]];
    constructor(envManager: EnvManager) {
        super(envManager, 'Block', new InlineLexer.InlineLexer(envManager));
    }
}