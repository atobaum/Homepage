"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Components = require("./Components");
/**
 * Created by Le Reveur on 2017-10-31.
 */
class Lexer {
    constructor(envManager, name, inlineLexer) {
        this.envManager = envManager;
        this.name = name;
        this.inlineLexer = inlineLexer;
    }
    scan(src) {
        let cap;
        let type;
        let syntax;
        let factory;
        let toks = [];
        WhileLoop: while (src) {
            for ([syntax, factory] of this.TokenList) {
                if (cap = syntax.exec(src)) {
                    let temp = factory(cap, this.envManager, this.inlineLexer);
                    if (temp)
                        toks.push(temp);
                    src = src.substr(cap[0].length);
                    continue WhileLoop;
                }
            }
            toks.push(new Components.Error('Infinite Loop in ' + this.name + ' Lexer', "Error occurred in processing " + src));
            break;
        }
        return toks;
    }
}
exports.default = Lexer;
