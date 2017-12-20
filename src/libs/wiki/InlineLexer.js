"use strict";
var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b;
            }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
exports.__esModule = true;
/**
 * Created by Le Reveur on 2017-05-03.
 */
var Components = require("./Components");
var Components_1 = require("./Components");
var inlineTockens = [
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
var linkSyntax = /^(?:(.*?):)?(.*?)(\#[^\#]+?)?$/;
var Lexer = /** @class */ (function () {
    function Lexer(envManager) {
        this.envManager = envManager;
    }

    Lexer.prototype.scan = function (src) {
        var cap;
        var type;
        var syntax;
        var toks = [];
        WhileLoop: while (src) {
            for (var _i = 0, _a = this.TokenList; _i < _a.length; _i++) {
                _b = _a[_i], type = _b[0], syntax = _b[1];
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
        var _b;
    };
    Lexer.prototype.makeToken = function (type, cap) {
        throw new Error("Error: Override 'makeToken'");
    };
    return Lexer;
}());
exports.Lexer = Lexer;
var InlineLexer = /** @class */ (function (_super) {
    __extends(InlineLexer, _super);
    function InlineLexer(envManager) {
        var _this = _super.call(this, envManager) || this;
        _this.TokenList = inlineTockens;
        return _this;
    }

    InlineLexer.prototype.makeToken = function (type, cap) {
        switch (type) {
            case Components_1.ETokenType.ITALICBOLD:
                var bold = new Components.SimpleTag('b', null, cap[1]);
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
                var linkType = void 0;
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
                var text = cap[2] || cap[1];
                var parsedLink = linkSyntax.exec(cap[1]).slice(1, 4);
                return this.envManager.makeToken(type, parsedLink.concat([text]));
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
                var char = void 0;
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
    };
    return InlineLexer;
}(Lexer));
exports.InlineLexer = InlineLexer;
