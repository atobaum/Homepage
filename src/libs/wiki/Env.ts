import * as Components from "./Components";
import {ETokenType, Footnote, Link, RFootnote, Section, Token} from "./Components";
import {Env} from "./EnvManager";
import {TOC} from "./Components/TOC";
import {Footnotes} from "./Components/Footnote";
/**
 * Created by Le Reveur on 2017-10-17.
 */

export class SectionEnv implements Env<Section> {
    key: ETokenType = ETokenType.SECTION;
    toc: Components.TOC;

    constructor() {
        this.toc = new TOC(null, null);
    }

    afterScan(toks: Token[]): Promise<void> {
        toks.unshift(this.toc.root);
        return;
    }

    makeToken([level, toks]): Section {
        let section = new Section(toks);
        this.toc = this.toc.addSection(level, section);
        return section;
    }

    save(conn) {
    };
}

export class LinkEnv implements Env<Link> {
    key = ETokenType.LINK;

    links: Link[];
    ns: string;

    constructor(ns = "Main") {
        this.ns = ns;
        this.links = [];
    }

    makeToken([ns, title, anchor, text]): Link {
        title = title || 'Index';
        let href;
        if (ns) {
            href = ns + ':';
        } else if (ns === '' || this.ns === "Main") {
            href = '';
            ns = "Main";
        } else {
            href = this.ns + ':';
            ns = this.ns;
        }
        href += title;
        if (anchor) href += anchor;

        let link = new Link(ns, title, href, text);
        this.links.push(link);
        return link;
    }

    async afterScan(toks, conn): Promise<void> {
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
    };

}

export class FootnoteEnv implements Env<RFootnote> {
    key: ETokenType = ETokenType.RFOOTNOTE;
    fns: Footnote[] = [];

    makeToken(inlineToks: Token[]): RFootnote {
        let fn = new Footnote(inlineToks, this.fns.length);
        this.fns.push(fn);
        return new RFootnote(fn);
    }

    afterScan(toks): Promise<void> {
        toks.push(new Footnotes(this.fns));
        return null;
    }

    save(conn) {
    };
}

export class TitleEnv implements Env<Components.SimpleTag> {
    key: ETokenType = ETokenType.TITLE;

    fulltitle: string;

    constructor(titles) {
        this.fulltitle = `${(titles[0] !== 'Main' ? titles[0] + ':' : '') + titles[1]}`
    }

    afterScan(toks: Token[]) {
        toks.unshift(new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle));
        return null;
    }

    save(conn) {
    };

    makeToken(args: any[]): Components.SimpleTag {
        return new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle);
    }
}