import {ETokenType, Token} from "./Components";
/**
 * Created by Le Reveur on 2017-10-16.
 */

export interface Env<T extends Token> {
    readonly key: ETokenType;
    afterScan(toks: Token[]): Promise<void>
    makeToken(argv: any[]): T
}

export class EnvManager {
    private envList: Map<ETokenType, Env<Token>>;
    private priority: Env<Token>[];

    constructor() {
        this.envList = new Map();
        this.priority = [];
    }

    addEnv(env: Env<Token>): void {
        this.envList.set(env.key, env);
        this.priority.push(env);
    }

    async afterScan(toks: Token[]): Promise<void> {
        let promise = [];
        for (let i = 0; i < this.priority.length; i++) {
            promise.push(this.priority[i].afterScan(toks));
        }
        await Promise.all(promise);
    }

    makeToken(key: ETokenType, argv): Token {
        return this.envList.get(key).makeToken(argv);
    }
}
