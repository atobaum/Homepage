"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Components = require("./Components");
var Components_1 = require("./Components");
var TOC_1 = require("./Components/TOC");
/**
 * Created by Le Reveur on 2017-10-17.
 */
var SectionEnv = /** @class */ (function () {
    function SectionEnv() {
        this.key = Components_1.ETokenType.SECTION;
        this.toc = new TOC_1.TOC(null, null);
    }
    SectionEnv.prototype.afterScan = function (toks) {
        toks.unshift(this.toc.root);
        return;
    };
    SectionEnv.prototype.makeToken = function (_a) {
        var level = _a[0], toks = _a[1];
        var section = new Components_1.Section(toks);
        this.toc = this.toc.addSection(level, section);
        return section;
    };
    return SectionEnv;
}());
exports.SectionEnv = SectionEnv;
var LinkEnv = /** @class */ (function () {
    function LinkEnv(ns) {
        if (ns === void 0) { ns = "Main"; }
        this.key = Components_1.ETokenType.LINK;
        this.ns = ns;
        this.links = [];
    }
    LinkEnv.prototype.afterScan = function (toks) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, undefined];
            });
        });
    };
    LinkEnv.prototype.makeToken = function (_a) {
        var ns = _a[0], title = _a[1], anchor = _a[2], text = _a[3];
        title = title || 'Index';
        var href;
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
        var link = new Components_1.Link(ns, title, href, text);
        this.links.push(link);
        return link;
    };
    return LinkEnv;
}());
exports.LinkEnv = LinkEnv;
var FootnoteEnv = /** @class */ (function () {
    function FootnoteEnv() {
        this.key = Components_1.ETokenType.RFOOTNOTE;
        this.fns = [];
    }
    FootnoteEnv.prototype.afterScan = function (toks) {
        return null;
    };
    FootnoteEnv.prototype.makeToken = function (inlineToks) {
        var fn = new Components_1.Footnote(this.fns.length, inlineToks);
        this.fns.push(fn);
        return fn.getRef();
    };
    return FootnoteEnv;
}());
exports.FootnoteEnv = FootnoteEnv;
var TitleEnv = /** @class */ (function () {
    function TitleEnv(titles) {
        this.key = Components_1.ETokenType.TITLE;
        this.fulltitle = "" + ((titles[0] !== 'Main' ? titles[0] + ':' : '') + titles[1]);
    }
    TitleEnv.prototype.afterScan = function (toks) {
        toks.unshift(new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle));
        return null;
    };
    TitleEnv.prototype.makeToken = function (args) {
        return new Components.SimpleTag('h1', 'class="wiki_title"', this.fulltitle);
    };
    return TitleEnv;
}());
exports.TitleEnv = TitleEnv;
