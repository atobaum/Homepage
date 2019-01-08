/**
 * Created by Le Reveur on 2017-04-24.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EnvManager_1 = require("./EnvManager");
const BlockLexer_1 = require("./BlockLexer");
const Env = require("./Env");
class Parser {
    constructor() {
    }
    static async render(titles, src, as = false) {
        let em = new EnvManager_1.EnvManager();
        em.addEnv(new Env.LinkEnv(titles[0]));
        em.addEnv(new Env.SectionEnv());
        em.addEnv(new Env.TitleEnv(titles));
        let lexer = new BlockLexer_1.default(em);
        let toks = lexer.scan(src);
        await em.afterScan(toks);
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
    }
}
exports.default = Parser;
