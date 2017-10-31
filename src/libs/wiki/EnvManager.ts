import {ETokenType, Token} from "./Components";
import SingletonMysql from "../SingletonMysql";
/**
 * Created by Le Reveur on 2017-10-16.
 */

export interface Env<T extends Token> {
    readonly key: ETokenType;
    makeToken(argv: any[]): T
    afterScan(toks: Token[], conn): Promise<void> | void
    save(conn, id?: number): Promise<void> | void
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

    afterScan(toks: Token[]): Promise<void> {
        return SingletonMysql.queries(conn => {
            let promise = [];
            for (let i = 0; i < this.priority.length; i++) {
                promise.push(this.priority[i].afterScan(toks, conn));
            }
            return Promise.all(promise);
        }).then(() => null);
    }

    save(): Promise<void> {
        return SingletonMysql.queries(conn => {
            return Promise.all(this.priority.map(env => env.save(conn)));
        }).then(() => null);
    }

    makeToken(key: ETokenType, argv): Token {
        return this.envList.get(key).makeToken(argv);
    }
}
