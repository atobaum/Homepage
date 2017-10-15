/**
 * Created by Le Reveur on 2017-10-16.
 */
import {InlineToken} from "../Components";
import {Error} from "./Basic";
let katex = require("katex");

export class Math extends InlineToken {
    constructor(text: string, displayMode: boolean) {
        super([text, displayMode]);
    }

    render() {
        try {
            return katex.renderToString(this.params[0], {displayMode: this.params[1]});
        } catch (e) {
            return (new Error('KaTeX Error', e.message)).render();
        }
    }

    plainText() {
        return this.params[0];
    }
}

