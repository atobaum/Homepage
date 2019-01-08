/**
 * Created by Le Reveur on 2017-10-16.
 */
import {Token} from "../Components";
import {ErrorToken} from "./Basic";
let katex = require("katex");

export class Math extends Token {
    private text: string;
    private block: boolean;
    constructor(text: string, displayMode: boolean) {
        super();
        this.text = text;
        this.block = displayMode;
    }

    render() {
        try {
            return katex.renderToString(this.text, {displayMode: this.block});
        } catch (e) {
            return (new ErrorToken('KaTeX Error', e.message)).render();
        }
    }

    plainText() {
        return this.text;
    }
}

