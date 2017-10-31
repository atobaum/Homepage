import {Token} from "../Components";
/**
 * Created by Le Reveur on 2017-11-01.
 */
export class SyntaxHighlight extends Token {
    private lang: string;
    private text: string;

    constructor(text, lang = 'javascript') {
        super();
        this.lang = lang;
        this.text = text;

    }

    render() {
        return `<pre class="wiki-syntaxhl line-numbers language-${this.lang}"><code>${this.text}</code></pre>`;
    }

    plainText() {
        return this.text;
    }
}
