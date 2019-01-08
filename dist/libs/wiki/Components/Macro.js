"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Components_1 = require("../Components");
const Basic_1 = require("./Basic");
const Env_1 = require("../Env");
/**
 * Created by Kafka on 2019-01-08.
 */
class MacroTitle extends Components_1.Token {
    render() {
        return '';
    }
    plainText() {
        return '';
    }
    constructor(title, em) {
        super();
        em.editEnv(Components_1.ETokenType.TITLE, new Env_1.TitleEnv([null, title]));
    }
}
let map = new Map();
map.set('title', (title, em) => new MacroTitle(title, em));
class Macro {
    static build(name, parameter, em) {
        let builder;
        if (builder = Macro.dict.get(name.toLowerCase()))
            return builder(parameter, em);
        else
            return new Basic_1.ErrorToken("Macro Error", `Cannot resolve macro "${name}"`);
    }
}
Macro.dict = map;
exports.Macro = Macro;
