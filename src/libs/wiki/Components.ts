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
    LINETEXT,
    INDENT,
    ESCAPE, ITALIC, BOLD, ITALICBOLD, UNDERLINE, SUP, SUB, URLLINK, LINK, DEL, NEWLINE, RFOOTNOTE, FOOTNOTE, FONTSIZE, FONTCOLOR, TEXT, INLINELATEX, MACRO, BLOCKLATEX, SECTION, LIST, LI, HR, BR, QUOTE, TABLE, EMPTYLINE, PARAGRAPH, COMMENT
}

export interface IToken {
    render(): string;
    plainText(): string;
}

export abstract class Token {
    abstract render(): string;

    abstract plainText(): string;
}

export abstract class InlineToken implements IToken {
    protected params: any[];

    constructor(params: any[]) {
        this.params = params;
    }

    abstract render();

    abstract plainText();
}

export abstract class BlockToken implements IToken {
    private toks: IToken[];

    abstract render();

    constructor(toks: IToken[]) {
        this.toks = toks;
    }

    renderContent(): string {
        return this.toks.reduce((str, tok) => str + tok.render(), '');
    }

    plainText() {
        return this.toks.reduce((str, tok) => str + tok.plainText(), '');
    }
}

export abstract class Macro implements IToken {
    abstract render();

    abstract plainText();
}

export class Li extends BlockToken {
    ordered: boolean;
    level: number;
    child: List = null;

    constructor(toks: InlineToken[], ordered: boolean, level: number) {
        super(toks);
        this.ordered = ordered;
        this.level = level;
    }

    render() {
        return `<li>${this.renderContent()}${this.child ? this.child.render() : ''}</li>`;
    }

}
export class List extends BlockToken {
    ordered: boolean;
    isRoot: boolean;

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

export class Footnote extends BlockToken {
    index: number;

    constructor(index: number, inlikeToks: InlineToken[]) {
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

export class RFootnote extends InlineToken {
    constructor(index: number, plainText: string) {
        super([index, plainText]);
    }

    render() {
        return `<sup id="rfn_${this.params[0]}"><a href="#fn_${this.params[0]}">[${this.params[1]}]</a></sup>`;
    }

    plainText() {
        return `[${this.params[0]}]`;
    }
}

export * from './Components/Basic'
export * from './Components/Table'
export * from './Components/Link'
export * from './Components/Math'
export * from './Components/TOC'