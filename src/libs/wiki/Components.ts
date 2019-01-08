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
    protected toks: Token[];

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

export * from './Components/Basic'
export * from './Components/Table'
export * from './Components/Link'
export * from './Components/Math'
export * from './Components/TOC'
export * from './Components/List'
export * from './Components/Syntax'
export * from './Components/Quote'
export * from './Components/Macro'
