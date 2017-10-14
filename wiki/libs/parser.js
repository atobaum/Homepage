/**
 * Created by Le Reveur on 2017-04-24.
 */
"use strict";

let Lexer = require('./lexer');
let Renderer = require('./renderer');
let Components = require('./Components');

class Parser {
    constructor(wiki) {
        this.renderer = new Renderer();
        this.wiki = wiki;
    }

    reloadRenderer() {
        this.renderer = new Renderer();
    }

    parseList(toks, env) {
        let list = [],
            curOrdered = toks[0].ordered,
            curLevel = toks[0].level;

        while (toks[0] && toks[0].type === 'list' && (toks[0].level === curLevel) && (toks[0].ordered === curOrdered)) {
            let tok = toks.shift();
            tok.text = this.inlineParse(tok.toks, env)[0];
            if (toks[0] && toks[0].type === 'list' && toks[0].level > curLevel)
                tok.child = this.parseList(toks, env);
            list.push(tok);
        }
        return list;
    }

    // parseTable(toks, env) {
    //     let tables = [];
    //     let tok;
    //     while (toks[0] && toks[0].type === 'table') {
    //         tok = toks.shift();
    //         tok.row = tok.toks.map(item => {
    //             return this.inlineParse(item, env)[0];
    //         });
    //         tables.push(tok);
    //     }
    //     return tables;
    // }

    macro(tok, env) {
        switch (tok.macro.toLowerCase()) {
            case(''):
            case(null):
                if(tok.param)
                    return '<pre>' + this.renderer.escapeHTML(tok.text) + '</pre>';
                else
                    return '<code>' + this.renderer.escapeHTML(tok.text) + '</code>';
                break;
            case('syntax'):
                return this.renderer.syntax(tok);
                break;
            case('html'):
                return tok.text;
                break;
            case 'cat':
            case 'category':
            case '분류':
                env.category.push(tok.text);
                return '';
                break;
            case 'br':
                return '<br />';
                break;
            case 'label':
                return `<a id="${tok.text}"></a>`;
                break;
            default:
                return this.renderer.error({name: "Macro Error", text: 'Macro ' + tok.macro + " doesn't supported."});
        }
    };

    parseQuote(toks, env) {
        let tok = toks.shift();
        let title = tok.title;
        let text = this.inlineParse(tok.toks, env)[0];
        let ref = tok.ref;
        while (toks[0] && toks[0].type === 'quote') {
            text += ' ' + this.inlineParse(toks.shift().toks, env)[0];
        }
        return {title: title, ref: ref, text: text};
    };

    async out(src, ns, pageTitle) {
        this.renderer.ns = ns;
        let env = {heading: new Heading({level: 0}), footnote: [], existingPages: [], category: []};
        let [toks, info] = Lexer.scan(src, ns);

        info.link = info.link.map(item => {
            let regexTitle = /^(?:(.*?):)?(.+?)(?:#(.*))?$/;
            let parsedHref = regexTitle.exec(item.toLowerCase());
            let href = parsedHref[2];
            if (parsedHref[1]) {//Namespace exists
                href = parsedHref[1] + ':' + href;
            } else if (parsedHref[1] === undefined && ns) {
                href = ns + ':' + href;
            } else href = "Main:" + href;
            return href;
        });
        env.existingPages = await this.wiki.existingPages(info.link, ns);
        let content = this.parse(toks, env);
        env.heading = env.heading.root;
        if (env.heading.child.length !== 0)
            content = this.renderer.toc(env.heading.child) + content;
        if (pageTitle)
            content = this.renderer.title(pageTitle) + content;
        if (ns === "Category") {
            content += await this.wiki.getPageList(pageTitle).then(async (pageList) => {
                return this.renderer.pageList(pageTitle, pageList)
            }).catch(async e => {
                return this.renderer.error({text: e.message})
            });
        }
        if (env.footnote.length !== 0)
            content += '<br>' + this.renderer.footnotes(env.footnote);
        if (env.category.length !== 0) {
            content += this.renderer.cat(env.category, env);
        }

        return [content, env];
    };

    parse(toks, env) {
        let tok;
        let content = '';
        while (tok = toks[0]) {
            switch (tok.type) {
                case 'heading':
                    toks.shift();
                    [tok.text, tok.plainText] = this.inlineParse(tok.toks, env);
                    env.heading = env.heading.addHeading(tok);
                    content += this.renderer.heading(env.heading);
                    break;
                case 'list':
                    content += this.renderer.list(this.parseList(toks, env));
                    break;
                    // case 'table':
                    //     content += this.renderer.table(this.parseTable(toks, env));
                    break;
                case 'quote':
                    content += this.renderer.blockquote(this.parseQuote(toks, env));
                    break;
                default:
                    let temp = this.inlineParse(toks, env)[0];
                    if(temp.length > 0)
                        content += this.renderer.paragraph({text: temp});
            }
        }
        return content;
    }

    inlineParse(toks, env) {
        let tok;
        let content = '';
        let plainText = '';
        outerloop:
            while (tok = toks[0]) {
                if (tok.render) {
                    toks.shift();
                    content += tok.render();
                    plainText += tok.plainText;
                    continue;
                }
                switch (tok.type) {
                    case 'macro':
                        content += this.renderer.KaTeX(tok);
                        plainText += tok.text;
                        break;
                    case 'urlLink':
                        toks.shift();
                        content += this.renderer.urlLink(tok);
                        plainText += (tok.text ? tok.text : tok.href);
                        break;
                    case 'link':
                        toks.shift();
                        content += this.renderer.link(tok, env);
                        plainText += (tok.text ? tok.text : tok.href);
                        break;
                    case 'footnote':
                        toks.shift();
                        [tok.text, tok.plainText] = this.inlineParse(tok.toks, env);
                        tok.index = env.footnote.length;
                        env.footnote.push(tok);
                        content += this.renderer.rfn(tok);
                        break;

                    case 'text':
                        toks.shift();
                        content += tok.text;
                        plainText += tok.text;
                        break;
                    case 'emptyline':
                        toks.shift();
                    case 'heading':
                    case 'table':
                    case 'list':
                    case 'quote':
                        break outerloop;

                    case 'newline':
                        toks.shift();
                        content += '<br />';
                        break;
                    default:
                        if (this.renderer[tok.type]) {
                            toks.shift();
                            content += this.renderer[tok.type](tok);
                            plainText += tok.text;
                        } else {
                            content += this.renderer.error({
                                name: "Unsupported Token",
                                text: "Token type is unsupported: " + tok.type
                            });
                            break outerloop;
                        }
                        break;
                }
            }
        return [content, plainText];
    }
}


class Heading {
    constructor(content = null, parent = null) {
        this.content = content;
        this.parent = parent;
        this.child = [];
        this.index = 0;
    }

    get indexList() {
        if (this.parent === null) return [];
        else return [...this.parent.indexList, this.index];
    }

    get root() {
        let cur = this;
        while (cur.parent !== null) cur = cur.parent;
        return cur;
    }

    addChild(content) {
        let node = new Heading(content, this);
        node.index = this.child.length;
        this.child.push(node);
        return this.child[this.child.length - 1];
    }

    addHeading(heading) {
        if (this.content.level < heading.level)
            return this.addChild(heading);
        else
            return this.parent.addHeading(heading);
    }
}

module.exports = Parser;
