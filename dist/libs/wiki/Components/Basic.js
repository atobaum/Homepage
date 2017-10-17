"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
class Text extends Components_1.InlineToken {
    constructor(text) {
        super([text]);
    }
    render() {
        return this.params[0];
    }
    plainText() {
        return this.params[0];
    }
}
exports.Text = Text;
class SelfClosingSimpleTag extends Components_1.InlineToken {
    constructor(tag, param) {
        super([tag, param]);
    }
    render() {
        return `<${this.params[0]}${this.params[1] ? ' ' + this.params[1] : ''}>`;
    }
    plainText() {
        return '';
    }
}
exports.SelfClosingSimpleTag = SelfClosingSimpleTag;
class SimpleTag extends Components_1.InlineToken {
    constructor(tag, param, text) {
        super([tag, param, text]);
    }
    plainText() {
        return this.params[2];
    }
    ;
    render() {
        return `<${this.params[0]}${this.params[1] ? ' ' + this.params[1] : ''}>${this.params[2]}</${this.params[0]}>`;
    }
}
exports.SimpleTag = SimpleTag;
class TagDecorator extends Components_1.InlineToken {
    constructor(tag, param, innerTok) {
        super([tag, param]);
        this.innerTok = innerTok;
    }
    plainText() {
        return this.innerTok.plainText();
    }
    render() {
        return `<${this.params[0]}${this.params[1] ? ' ' + this.params[1] : ''}>${this.innerTok.render()}</${this.params[0]}>`;
    }
}
exports.TagDecorator = TagDecorator;
class Line extends Components_1.BlockToken {
    constructor(toks) {
        super(toks);
    }

    render() {
        return this.renderContent();
    }
}
exports.Line = Line;
class EmptyLine extends Components_1.Macro {
    render() {
        return '';
    }
    plainText() {
        return '';
    }
}
exports.EmptyLine = EmptyLine;
class Section extends Components_1.BlockToken {
    constructor(index, toks) {
        super(toks);
        this.index = index;
    }

    render() {
        let formattedLevel = this.index.join('_');
        return '<h'
            + this.index.length
            + ' class="ui dividing header" id="'
            + "h_" + formattedLevel
            + '">'
            + `<a href="#rh_${formattedLevel}">${this.index.join('.')}</a> `
            + this.renderContent()
            + '</h'
            + this.index.length
            + '>';
    }
}
exports.Section = Section;
class Error extends Components_1.InlineToken {
    constructor(title, text) {
        super([title, text]);
    }
    render() {
        return `<div class="ui negative message"><div class="header">${this.params[0]}</div><p>${this.params[1]}</p></div>`;
    }
    plainText() {
        return '';
    }
}
exports.Error = Error;
