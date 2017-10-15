/**
 * Created by Le Reveur on 2017-10-16.
 */
import {InlineToken} from "../Components";

export enum ExtLinkType {DEFAULT, IMG}
export class ExtLink extends InlineToken {
    type: ExtLinkType;

    constructor(type: ExtLinkType, text: string, href: string) {
        super([text || href, href]);
        this.type = type;
    }

    render() {
        switch (this.type) {
            case ExtLinkType.DEFAULT:
                return `<a class="wiki_ext_link" href="${this.params[1]}" title="${this.params[1]}">${this.params[0]}<i class="external square icon"></i></a>`;
            case ExtLinkType.IMG:
                return `<img class="wiki_img" src="${this.params[1]}" alt="${this.params[0]}">`;
        }
    }

    plainText() {
        return this.params[1];
    }
}

export class Link extends InlineToken {
    isExist: boolean;

    constructor(ns, title, href, text) {
        super([ns, title, href, text]);
    }

    render() {
        return `<a ${this.isExist ? '' : 'class="wiki_nonexisting_page"'} href="\/wiki\/view\/${this.params[2]}" title="${this.params[2]}">${this.params[3]}</a>`;
    }

    plainText() {
        return this.params[2];
    }

}