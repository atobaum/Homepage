"use strict";
/**
 * Created by Le Reveur on 2017-10-23.
 */
Object.defineProperty(exports, "__esModule", {value: true});
const Components_1 = require("../Components");
class Li extends Components_1.BigToken {
    constructor(toks, ordered, level) {
        super(toks);
        this.needParse = true;
        this.child = null;
        this.ordered = ordered;
        this.level = level;
    }

    render() {
        return `<li>${this.renderContent()}${this.child ? this.child.render() : ''}</li>`;
    }

    parse(toks) {
        let siblings = [this];
        while (toks[0] instanceof Li && ((toks[0].level === this.level && toks[0].ordered === this.ordered) || toks[0].level > this.level)) {
            let tok = toks.shift();
            if (tok.level === this.level)
                siblings.push(tok);
            else
                siblings[siblings.length - 1].child = tok.parse(toks);
        }
        return new List(siblings, this.ordered);
    }
}
exports.Li = Li;
class List extends Components_1.BigToken {
    constructor(list, ordered, isRoot = false) {
        super(list);
        // console.log(list);
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
