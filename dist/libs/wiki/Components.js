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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
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
class Token {
    parse(toks) {
        return this;
    }
}
exports.Token = Token;
class BigToken extends Token {
    constructor(toks, needParse = false) {
        super();
        this.toks = toks;
    }
    renderContent() {
        if (this.toks.length)
            return this.toks.reduce((str, tok) => str + tok.render(), '');
        else
            return '';
    }
    plainText() {
        if (this.toks.length)
            return this.toks.reduce((str, tok) => str + tok.plainText(), '');
        else
            return '';
    }
}
exports.BigToken = BigToken;
__export(require("./Components/Basic"));
__export(require("./Components/Table"));
__export(require("./Components/Link"));
__export(require("./Components/Math"));
__export(require("./Components/TOC"));
__export(require("./Components/List"));
__export(require("./Components/Syntax"));
__export(require("./Components/Quote"));
