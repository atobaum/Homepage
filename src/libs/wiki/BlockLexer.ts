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
        [/^(\s*\r?\n)+/, cap => new Components.EmptyLine()], //emptyline
        [/^([=#]{1,6}) (.+)\s*(\r?\n|$)/, (cap, em, il) => em.makeToken(ETokenType.SECTION, [cap[1].length, il.scan(cap[2])])], //headings
        [/^(\s*)([*-]) (.+)(\r?\n|$)/, (cap, _, il) => new Components.Li(il.scan(cap[3]), cap[2] == '-', cap[1].length)], //list
        // [ETokenType.INDENT, /^:{1,}(.+)(\r?\n|$)/],
        [/^-{3,}\s*(\r?\n|$)/, cap => new Components.SelfClosingSimpleTag('hr', null)], //hr
        [/^\|.*?(\r?\n|$)/, table], //table
        // [/^{{(\S*?)(?:\((\S*?)\))?\s+([\s\S]*?)}}/],
        // [/^## .*(\r?\n|$)/, cap=>new Components.Text('123')], //comment
        [/^```(.*)(?:\r?\n|$)([\s\S]+?)(?:\r?\n|$)```(\r?\n|$)/, (cap) => new Components.Code(cap[2], cap[1])], //blockcode
        [/^\$\$([^\$]+?)\$\$/, cap => new Components.Math(cap[1], false)], //blocklatex,
        [/^> (.*)(\r?\n|$)/, (cap, _, il) => new Components.Quote(il.scan(cap[1]))], //blockquote
        [/^(.*?)(?:\r?\n|$)/, (cap, _, il) => new Components.Line(il.scan(cap[1]))] //linetext
    ] as [[RegExp, (cap: any, em: any, lexer: any) => Token]];
    constructor(envManager: EnvManager) {
        super(envManager, 'Block', new InlineLexer.InlineLexer(envManager));
    }
}