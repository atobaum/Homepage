"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
class Text extends Components_1.Token {
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
exports.Text = Text;
class SelfClosingSimpleTag extends Components_1.Token {
    constructor(tag, param) {
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
exports.SelfClosingSimpleTag = SelfClosingSimpleTag;
class SimpleTag extends Components_1.Token {
    constructor(tag, param, text) {
        super();
        this.tag = tag;
        this.param = param;
        this.text = text;
    }
    plainText() {
        return this.text;
    }
    ;
    render() {
        return `<${this.tag}${this.param ? ' ' + this.param : ''}>${this.text}</${this.tag}>`;
    }
}
exports.SimpleTag = SimpleTag;
class TagDecorator extends Components_1.Token {
    constructor(tag, param, innerTok) {
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
exports.TagDecorator = TagDecorator;
class Line extends Components_1.BigToken {
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
exports.Line = Line;
class Paragraph extends Components_1.BigToken {
    constructor(toks) {
        super(toks);
    }
    render() {
        return `<p>${this.renderContent()}</p>`;
    }
}
class EmptyLine extends Components_1.Token {
    render() {
        return '';
    }
    plainText() {
        return '';
    }
}
exports.EmptyLine = EmptyLine;
class Section extends Components_1.BigToken {
    constructor(toks) {
        super(toks);
    }
    set toc(toc) {
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
exports.Section = Section;
class ErrorToken extends Components_1.Token {
    constructor(title, text) {
        super();
        this.title = title;
        this.text = text;
    }
    render() {
        return `<div class="ui negative message"><div class="header">${this.title}</div><p>${this.text}</p></div>`;
    }
    plainText() {
        return '';
    }
}
exports.ErrorToken = ErrorToken;
class Footnote extends Components_1.BigToken {
    constructor(toks) {
        super(toks);
    }
    render() {
        return `<span><i class="talk outline icon wiki_fn" data-html='${this.renderContent()}'></i></span>`;
    }
}
exports.Footnote = Footnote;
