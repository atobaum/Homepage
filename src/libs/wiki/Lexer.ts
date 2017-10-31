import {EnvManager} from "./EnvManager";
import {InlineLexer} from "./InlineLexer";
import * as Components from "./Components";
/**
 * Created by Le Reveur on 2017-10-31.
 */
abstract class Lexer {
    TokenList: [[Components.ETokenType, RegExp, (cap, em, lexer) => Components.Token]];
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
                for ([type, syntax, factory] of this.TokenList) {
                    if (cap = syntax.exec(src)) {
                        // console.log(this.name, type, cap)
                        let temp;
                        if (factory)
                            temp = factory(cap, this.envManager, this.inlineLexer);
                        else
                            temp = this.makeToken(type, cap);
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

    makeToken(type: Components.ETokenType, cap): Components.Token {
        throw new Error("Error: Override 'makeToken'");
    };
}
export default Lexer
