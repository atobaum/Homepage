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
const Components_1 = require("./Components");
/**
 * Created by Le Reveur on 2017-10-17.
 */
class SectionEnv {
    constructor() {
        this.key = Components_1.ETokenType.SECTION;
    }

    afterScan() {

    }

    makeToken([level, toks]) {
        return new Components_1.Section(level, toks);
    }
}
exports.SectionEnv = SectionEnv;
class LinkEnv {
    constructor(ns = "Main") {
        this.key = Components_1.ETokenType.LINK;
        this.ns = ns;
        this.links = [];
    }

    afterScan() {
        return __awaiter(this, void 0, void 0, function*() {
            return undefined;
        });
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
}
exports.LinkEnv = LinkEnv;
// export class TOCEnv implements Env<Section>{
//
// }
class FootnoteEnv {
    constructor() {
        this.key = Components_1.ETokenType.RFOOTNOTE;
        this.fns = [];
    }

    afterScan() {
        return null;
    }

    makeToken(inlineToks) {
        let fn = new Components_1.Footnote(this.fns.length, inlineToks);
        this.fns.push(fn);
        return fn.getRef();
    }
}
exports.FootnoteEnv = FootnoteEnv;
