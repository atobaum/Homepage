import {BigToken, Token} from "../Components";
/**
 * Created by Le Reveur on 2017-10-31.
 */
export class RFootnote extends Token {
    private fn: Footnote;

    constructor(fn: Footnote) {
        super();
        this.fn = fn;
    }

    render() {
        return `<sup id="rfn_${this.fn.index}"><a href="#fn_${this.fn.index}" title="${this.fn.plainText()}">[${this.fn.index}]</a></sup>`;
    }

    plainText() {
        return this.fn.plainText();
    }
}

export class Footnote extends BigToken {
    private _index: number;
    get index() {
        return this._index
    }

    constructor(toks, index) {
        super(toks);
        this._index = index;
    }

    render() {
        return `<li><a class="wiki_fn" id="fn_${this._index}" href="#rfn_${this._index}">[${this._index}]</a> ${this.renderContent()}</li>`;
    }
}

export class Footnotes extends BigToken {
    constructor(fns) {
        super(fns);
    }

    render() {
        if (this.toks.length)
            return `<hr><ul class="wiki_fns">${this.toks.map((item) => item.render()).join('')}</ul>`;
        else
            return ''
    }
}


