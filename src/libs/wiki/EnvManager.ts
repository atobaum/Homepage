import * as Components from "./Components";
import {ETokenType, Footnote, InlineToken, IToken, RFootnote} from "./Components";
import {Link} from "./Components/Link";
import {Section} from "./Components/Basic";
/**
 * Created by Le Reveur on 2017-10-16.
 */
interface Env<T extends IToken> {
    readonly key: ETokenType;
    afterScan(): Promise<void>
    makeToken(args: any[]): T
}

export class SectionEnv implements Env<Section> {
    key: ETokenType = ETokenType.SECTION;
    toc: Components.TOC;

    afterScan(): Promise<void> {
        return;
    }

    makeToken([level, toks]): Section {
        return new Section(level, toks);
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

export class EnvManager {
    private envList: Map<ETokenType, Env<IToken>>;

    constructor() {
        this.envList = new Map();
    }

    addEnv(env: Env<IToken>): void {
        this.envList.set(env.key, env);
    }

    async afterScan(): Promise<void> {
        await Promise.all(Array.from(this.envList.values()).map(env => env.afterScan())).catch(e => {
            throw e
        });
    }

    makeToken(key: ETokenType, argv): IToken {
        return this.envList.get(key).makeToken(argv);
    }
}
