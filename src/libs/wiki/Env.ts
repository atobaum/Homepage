import * as Components from "./Components";
import {ETokenType, Footnote, InlineToken, IToken, Link, RFootnote, Section} from "./Components";
import {Env} from "./EnvManager";
import {TOC} from "./Components/TOC";
/**
 * Created by Le Reveur on 2017-10-17.
 */


export class SectionEnv implements Env<Section> {
    key: ETokenType = ETokenType.SECTION;
    toc: Components.TOC;

    constructor() {
        this.toc = new TOC(null, null);
    }

    afterScan(toks: IToken[]): Promise<void> {
        toks.unshift(this.toc.root);
        return;
    }

    makeToken([level, toks]): Section {
        let section = new Section(toks);
        this.toc = this.toc.addSection(level, section);
        return section;
    }
}

export class LinkEnv implements Env<Link> {
    key = ETokenType.LINK;

    links: Link[];
    ns: string;

    constructor(ns = "Main") {
        this.ns = ns;
        this.links = [];
    }

    async afterScan(toks): Promise<void> {
        return undefined;
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
}

export class FootnoteEnv implements Env<RFootnote> {
    key: ETokenType = ETokenType.RFOOTNOTE;
    fns: Footnote[] = [];

    afterScan(toks): Promise<void> {
        return null;
    }

    makeToken(inlineToks: InlineToken[]): RFootnote {
        let fn = new Footnote(this.fns.length, inlineToks);
        this.fns.push(fn);
        return fn.getRef();
    }
}

export class TitleEnv implements Env<Components.SimpleTag> {
    key: ETokenType = ETokenType.TITLE;

    fulltitle: string;

    constructor(titles) {
        this.fulltitle = `${(titles[0] !== 'Main' ? titles[0] + ':' : '') + titles[1]}`
    }

    afterScan(toks: IToken[]) {
        toks.unshift(new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle));
        return null;
    }

    makeToken(args: any[]): Components.SimpleTag {
        return new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle);
    }
}