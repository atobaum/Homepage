import {BigToken, Token} from "../Components";
/**
 * Created by Le Reveur on 2018-01-06.
 */
export class Quote extends BigToken {
    constructor(toks) {
        super(toks);
    }

    parse(toks: Token[]) {
        if (toks[0] && toks[0] instanceof Quote) {
            this.toks = this.toks.concat((toks.shift() as Quote).toks);
            return this;
        }
    }

    render() {
        return "<blockquote>" + this.renderContent() + "</blockquote>";
    }
}