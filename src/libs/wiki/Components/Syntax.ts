import {Token} from "../Components";
/**
 * Created by Le Reveur on 2017-11-01.
 */
export class Code extends Token {
    private lang: string;
    private text: string;

    constructor(text, lang) {
        super();
        this.lang = lang;
        this.text = text;
    }

    render() {
        return `<pre${this.lang ? ' class="wiki-syntaxhl"' : ''}><code${this.lang ? ' class="lang-' + this.lang + '"' : ''}>${escapeHTML(this.text)}</code></pre>`;
    }

    plainText() {
        return this.text;
    }
}

export class InlineCode extends Token {
    private text: string;

    constructor(text) {
        super();
        this.text = text;
    }

    render() {
        return `<code>${escapeHTML(this.text)}</code>`;
    }

    plainText() {
        return this.text;
    }
}

function escapeHTML(str) {
    return str.replace(/[&<"']/g, function (m) {
        switch (m) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '"':
                return '&quot;';
            default:
                return '&#039;';
        }
    });
}