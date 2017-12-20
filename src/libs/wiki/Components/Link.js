"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * Created by Le Reveur on 2017-10-16.
 */
var Components_1 = require("../Components");
var ExtLinkType;
(function (ExtLinkType) {
    ExtLinkType[ExtLinkType["DEFAULT"] = 0] = "DEFAULT";
    ExtLinkType[ExtLinkType["IMG"] = 1] = "IMG";
})(ExtLinkType = exports.ExtLinkType || (exports.ExtLinkType = {}));
var ExtLink = /** @class */ (function (_super) {
    __extends(ExtLink, _super);
    function ExtLink(type, text, href) {
        var _this = _super.call(this, [text || href, href]) || this;
        _this.type = type;
        return _this;
    }
    ExtLink.prototype.render = function () {
        switch (this.type) {
            case ExtLinkType.DEFAULT:
                return "<a class=\"wiki_ext_link\" href=\"" + this.params[1] + "\" title=\"" + this.params[1] + "\">" + this.params[0] + "<i class=\"external square icon\"></i></a>";
            case ExtLinkType.IMG:
                return "<img class=\"wiki_img\" src=\"" + this.params[1] + "\" alt=\"" + this.params[0] + "\">";
        }
    };
    ExtLink.prototype.plainText = function () {
        return this.params[1];
    };
    return ExtLink;
}(Components_1.InlineToken));
exports.ExtLink = ExtLink;
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link(ns, title, href, text) {
        return _super.call(this, [ns, title, href, text]) || this;
    }
    Link.prototype.render = function () {
        return "<a " + (this.isExist ? '' : 'class="wiki_nonexisting_page"') + " href=\"/wiki/view/" + this.params[2] + "\" title=\"" + this.params[2] + "\">" + this.params[3] + "</a>";
    };
    Link.prototype.plainText = function () {
        return this.params[2];
    };
    return Link;
}(Components_1.InlineToken));
exports.Link = Link;
