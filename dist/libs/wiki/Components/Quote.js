"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Components_1 = require("../Components");
/**
 * Created by Le Reveur on 2018-01-06.
 */
class Quote extends Components_1.BigToken {
    constructor(toks) {
        super(toks);
    }

    parse(toks) {
        if (toks[0] && toks[0] instanceof Quote) {
            this.toks = this.toks.concat(toks.shift().toks);
            return this;
        }
    }

    render() {
        return "<blockquote>" + this.renderContent() + "</blockquote>";
    }
}
exports.Quote = Quote;
