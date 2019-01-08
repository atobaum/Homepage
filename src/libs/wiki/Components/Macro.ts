import {ETokenType, Token} from "../Components";
import {EnvManager} from "../EnvManager";
import {ErrorToken} from "./Basic";
import {TitleEnv} from "../Env";
/**
 * Created by Kafka on 2019-01-08.
 */

class MacroTitle extends Token {
    render(): string {
        return '';
    }

    plainText(): string {
        return '';
    }

    constructor(title: string, em: EnvManager) {
        super();
        em.editEnv(ETokenType.TITLE, new TitleEnv([null, title]));
    }
}

let map = new Map();
map.set('title', (title, em) => new MacroTitle(title, em));

export class Macro {
    private static dict = map;

    static build(name: string, parameter: string, em: EnvManager): Token {
        let builder;
        if (builder = Macro.dict.get(name.toLowerCase()))
            return builder(parameter, em);
        else
            return new ErrorToken("Macro Error", `Cannot resolve macro "${name}"`);
    }
}


