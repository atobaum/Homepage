import {ETokenType, IToken} from "./Components";
/**
 * Created by Le Reveur on 2017-10-16.
 */

export interface Env<T extends IToken> {
    readonly key: ETokenType;
    afterScan(toks: IToken[]): Promise<void>
    makeToken(args: any[]): T
}

export class EnvManager {
    private envList: Map<ETokenType, Env<IToken>>;
    private priority: Env<IToken>[];

    constructor() {
        this.envList = new Map();
        this.priority = [];
    }

    addEnv(env: Env<IToken>): void {
        this.envList.set(env.key, env);
        this.priority.push(env);
    }

    async afterScan(toks: IToken[]): Promise<void> {
        let promise = [];
        for (let i = 0; i < this.priority.length; i++) {
            promise.push(this.priority[i].afterScan(toks));
        }
        await Promise.all(promise);
    }

    makeToken(key: ETokenType, argv): IToken {
        return this.envList.get(key).makeToken(argv);
    }
}
