/**
 * Created by Le Reveur on 2017-10-16.
 */
import {BigToken, Token} from "../Components";
import {TOC} from "./TOC";
export class Text extends Token {
    private text;
    constructor(text) {
        super();
        this.text = text;
    }

    render() {
        return this.text;
    }

    plainText() {
        return this.text;
    }
}

export class SelfClosingSimpleTag extends Token {
    private tag: string;
    private param: string;
    constructor(tag: string, param: string) {
        super();
        this.tag = tag;
        this.param = param;
    }

    render() {
        return `<${this.tag}${this.param ? ' ' + this.param : ''}>`;
    }

    plainText() {
        return '';
    }
}

export class SimpleTag extends Token {
    private tag: string;
    private param: string;
    private text: string;
    constructor(tag: string, param: string, text: string) {
        super();
        this.tag = tag;
        this.param = param;
        this.text = text;
    }

    plainText() {
        return this.text;
    };

    render() {
        return `<${this.tag}${this.param ? ' ' + this.param : ''}>${this.text}</${this.tag}>`;
    }
}

export class TagDecorator extends Token {
    private tag: string;
    private param: string;
    private innerTok: Token;

    constructor(tag: string, param: string, innerTok: Token) {
        super();
        this.tag = tag;
        this.param = param;
        this.innerTok = innerTok;
    }

    plainText() {
        return this.innerTok.plainText();
    }

    render() {
        return `<${this.tag}${this.param ? ' ' + this.param : ''}>${this.innerTok.render()}</${this.tag}>`;
    }
}

export class Line extends BigToken {
    constructor(toks) {
        super(toks);
    }

    parse(toks) {
        while (toks[0] && toks[0] instanceof Line) {
            this.toks = this.toks.concat(toks.shift().toks);
        }
        return new Paragraph(this.toks);
    }

    render() {
        return this.renderContent();
    }
}

class Paragraph extends BigToken {
    constructor(toks) {
        super(toks);
    }

    render() {
        return `<p>${this.renderContent()}</p>`;
    }
}

export class EmptyLine extends Token {
    render() {
        return '';
    }

    plainText() {
        return '';
    }

}

export class Section extends BigToken {
    private _toc: TOC;

    constructor(toks) {
        super(toks);
    }

    set toc(toc: TOC) {
        this._toc = toc;
    }

    render() {
        let indexList = this._toc.indexList;
        let formattedLevel = indexList.join('_');
        return '<h'
            + indexList.length
            + ' class="ui dividing header" id="'
            + "h_" + formattedLevel
            + '">'
            + `<a href="#rh_${formattedLevel}">${indexList.join('.')}</a> `
            + this.renderContent()
            + '</h'
            + indexList.length
            + '>';
    }
}

export class Error extends Token {
    private title: string;
    private text: string;
    constructor(title, text) {
        super();
        this.title = title;
        this.text = text;
    }

    render() {
        return `<div class="ui negative message"><div class="header">${this.title}</div><p>${this.text}</p></div>`
    }

    plainText() {
        return ''
    }
}