/**
 * Created by Le Reveur on 2017-05-03.
 */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var InlineLexer = require("./inline_lexer");
var Components = require("./Components");
var Components_1 = require("./Components");
var blockTokens = [
    [Components_1.ETokenType.SECTION, /^(={2,6}) (.+) ={2,6}\s*(\r?\n|$)/],
    [Components_1.ETokenType.LI, /^(\s+)([*-]) (.+)(\r?\n|$)/],
    // [ETokenType.INDENT, /^:{1,}(.+)(\r?\n|$)/],
    [Components_1.ETokenType.HR, /^-{3,}\s*(\r?\n|$)/],
    // [ETokenType.QUOTE, /^>(?:\((.*?)(?:\|(.*?))?\))? (.*?)(\r?\n|$)/],
    // [ETokenType.TEXTBOX, /^/],
    // [ETokenType.TABLE, /^(?:\|\|.*\r?\n|$)+/],
    [Components_1.ETokenType.EMPTYLINE, /^(\s*\r?\n)+/],
    // [ETokenType.PARAGRAPH, /^(?:(?:\s*)\n)*([^\n]+?)(\r?\n|$)/],
    // [ETokenType.MACRO, /^{{(\S*?)(?:\((\S*?)\))?\s+([\s\S]*?)}}/],
    [Components_1.ETokenType.COMMENT, /^## .*(\r?\n|$)/],
    [Components_1.ETokenType.BLOCKLATEX, /^\$\$([^\$]+?)\$\$/],
    [Components_1.ETokenType.LINETEXT, /^(.*?)(?:r?\n|$)/]
];
var BlockLexer = /** @class */ (function (_super) {
    __extends(BlockLexer, _super);
    function BlockLexer(envManager) {
        var _this = _super.call(this, envManager) || this;
        _this.TokenList = blockTokens;
        _this.inlineLexer = new InlineLexer.InlineLexer(envManager);
        return _this;
    }
    BlockLexer.prototype.makeToken = function (type, cap) {
        switch (type) {
            case Components_1.ETokenType.SECTION:
                return this.envManager.makeToken(type, [cap[1].length - 1, this.inlineLexer.scan(cap[2])]);
            case Components_1.ETokenType.EMPTYLINE:
                return new Components.EmptyLine();
            case Components_1.ETokenType.LIST:
                throw new Error('');
            case Components_1.ETokenType.BLOCKLATEX:
                throw new Error('');
            case Components_1.ETokenType.INDENT:
                throw new Error('');
            case Components_1.ETokenType.QUOTE:
                throw new Error('');
            case Components_1.ETokenType.COMMENT:
                return new Components.Text('');
            case Components_1.ETokenType.TABLE:
                throw new Error('');
            case Components_1.ETokenType.HR:
                return new Components.SelfClosingSimpleTag('hr', null);
            case Components_1.ETokenType.MACRO:
                throw new Error('');
            case Components_1.ETokenType.LINETEXT:
                return new Components.Line(this.inlineLexer.scan(cap[1]));
        }
    };
    return BlockLexer;
}(InlineLexer.Lexer));
exports["default"] = BlockLexer;
