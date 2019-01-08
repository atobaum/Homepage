"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Components = require("./Components");
const Components_1 = require("./Components");
const TOC_1 = require("./Components/TOC");
/**
 * Created by Le Reveur on 2017-10-17.
 */
class SectionEnv {
    constructor() {
        this.key = Components_1.ETokenType.SECTION;
        this.toc = new TOC_1.TOC(null, null);
    }
    afterScan(toks) {
        toks.unshift(this.toc.root);
        return;
    }
    makeToken([level, toks]) {
        let section = new Components_1.Section(toks);
        this.toc = this.toc.addSection(level, section);
        return section;
    }
    save(conn) {
    }
    ;
}
exports.SectionEnv = SectionEnv;
class LinkEnv {
    constructor(ns = "Main") {
        this.key = Components_1.ETokenType.LINK;
        this.ns = ns;
        this.links = [];
    }
    makeToken([ns, title, anchor, text]) {
        title = title || 'Index';
        let href;
        if (ns) {
            href = ns + ':';
        }
        else if (ns === '' || this.ns === "Main") {
            href = '';
            ns = "Main";
        }
        else {
            href = this.ns + ':';
            ns = this.ns;
        }
        href += title;
        if (anchor)
            href += anchor;
        let link = new Components_1.Link(ns, title, href, text);
        this.links.push(link);
        return link;
    }
    async afterScan(toks, conn) {
        if (!this.links.length)
            return;
        let titles = this.links.map(link => link.getTitles());
        let nsTitles = titles.map(item => item[0]);
        let pageTitles = titles.map(item => item[1]);
        let [rows] = await conn.query("SELECT ns_title, page_title FROM fullpage WHERE ns_title IN (?) AND page_title IN (?)", [nsTitles, pageTitles]);
        rows = rows.map(item => (item.ns_title + ":" + item.page_title).toLowerCase());
        this.links.forEach(item => {
            if (rows.includes(item.getTitles().join(":").toLowerCase()))
                item.isExist = true;
        });
        return null;
    }
    save(conn) {
    }
    ;
}
exports.LinkEnv = LinkEnv;
class TitleEnv {
    constructor(titles) {
        this.key = Components_1.ETokenType.TITLE;
        this.fulltitle = `${(titles[0] && titles[0] !== 'Main' ? titles[0] + ':' : '') + titles[1]}`;
    }
    afterScan(toks) {
        toks.unshift(new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle));
        return null;
    }
    save(conn) {
    }
    ;
    makeToken(args) {
        return new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle);
    }
}
exports.TitleEnv = TitleEnv;
