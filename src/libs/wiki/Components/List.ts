/**
 * Created by Le Reveur on 2017-10-23.
 */

import {BigToken, Token} from "../Components";
export class Li extends BigToken {
    needParse = true;
    ordered: boolean;
    level: number;
    child: List = null;

    constructor(toks: Token[], ordered: boolean, level: number) {
        super(toks);
        this.ordered = ordered;
        this.level = level;
    }

    render() {
        return `<li>${this.renderContent()}${this.child ? this.child.render() : ''}</li>`;
    }

    parse(toks) {
        let siblings = [this];
        console.log(this, toks);
        try {
            while (toks[0] instanceof Li && ((toks[0].level === this.level && toks[0].ordered === this.ordered) || toks[0].level > this.level)) {
            let tok = toks.shift();
                if (tok.level === this.level)
                siblings.push(tok);
            else
                    siblings[siblings.length - 1].child = tok.parse(toks);
        }
        } catch (e) {
            console.log(e);
        }
        return new List(siblings, this.ordered);
    }
}

export class List extends BigToken {
    ordered: boolean;
    isRoot: boolean;

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
