import * as Components from "./Components";
import {ETokenType, Footnote, InlineToken, Link, RFootnote, Section} from "./Components";
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

    afterScan(): Promise<void> {
        return;
    }

    makeToken([level, toks]): Section {
        let section = new Section(toks);
        let t = this.toc.addSection(level, section);
        console.log(t);
        this.toc = t;
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

    async afterScan(): Promise<void> {
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


// export class TOCEnv implements Env<Section>{
//
// }


export class FootnoteEnv implements Env<RFootnote> {
    key: ETokenType = ETokenType.RFOOTNOTE;
    fns: Footnote[] = [];

    afterScan(): Promise<void> {
        return null;
    }

    makeToken(inlineToks: InlineToken[]): RFootnote {
        let fn = new Footnote(this.fns.length, inlineToks);
        this.fns.push(fn);
        return fn.getRef();
    }
}
