import {EnvManager} from "./EnvManager";
import {InlineLexer} from "./InlineLexer";
import * as Components from "./Components";
/**
 * Created by Le Reveur on 2017-10-31.
 */
abstract class Lexer {
    TokenList: [[RegExp, (cap, em, lexer) => Components.Token]];
    envManager: EnvManager;
    private name: string;
    protected inlineLexer: InlineLexer;

    constructor(envManager: EnvManager, name: string, inlineLexer) {
        this.envManager = envManager;
        this.name = name;
        this.inlineLexer = inlineLexer;
    }

    scan(src: string): Components.Token[] {
        let cap;
        let type: Components.ETokenType;
        let syntax: RegExp;
        let factory;
        let toks: Components.Token[] = [];

        WhileLoop:
            while (src) {
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
export default Lexer
