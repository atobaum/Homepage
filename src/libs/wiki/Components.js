/**
 * Created by Le Reveur on 2017-09-26.
 */
/**
 * @todo footnote
 * @todo link
 * @todo extlink
 * @todo plaintext
 * @todo escape
 * @todo italicbold
 * @todo newline
 * @todo paragraph
 * @todo section
 * @todo table
 * @todo title
 * @todo
 */
'use strict';
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var ETokenType;
(function (ETokenType) {
    ETokenType[ETokenType["TITLE"] = 0] = "TITLE";
    ETokenType[ETokenType["LINETEXT"] = 1] = "LINETEXT";
    ETokenType[ETokenType["INDENT"] = 2] = "INDENT";
    ETokenType[ETokenType["ESCAPE"] = 3] = "ESCAPE";
    ETokenType[ETokenType["ITALIC"] = 4] = "ITALIC";
    ETokenType[ETokenType["BOLD"] = 5] = "BOLD";
    ETokenType[ETokenType["ITALICBOLD"] = 6] = "ITALICBOLD";
    ETokenType[ETokenType["UNDERLINE"] = 7] = "UNDERLINE";
    ETokenType[ETokenType["SUP"] = 8] = "SUP";
    ETokenType[ETokenType["SUB"] = 9] = "SUB";
    ETokenType[ETokenType["URLLINK"] = 10] = "URLLINK";
    ETokenType[ETokenType["LINK"] = 11] = "LINK";
    ETokenType[ETokenType["DEL"] = 12] = "DEL";
    ETokenType[ETokenType["NEWLINE"] = 13] = "NEWLINE";
    ETokenType[ETokenType["RFOOTNOTE"] = 14] = "RFOOTNOTE";
    ETokenType[ETokenType["FOOTNOTE"] = 15] = "FOOTNOTE";
    ETokenType[ETokenType["FONTSIZE"] = 16] = "FONTSIZE";
    ETokenType[ETokenType["FONTCOLOR"] = 17] = "FONTCOLOR";
    ETokenType[ETokenType["TEXT"] = 18] = "TEXT";
    ETokenType[ETokenType["INLINELATEX"] = 19] = "INLINELATEX";
    ETokenType[ETokenType["MACRO"] = 20] = "MACRO";
    ETokenType[ETokenType["BLOCKLATEX"] = 21] = "BLOCKLATEX";
    ETokenType[ETokenType["SECTION"] = 22] = "SECTION";
    ETokenType[ETokenType["LIST"] = 23] = "LIST";
    ETokenType[ETokenType["LI"] = 24] = "LI";
    ETokenType[ETokenType["HR"] = 25] = "HR";
    ETokenType[ETokenType["BR"] = 26] = "BR";
    ETokenType[ETokenType["QUOTE"] = 27] = "QUOTE";
    ETokenType[ETokenType["TABLE"] = 28] = "TABLE";
    ETokenType[ETokenType["EMPTYLINE"] = 29] = "EMPTYLINE";
    ETokenType[ETokenType["PARAGRAPH"] = 30] = "PARAGRAPH";
    ETokenType[ETokenType["COMMENT"] = 31] = "COMMENT";
})(ETokenType = exports.ETokenType || (exports.ETokenType = {}));
var Token = /** @class */ (function () {
    function Token() {
    }
    return Token;
}());
exports.Token = Token;
var InlineToken = /** @class */ (function () {
    function InlineToken(params) {
        this.params = params;
    }
    return InlineToken;
}());
exports.InlineToken = InlineToken;
var BlockToken = /** @class */ (function () {
    function BlockToken(toks) {
        this.toks = toks;
    }
    BlockToken.prototype.renderContent = function () {
        return this.toks.reduce(function (str, tok) { return str + tok.render(); }, '');
    };
    BlockToken.prototype.plainText = function () {
        return this.toks.reduce(function (str, tok) { return str + tok.plainText(); }, '');
    };
    return BlockToken;
}());
exports.BlockToken = BlockToken;
var Macro = /** @class */ (function () {
    function Macro() {
    }
    return Macro;
}());
exports.Macro = Macro;
var Li = /** @class */ (function (_super) {
    __extends(Li, _super);
    function Li(toks, ordered, level) {
        var _this = _super.call(this, toks) || this;
        _this.child = null;
        _this.ordered = ordered;
        _this.level = level;
        return _this;
    }
    Li.prototype.render = function () {
        return "<li>" + this.renderContent() + (this.child ? this.child.render() : '') + "</li>";
    };
    return Li;
}(BlockToken));
exports.Li = Li;
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(list, ordered, isRoot) {
        if (isRoot === void 0) { isRoot = false; }
        var _this = _super.call(this, list) || this;
        _this.ordered = ordered;
        _this.isRoot = isRoot;
        return _this;
    }
    List.prototype.render = function () {
        var result = '';
        result += this.isRoot ? '<div class="wiki_list ui list">' : '';
        result += this.ordered ? '<ol>' : '<ul>';
        result += this.renderContent();
        result += this.ordered ? '</ol>' : '</ul>';
        result += this.isRoot ? '</div>' : '';
        return result;
    };
    return List;
}(BlockToken));
exports.List = List;
// export class TOC extends BlockToken {
//     constructor(toks: Section[]) {
//         super(toks);
//     }
//
//     createSection(toks, level) {
//         let section = new Section(toks, level);
//         while (this.curSection.level >= section.level) {
//             this.curSection = this.curSection.parent;
//         }
//         section.parent = this.curSection;
//         section.index = this.curSection.subsection.length;
//         this.curSection.subsection.push(section);
//         this.curSection = section;
//         return this.curSection;
//     }
//
//     render() {
//         this.curSection.root.renderTOC()
//
//     }
// }
//
// export class Section extends BlockToken{
//     level: number;
//     constructor(toks: InlineToken[], level: number) {
//         super(toks);
//         this.level = level;
//     }
//
//     render() {
//         let indexList = this.indexList;
//         let formattedLevel = indexList.join('_');
//         return '<h'
//             + (indexList.length)
//             + ' class="ui dividing header" id="'
//             + "h_" + formattedLevel
//             + '">'
//             + `<a href="#rh_${formattedLevel}">${indexList.join('.')}</a> `
//             + this.renderContent()
//             + '</h'
//             + indexList.length
//             + '>';
//     }
// }
var Footnote = /** @class */ (function (_super) {
    __extends(Footnote, _super);
    function Footnote(index, inlikeToks) {
        var _this = _super.call(this, inlikeToks) || this;
        _this.index = index;
        return _this;
    }
    Footnote.prototype.render = function () {
        return "<li><a class=\"wiki_fn\" id=\"fn_" + this.index + "\" href=\"#rfn_" + this.index + "\">[" + this.index + "]</a> " + this.renderContent() + "</li>";
    };
    Footnote.prototype.getRef = function () {
        return new RFootnote(this.index, this.plainText());
    };
    return Footnote;
}(BlockToken));
exports.Footnote = Footnote;
var RFootnote = /** @class */ (function (_super) {
    __extends(RFootnote, _super);
    function RFootnote(index, plainText) {
        return _super.call(this, [index, plainText]) || this;
    }
    RFootnote.prototype.render = function () {
        return "<sup id=\"rfn_" + this.params[0] + "\"><a href=\"#fn_" + this.params[0] + "\">[" + this.params[1] + "]</a></sup>";
    };
    RFootnote.prototype.plainText = function () {
        return "[" + this.params[0] + "]";
    };
    return RFootnote;
}(InlineToken));
exports.RFootnote = RFootnote;
__export(require("./Components/Basic"));
__export(require("./Components/Table"));
__export(require("./Components/Link"));
__export(require("./Components/Math"));
__export(require("./Components/TOC"));
