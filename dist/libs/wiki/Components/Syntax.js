"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = require("../Components");
/**
 * Created by Le Reveur on 2017-11-01.
 */
class Code extends Components_1.Token {
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
exports.Code = Code;
class InlineCode extends Components_1.Token {
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
exports.InlineCode = InlineCode;
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
