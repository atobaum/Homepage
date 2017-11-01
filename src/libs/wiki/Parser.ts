/**
 * Created by Le Reveur on 2017-04-24.
 */
"use strict";
import {EnvManager} from "./EnvManager";
import BlockLexer from "./BlockLexer";
import * as Env from "./Env";

export default class Parser {
    private constructor() {
    }

    static async render(titles: [string, string], src: string, as: boolean = false) {
        let em = new EnvManager();

        em.addEnv(new Env.LinkEnv(titles[0]));
        em.addEnv(new Env.SectionEnv());
        em.addEnv(new Env.TitleEnv(titles));
        em.addEnv(new Env.FootnoteEnv());
        let lexer = new BlockLexer(em);

        let toks = lexer.scan(src);
        await em.afterScan(toks);

        //parse
        let toks2 = [];
        let tok;
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

    // macro(tok, env) {
    //     switch (tok.macro.toLowerCase()) {
    //         case(''):
    //         case(null):
    //             if (tok.param)
    //                 return '<pre>' + this.renderer.escapeHTML(tok.text) + '</pre>';
    //             else
    //                 return '<code>' + this.renderer.escapeHTML(tok.text) + '</code>';
    //             break;
    //         case('syntax'):
    //             return this.renderer.syntax(tok);
    //             break;
    //         case('html'):
    //             return tok.text;
    //             break;
    //         case 'cat':
    //         case 'category':
    //         case '분류':
    //             env.category.push(tok.text);
    //             return '';
    //             break;
    //         case 'br':
    //             return '<br />';
    //             break;
    //         case 'label':
    //             return `<a id="${tok.text}"></a>`;
    //             break;
    //         default:
    //             return this.renderer.error({name: "Macro Error", text: 'Macro ' + tok.macro + " doesn't supported."});
    //     }
    // }

    // parseQuote(toks, env) {
    //     let tok = toks.shift();
    //     let title = tok.title;
    //     let text = this.inlineParse(tok.toks, env)[0];
    //     let ref = tok.ref;
    //     while (toks[0] && toks[0].type === 'quote') {
    //         text += ' ' + this.inlineParse(toks.shift().toks, env)[0];
    //     }
    //     return {title: title, ref: ref, text: text};
    // }
}
