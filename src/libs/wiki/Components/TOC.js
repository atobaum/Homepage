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
var Components_1 = require("../Components");
/**
 * Created by Le Reveur on 2017-10-17.
 */
var TOC = /** @class */ (function (_super) {
    __extends(TOC, _super);
    function TOC(section, parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this) || this;
        _this.parent = parent;
        if (parent !== null) {
            _this.section = section;
            section.toc = _this;
        }
        _this.children = [];
        return _this;
    }
    Object.defineProperty(TOC.prototype, "indexList", {
        get: function () {
            if (this.parent === null)
                return [];
            else
                return this.parent.indexList.concat([this.index]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TOC.prototype, "root", {
        get: function () {
            if (this.isRoot)
                return this;
            else
                return this.parent.root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TOC.prototype, "isRoot", {
        get: function () {
            return this.parent === null;
        },
        enumerable: true,
        configurable: true
    });
    TOC.prototype.addChild = function (section) {
        var childToc = new TOC(section, this);
        childToc.index = this.children.length;
        this.children.push(childToc);
        return childToc;
    };
    TOC.prototype.addSection = function (level, section) {
        if (this.indexList.length < level)
            return this.addChild(section);
        else
            return this.parent.addSection(level, section);
    };
    TOC.prototype.render = function () {
        var result;
        if (this.isRoot)
            result = '<div class="ui segment compact wiki_toc"><ol>';
        else {
            result = "<li id=\"rh_" + this.indexList.join('_') + "\">" + this.indexList.join('.') + " <a  href=\"#h_" + this.indexList.join('_') + "\">" + this.section.plainText() + "</a>";
        }
        if (this.children.length !== 0)
            result += '<ol>'
                + this.children.map(function (item) {
                    if (item.indexList.length < 4) {
                        return item.render();
                    }
                    else
                        return '';
                }).join('')
                + '</ol>';
        result += (this.isRoot ? '</ol></div>' : '</li>');
        return result;
    };
    TOC.prototype.plainText = function () {
        return '[TOC]';
    };
    return TOC;
}(Components_1.Macro));
exports.TOC = TOC;
