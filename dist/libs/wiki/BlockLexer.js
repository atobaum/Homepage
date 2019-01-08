/**
 * Created by Le Reveur on 2017-05-03.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InlineLexer = require("./InlineLexer");
const Components = require("./Components");
const Components_1 = require("./Components");
const Lexer_1 = require("./Lexer");
const Table_1 = require("./Components/Table");
function table(cap, em, il) {
    let caps = cap[0].split('||');
    caps.shift();
    let head = caps.pop().trim() == 'h';
    return new Table_1.TRow(caps.map(item => new Table_1.TCell(il.scan(item.trim()), head)));
}
class BlockLexer extends Lexer_1.default {
    constructor(envManager) {
        super(envManager, 'Block', new InlineLexer.InlineLexer(envManager));
        this.TokenList = [
            [/^(\s*\r?\n)+/, cap => new Components.EmptyLine()],
            [/^([=#]{1,6}) (.+)\s*(\r?\n|$)/, (cap, em, il) => em.makeToken(Components_1.ETokenType.SECTION, [cap[1].length, il.scan(cap[2])])],
            [/^(\s*)([*-]) (.+)(\r?\n|$)/, (cap, _, il) => new Components.Li(il.scan(cap[3]), cap[2] == '-', cap[1].length)],
            // [ETokenType.INDENT, /^:{1,}(.+)(\r?\n|$)/],
            [/^-{3,}\s*(\r?\n|$)/, cap => new Components.SelfClosingSimpleTag('hr', null)],
            [/^\|.*?(\r?\n|$)/, table],
            // [/^{{(\S*?)(?:\((\S*?)\))?\s+([\s\S]*?)}}/],
            // [/^## .*(\r?\n|$)/, cap=>new Components.Text('123')], //comment
            [/^```(.*)(?:\r?\n|$)([\s\S]+?)(?:\r?\n|$)```(\r?\n|$)/, (cap) => new Components.Code(cap[2], cap[1])],
            [/^\$\$([^\$]+?)\$\$/, cap => new Components.Math(cap[1], false)],
            [/^> (.*)(\r?\n|$)/, (cap, _, il) => new Components.Quote(il.scan(cap[1]))],
            [/^\\([\w]+)(?:\{([\w]+?)\})?\s?/, (cap, em, il) => Components.Macro.build(cap[1], cap[2], em)],
            [/^(.*?)(?:\r?\n|$)/, (cap, _, il) => new Components.Line(il.scan(cap[1]))] //linetext
        ];
    }
}
exports.default = BlockLexer;
