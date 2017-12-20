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
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(text) {
        return _super.call(this, [text]) || this;
    }
    Text.prototype.render = function () {
        return this.params[0];
    };
    Text.prototype.plainText = function () {
        return this.params[0];
    };
    return Text;
}(Components_1.InlineToken));
exports.Text = Text;
var SelfClosingSimpleTag = /** @class */ (function (_super) {
    __extends(SelfClosingSimpleTag, _super);
    function SelfClosingSimpleTag(tag, param) {
        return _super.call(this, [tag, param]) || this;
    }
    SelfClosingSimpleTag.prototype.render = function () {
        return "<" + this.params[0] + (this.params[1] ? ' ' + this.params[1] : '') + ">";
    };
    SelfClosingSimpleTag.prototype.plainText = function () {
        return '';
    };
    return SelfClosingSimpleTag;
}(Components_1.InlineToken));
exports.SelfClosingSimpleTag = SelfClosingSimpleTag;
var SimpleTag = /** @class */ (function (_super) {
    __extends(SimpleTag, _super);
    function SimpleTag(tag, param, text) {
        return _super.call(this, [tag, param, text]) || this;
    }
    SimpleTag.prototype.plainText = function () {
        return this.params[2];
    };
    ;
    SimpleTag.prototype.render = function () {
        return "<" + this.params[0] + (this.params[1] ? ' ' + this.params[1] : '') + ">" + this.params[2] + "</" + this.params[0] + ">";
    };
    return SimpleTag;
}(Components_1.InlineToken));
exports.SimpleTag = SimpleTag;
var TagDecorator = /** @class */ (function (_super) {
    __extends(TagDecorator, _super);
    function TagDecorator(tag, param, innerTok) {
        var _this = _super.call(this, [tag, param]) || this;
        _this.innerTok = innerTok;
        return _this;
    }
    TagDecorator.prototype.plainText = function () {
        return this.innerTok.plainText();
    };
    TagDecorator.prototype.render = function () {
        return "<" + this.params[0] + (this.params[1] ? ' ' + this.params[1] : '') + ">" + this.innerTok.render() + "</" + this.params[0] + ">";
    };
    return TagDecorator;
}(Components_1.InlineToken));
exports.TagDecorator = TagDecorator;
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(toks) {
        return _super.call(this, toks) || this;
    }
    Line.prototype.render = function () {
        return this.renderContent();
    };
    return Line;
}(Components_1.BlockToken));
exports.Line = Line;
var EmptyLine = /** @class */ (function (_super) {
    __extends(EmptyLine, _super);
    function EmptyLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmptyLine.prototype.render = function () {
        return '';
    };
    EmptyLine.prototype.plainText = function () {
        return '';
    };
    return EmptyLine;
}(Components_1.Macro));
exports.EmptyLine = EmptyLine;
var Section = /** @class */ (function (_super) {
    __extends(Section, _super);
    function Section(toks) {
        return _super.call(this, toks) || this;
    }
    Object.defineProperty(Section.prototype, "toc", {
        set: function (toc) {
            this._toc = toc;
        },
        enumerable: true,
        configurable: true
    });
    Section.prototype.render = function () {
        var indexList = this._toc.indexList;
        var formattedLevel = indexList.join('_');
        return '<h'
            + indexList.length
            + ' class="ui dividing header" id="'
            + "h_" + formattedLevel
            + '">'
            + ("<a href=\"#rh_" + formattedLevel + "\">" + indexList.join('.') + "</a> ")
            + this.renderContent()
            + '</h'
            + indexList.length
            + '>';
    };
    return Section;
}(Components_1.BlockToken));
exports.Section = Section;
var Error = /** @class */ (function (_super) {
    __extends(Error, _super);
    function Error(title, text) {
        return _super.call(this, [title, text]) || this;
    }
    Error.prototype.render = function () {
        return "<div class=\"ui negative message\"><div class=\"header\">" + this.params[0] + "</div><p>" + this.params[1] + "</p></div>";
    };
    Error.prototype.plainText = function () {
        return '';
    };
    return Error;
}(Components_1.InlineToken));
exports.Error = Error;
