"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
const Basic_1 = require("./Basic");
let katex = require("katex");
class Math extends Components_1.InlineToken {
    constructor(text, displayMode) {
        super([text, displayMode]);
    }

    render() {
        try {
            return katex.renderToString(this.params[0], {displayMode: this.params[1]});
        }
        catch (e) {
            return (new Basic_1.Error('KaTeX Error', e.message)).render();
        }
    }

    plainText() {
        return this.params[0];
    }
}
exports.Math = Math;
