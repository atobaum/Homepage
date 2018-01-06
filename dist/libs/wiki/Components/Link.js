"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
var ExtLinkType;
(function (ExtLinkType) {
    ExtLinkType[ExtLinkType["DEFAULT"] = 0] = "DEFAULT";
    ExtLinkType[ExtLinkType["IMG"] = 1] = "IMG";
})(ExtLinkType = exports.ExtLinkType || (exports.ExtLinkType = {}));
class ExtLink extends Components_1.Token {
    constructor(type, text, href) {
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
exports.ExtLink = ExtLink;
class Link extends Components_1.Token {
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

    getTitles() {
        return [this.ns, this.title];
    }
}
exports.Link = Link;
