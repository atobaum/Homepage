"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
const Basic_1 = require("./Basic");
let katex = require("katex");
class Math extends Components_1.Token {
    constructor(text, displayMode) {
        super();
        this.text = text;
        this.block = displayMode;
    }
    render() {
        try {
            return katex.renderToString(this.text, { displayMode: this.block });
        }
        catch (e) {
            return (new Basic_1.ErrorToken('KaTeX Error', e.message)).render();
        }
    }
    plainText() {
        return this.text;
    }
}
exports.Math = Math;
