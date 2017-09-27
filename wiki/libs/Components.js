/**
 * Created by Le Reveur on 2017-09-26.
 */
'use strict';
let InlineLexer = require('./inline_lexer');
let Token = class {
    constructor(toks) {
        this.toks = toks;
    }

    render() {
        return this.renderContent();
    }

    renderContent() {
        if (this.toks.length === 0)
            return "Error: content of a Token is empty.";
        else
            return this.toks.reduce((a, b) => a + b.render(), '');
    }

    get plainText() {
        return ' ';
    }
};

module.exports.Token = Token;

class MacroManager {
    constructor() {
        this.macro = {}
    }

    addMacro(name, macroTokenFactory) {
        this.macro[name.toLowerCase()] = macroTokenFactory;
    }

    getMacro(name, params, content) {
        let macroFactory = this.macro[name.toLowerCase()];
        if (macroFactory) {
            return macroFactory(params, content);
        }
        else {
            return new Error('Macro Error', 'Macro ' + name + ' doesn\'t supported.')
        }
    }
}


class Macro extends Token {
    constructor(params, content) {
        super(null);
        this.content = content;
    }

    render() {
        return ""
    }
}

class TRow extends Token {
    constructor(row) {
        let option = row.pop();
        super(row.map(cell => InlineLexer.scan(cell)));
        this.option = option;
    }

    render() {
        let result = '';
        if (this.option === 'h') {
            result += '<thead><tr>';
            result += this.toks.reduce((str, cell) => str + `<th>${cell.render()}</th>`, '');
            result += '</thead></tr>';
        } else {
            result += '<tr>';
            result += this.toks.reduce((str, cell) => str + `<td>${cell.render()}</th>`, '');
            result += '<tr>';
        }
        return result;
    }
}

module.exports.Table = class Table extends Token {
    constructor(text) {
        super(text.split(/\r?\n/).map(row => {
            return new TRow(row.split('||').slice(1).map(cell => cell.trim()));
        }));
    }

    render() {
        return `<table class="ui celled collapsing table">${this.renderContent()}</table>`;
    }
};
class SimpleTag extends Token {
    constructor(tag, param, text) {
        super(null);
        this.tag = tag;
        this.param = param;
        this.text = text;
    }

    get plainText() {
        return this.text;
    };

    render() {
        return `<${this.tag}${this.param ? ' ' + this.param : ''}>${this.text}</${this.tag}>`;
    }
}

module.exports.Italic = class extends SimpleTag {
    constructor(text) {
        super('i', null, text);
    }
};
module.exports.Bold = class Bold extends SimpleTag {
    constructor(text) {
        super('b', null, text);
    }
};
module.exports.Underline = class extends SimpleTag {
    constructor(text) {
        super('u', null, text);
    }
};
module.exports.Sup = class extends SimpleTag {
    constructor(text) {
        super('sup', null, text);
    }
};
module.exports.Sub = class extends SimpleTag {
    constructor(text) {
        super('sub', null, text);
    }
};
module.exports.Del = class extends SimpleTag {
    constructor(text) {
        super('del', null, text);
    }
};
module.exports.Newline = class extends Token {
    render() {
        return '<br />'
    }
};
module.exports.Hr = class extends Token {
    render() {
        return '<hr />'
    }
};
module.exports.ExtLink = class ExtLink extends Token {
    constructor(type, text, href) {
        super(null);
        this.type = type;
        this.text = text || href;
        this.href = href;
    }

    render() {
        switch (this.type) {
            case 'img':
            case '이미지':
                return `</p><img class="wiki_img" src="${this.href}" alt="${this.text}"><p>`;
            default:
                return `<a class="wiki_ext_link" href="${this.href}" title="${this.text}">${this.text}<i class="external square icon"></i></a>`;
        }
    }

    get plainText() {
        return this.text;
    }
};


module.exports.List = class extends Token {
    constructor(ordered, list, isRoot = false) {
        super();
        this.ordered = ordered;
        this.list = list;
        this.isRoot = isRoot;
    }

    get plainText() {

    }

    render() {
        let result = this.isRoot ? '<div class="wiki_list">' : '';
        result += `<${this.ordered ? 'o' : 'u'}l ${this.isRoot ? 'class = "ui list"' : ''}>`;
        result += this.list.map(item => `<li>${item.text + (item.child ? this.list(item.child, 1) : '')}</li>`);

        for (let i = 0; i < this.list.length; i++) {
            let item = this.list[i];
            result += `<li>${item.text + (item.child ? this.list(item.child, 1) : '')}</li>`;
        }
        result += ordered ? '</ol>' : '</ul>';
        result += (this.isRoot ? '</div>' : '');
        return result;

    }
};
module.exports.Error = class Error extends Token {
    constructor(title, text) {
        super(null);
        this.title = title;
        this.text = text;
    }

    render() {
        return `<div class="ui negative message"><div class="header">${this.name}</div><p>${this.text}</p></div>`
    }
};

module.exports.TOC = class TOC extends Token {
    constructor() {
        super();
        this.curSection = new Section(null, 0);
    }

    createSection(toks, level) {
        let section = new Section(toks, level);
        this.curSection = this.curSection._addSection(section);
        return this.curSection;
    }

    render() {

    }

};

module.exports.Section = class Section extends Token {
    constructor(toks, level) {
        super(toks);
        // this.parent = null;
        // this.index = null;
        this.level = level;
        this.subsection = [];
    }

    get indexList() {
        if (this.parent === null) return [];
        else return [...this.parent.indexList, this.index];
    }

    get root() {
        if (this.parent) return this.parent.root;
        else return this;
    }

    addSubsection(section) {
        section.index = this.subsection.length;
        section.parent = this;
        this.subsection.push(section);
        return section;
    }

    _addSection(section) {
        if (this.level < section.level) return this.addSubsection(section);
        else return this.parent._addSection(section);
    }

    render() {
        let indexList = this.indexList;
        let formattedLevel = indexList.join('_');
        return '<h'
            + (indexList.length)
            + ' class="ui dividing header" id="'
            + "h_" + formattedLevel
            + '">'
            + `<a href="#rh_${formattedLevel}">${indexList.join('.')}</a> `
            + this.renderContent()
            + '</h'
            + indexList.length
            + '>';
    }
};

module.exports.List = class List extends Token {
    constructor(toks, ordered, level) {
        super(toks);

    }
};


module.exports.Text = class Text extends Token {
    constructor(text) {
        super(null);
        this.text = text;
    }

    render() {
        return this.text;
    }

    get plainText() {
        return this.text
    }
};
