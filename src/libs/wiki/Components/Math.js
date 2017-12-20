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
var Basic_1 = require("./Basic");
var katex = require("katex");
var Math = /** @class */ (function (_super) {
    __extends(Math, _super);
    function Math(text, displayMode) {
        return _super.call(this, [text, displayMode]) || this;
    }
    Math.prototype.render = function () {
        try {
            return katex.renderToString(this.params[0], { displayMode: this.params[1] });
        }
        catch (e) {
            return (new Basic_1.Error('KaTeX Error', e.message)).render();
        }
    };
    Math.prototype.plainText = function () {
        return this.params[0];
    };
    return Math;
}(Components_1.InlineToken));
exports.Math = Math;
