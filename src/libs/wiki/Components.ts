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
export enum ETokenType{
    TITLE,
    LINETEXT,
    INDENT,
    ESCAPE, ITALIC, BOLD, ITALICBOLD, UNDERLINE, SUP, SUB, URLLINK, LINK, DEL, NEWLINE, RFOOTNOTE, FOOTNOTE, FONTSIZE, FONTCOLOR, TEXT, INLINELATEX, MACRO, BLOCKLATEX, SECTION, LIST, LI, HR, BR, QUOTE, TABLE, EMPTYLINE, PARAGRAPH, COMMENT
}

export abstract class Token {
    parse(toks: Token[]): Token {
        return this;
    }

    abstract render(): string;

    abstract plainText(): string;
}

export abstract class BigToken extends Token {
    needParse: boolean;
    private toks: Token[];

    abstract render();

    constructor(toks: Token[], needParse: boolean = false) {
        super();
        this.toks = toks;
    }

    renderContent(): string {
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

export abstract class TokenFactory {
    static scan(src: string) {
        throw new Error('Implement scan');
    };
}

// export class TOC extends BigToken {
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
// export class Section extends BigToken{
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

export class Footnote extends BigToken {
    index: number;

    constructor(index: number, inlikeToks: Token[]) {
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

export class RFootnote extends Token {
    private index: number;
    private _plainText: string;
    constructor(index: number, plainText: string) {
        super();
        this.index = index;
        this._plainText = plainText;
    }

    render() {
        return `<sup id="rfn_${this.index}"><a href="#fn_${this.index}">[${this._plainText}]</a></sup>`;
    }

    plainText() {
        return this._plainText;
    }
}

export * from './Components/Basic'
export * from './Components/Table'
export * from './Components/Link'
export * from './Components/Math'
export * from './Components/TOC'
export * from './Components/List'