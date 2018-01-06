"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Components_1 = require("../Components");
/**
 * Created by Le Reveur on 2017-10-17.
 */
class TOC extends Components_1.Token {
    constructor(section, parent = null) {
        super();
        this.parent = parent;
        if (parent !== null) {
            this.section = section;
            section.toc = this;
        }
        this.children = [];
    }

    get indexList() {
        if (this.parent === null)
            return [];
        else
            return [...this.parent.indexList, this.index];
    }

    get root() {
        if (this.isRoot)
            return this;
        else
            return this.parent.root;
    }

    get isRoot() {
        return this.parent === null;
    }

    addChild(section) {
        let childToc = new TOC(section, this);
        childToc.index = this.children.length;
        this.children.push(childToc);
        return childToc;
    }

    addSection(level, section) {
        if (this.indexList.length < level)
            return this.addChild(section);
        else
            return this.parent.addSection(level, section);
    }

    render() {
        let result;
        if (this.isRoot && !this.children)
            return '';
        else if (this.isRoot)
            if (this.children.length < 2)
                return '';
            else
                result = '<div class="ui segment compact wiki_toc"><ol>';
        else {
            result = `<li id="rh_${this.indexList.join('_')}">${this.indexList.join('.')} <a  href="#h_${this.indexList.join('_')}">${this.section.plainText()}</a>`;
        }
        if (this.children.length !== 0)
            result += '<ol>'
                + this.children.map(item => {
                    if (item.indexList.length < 4) {
                        return item.render();
                    }
                    else
                        return '';
                }).join('')
                + '</ol>';
        result += (this.isRoot ? '</ol></div>' : '</li>');
        return result;
    }

    plainText() {
        return '[TOC]';
    }
}
exports.TOC = TOC;
