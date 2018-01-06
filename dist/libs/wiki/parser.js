/**
 * Created by Le Reveur on 2017-04-24.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
Object.defineProperty(exports, "__esModule", {value: true});
const EnvManager_1 = require("./EnvManager");
const BlockLexer_1 = require("./BlockLexer");
const Env = require("./Env");
class Parser {
    constructor() {
    }

    static render(titles, src, as = false) {
        return __awaiter(this, void 0, void 0, function*() {
            let em = new EnvManager_1.EnvManager();
            em.addEnv(new Env.LinkEnv(titles[0]));
            em.addEnv(new Env.SectionEnv());
            em.addEnv(new Env.TitleEnv(titles));
            let lexer = new BlockLexer_1.default(em);
            let toks = lexer.scan(src);
            yield em.afterScan(toks);
            let toks2 = []; //parsed tokens
            let tok; //iterator variable
            while (tok = toks.shift())
                toks2.push(tok.parse(toks));
            //render
            return toks2.map(item => item.render()).join('');
            // if (ns === "Category") {
            //     content += await this.wiki.getPageList(pageTitle).then(async (pageList) => {
            //         return this.renderer.pageList(pageTitle, pageList)
            //     }).catch(async e => {
            //         return this.renderer.error({text: e.message})
            //     });
            // }
            // if (env.footnote.length !== 0)
            //     content += '<br>' + this.renderer.footnotes(env.footnote);
            // if (env.category.length !== 0) {
            //     content += this.renderer.cat(env.category, env);
            // }
            //
            // return [content, env]
        });
    }
}
exports.default = Parser;
