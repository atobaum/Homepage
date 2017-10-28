/**
 * Created by Le Reveur on 2017-10-16.
 */
import {Token} from "../Components";

export enum ExtLinkType {DEFAULT, IMG}
export class ExtLink extends Token {
    private text: string;
    private href: string;
    private type: ExtLinkType;

    constructor(type: ExtLinkType, text: string, href: string) {
        super();
        this.text = text;
        this.href = href;
        this.type = type;
    }

    render() {
        switch (this.type) {
            case ExtLinkType.DEFAULT:
                return `<a class="wiki_ext_link" href="${this.href}" title="${this.href}">${this.text}<i class="external square icon"></i></a>`;
            case ExtLinkType.IMG:
                return `<img class="wiki_img" src="${this.href}" alt="${this.text}">`;
        }
    }

    plainText() {
        return this.href;
    }
}

export class Link extends Token {
    private ns: string;
    private title: string;
    private href: string;
    private text: string;
    private isExist: boolean;

    constructor(ns, title, href, text) {
        super();
        this.ns = ns;
        this.title = title;
        this.href = href;
        this.text = text;
    }

    render() {
        return `<a ${this.isExist ? '' : 'class="wiki_nonexisting_page"'} href="\/wiki\/view\/${this.href}" title="${this.href}">${this.text}</a>`;
    }

    plainText() {
        return this.href;
    }

}