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
    ETokenType[ETokenType["INDENT"] = 0] = "INDENT";
    ETokenType[ETokenType["ESCAPE"] = 1] = "ESCAPE";
    ETokenType[ETokenType["ITALIC"] = 2] = "ITALIC";
    ETokenType[ETokenType["BOLD"] = 3] = "BOLD";
    ETokenType[ETokenType["ITALICBOLD"] = 4] = "ITALICBOLD";
    ETokenType[ETokenType["UNDERLINE"] = 5] = "UNDERLINE";
    ETokenType[ETokenType["SUP"] = 6] = "SUP";
    ETokenType[ETokenType["SUB"] = 7] = "SUB";
    ETokenType[ETokenType["URLLINK"] = 8] = "URLLINK";
    ETokenType[ETokenType["LINK"] = 9] = "LINK";
    ETokenType[ETokenType["DEL"] = 10] = "DEL";
    ETokenType[ETokenType["NEWLINE"] = 11] = "NEWLINE";
    ETokenType[ETokenType["RFOOTNOTE"] = 12] = "RFOOTNOTE";
    ETokenType[ETokenType["RFOOTNOTE"] = 13] = "RFOOTNOTE";
    ETokenType[ETokenType["FONTSIZE"] = 14] = "FONTSIZE";
    ETokenType[ETokenType["FONTCOLOR"] = 15] = "FONTCOLOR";
    ETokenType[ETokenType["TEXT"] = 16] = "TEXT";
    ETokenType[ETokenType["INLINELATEX"] = 17] = "INLINELATEX";
    ETokenType[ETokenType["MACRO"] = 18] = "MACRO";
    ETokenType[ETokenType["BLOCKLATEX"] = 19] = "BLOCKLATEX";
    ETokenType[ETokenType["SECTION"] = 20] = "SECTION";
    ETokenType[ETokenType["LIST"] = 21] = "LIST";
    ETokenType[ETokenType["LI"] = 22] = "LI";
    ETokenType[ETokenType["HR"] = 23] = "HR";
    ETokenType[ETokenType["BR"] = 24] = "BR";
    ETokenType[ETokenType["QUOTE"] = 25] = "QUOTE";
    ETokenType[ETokenType["TABLE"] = 26] = "TABLE";
    ETokenType[ETokenType["EMPTYLINE"] = 27] = "EMPTYLINE";
    ETokenType[ETokenType["PARAGRAPH"] = 28] = "PARAGRAPH";
    ETokenType[ETokenType["COMMENT"] = 29] = "COMMENT";
})(ETokenType = exports.ETokenType || (exports.ETokenType = {}));
class Token {
}
exports.Token = Token;
class InlineToken {
    constructor(params) {
        this.params = params;
    }
}
exports.InlineToken = InlineToken;
class BlockToken {
    constructor(toks) {
        this.toks = toks;
    }
    renderContent() {
        return this.toks.reduce((str, tok) => str + tok.render(), '');
    }
    plainText() {
        return this.toks.reduce((str, tok) => str + tok.plainText(), '');
    }
}
exports.BlockToken = BlockToken;
class Macro {
}
exports.Macro = Macro;
class Li extends BlockToken {
    constructor(toks, ordered, level) {
        super(toks);
        this.child = null;
        this.ordered = ordered;
        this.level = level;
    }
    render() {
        return `<li>${this.renderContent()}${this.child ? this.child.render() : ''}</li>`;
    }
}
exports.Li = Li;
class List extends BlockToken {
    constructor(list, ordered, isRoot = false) {
        super(list);
        this.ordered = ordered;
        this.isRoot = isRoot;
    }
    render() {
        let result = '';
        result += this.isRoot ? '<div class="wiki_list ui list">' : '';
        result += this.ordered ? '<ol>' : '<ul>';
        result += this.renderContent();
        result += this.ordered ? '</ol>' : '</ul>';
        result += this.isRoot ? '</div>' : '';
        return result;
    }
}
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
class Footnote extends BlockToken {
    constructor(index, inlikeToks) {
        super(inlikeToks);
        this.index = index;
    }
    render() {
        return `<li><a class="wiki_fn" id="fn_${this.index}" href="#rfn_${this.index}">[${this.index}]</a> ${this.renderContent()}</li>`;
    }
    getRef() {
        return new RFootnote(this.index, this.plainText());
    }
}
exports.Footnote = Footnote;
class RFootnote extends InlineToken {
    constructor(index, plainText) {
        super([index, plainText]);
    }
    render() {
        return `<sup id="rfn_${this.params[0]}"><a href="#fn_${this.params[0]}">[${this.params[1]}]</a></sup>`;
    }
    plainText() {
        return `[${this.params[0]}]`;
    }
}
exports.RFootnote = RFootnote;
__export(require("./Components/Basic"));
__export(require("./Components/Table"));
__export(require("./Components/Link"));
__export(require("./Components/Math"));
