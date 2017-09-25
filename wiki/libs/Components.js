/**
 * Created by Le Reveur on 2017-09-26.
 */
'use strict';

class Token {
    constructor(toks) {
        this.toks = toks;
    }

    render() {
        return "Error: render() should be overridden.";
    }

    renderContent() {
        if (this.toks.length === 0)
            return "Error: content of a Token is empty.";
        else
            return toks.reduce((a, b) => a + b.render());
    }
}

export class TOC extends Token {
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

}

export class Section extends Token {
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
}

export class List extends Token {
    constructor(toks, ordered, level) {
        super(toks);

    }
}


export class Text extends Token {
    constructor(text) {
        super(null);
        this.text = text;
    }

    render() {
        return this.text;
    }
}
