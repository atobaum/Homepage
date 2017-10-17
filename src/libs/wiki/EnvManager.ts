import {ETokenType, IToken} from "./Components";
/**
 * Created by Le Reveur on 2017-10-16.
 */

export interface Env<T extends IToken> {
    readonly key: ETokenType;
    afterScan(): Promise<void>
    makeToken(args: any[]): T
}

export class EnvManager {
    private envList: Map<ETokenType, Env<IToken>>;

    constructor() {
        this.envList = new Map();
    }

    addEnv(env: Env<IToken>): void {
        this.envList.set(env.key, env);
    }

    async afterScan(): Promise<void> {
        await Promise.all(Array.from(this.envList.values()).map(env => env.afterScan())).catch(e => {
            throw e
        });
    }

    makeToken(key: ETokenType, argv): IToken {
        return this.envList.get(key).makeToken(argv);
    }
}
