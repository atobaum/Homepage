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
var SingletonMysql_1 = require("../SingletonMysql");
var Parser_1 = require("./Parser");
/**
 * Created by Le Reveur on 2017-10-15.
 */
/**
 * @todo checkAC
 * @todo deleted
 */
var PageError = /** @class */ (function (_super) {
    __extends(PageError, _super);
    function PageError(type, stat, context) {
        var _this = this;
        var message = "ERROR: ";
        switch (type) {
            case EPageError.INVALID_OP:
                message += "Invalid Operation: " + context + " in " + PageStatToString(stat);
                break;
            case EPageError.NO_NS:
                message += "Invalid Namespace: " + context + " in " + PageStatToString(stat);
                break;
            case EPageError.NO_TITLE:
                message += "Invalid Title: " + context + " in " + PageStatToString(stat);
                break;
        }
        _this = _super.call(this, message) || this;
        _this.code = type;
        return _this;
    }
    return PageError;
}(Error));
var EPageError;
(function (EPageError) {
    EPageError[EPageError["NO_NS"] = 0] = "NO_NS";
    EPageError[EPageError["NO_TITLE"] = 1] = "NO_TITLE";
    EPageError[EPageError["INVALID_OP"] = 2] = "INVALID_OP";
})(EPageError || (EPageError = {}));
var EPageStat;
(function (EPageStat) {
    EPageStat[EPageStat["ONLY_TITLE"] = 0] = "ONLY_TITLE";
    EPageStat[EPageStat["PAGE_INFO"] = 1] = "PAGE_INFO";
    EPageStat[EPageStat["NS_INFO"] = 2] = "NS_INFO";
    EPageStat[EPageStat["SET_SRC"] = 3] = "SET_SRC";
    EPageStat[EPageStat["GET_SRC"] = 4] = "GET_SRC";
    EPageStat[EPageStat["RENDERED"] = 5] = "RENDERED";
    EPageStat[EPageStat["DELETED"] = 6] = "DELETED";
})(EPageStat = exports.EPageStat || (exports.EPageStat = {}));
function PageStatToString(stat) {
    switch (stat) {
        case EPageStat.ONLY_TITLE:
            return "ONLY_TITLE";
        case EPageStat.PAGE_INFO:
            return "PAGE_INFO";
        case EPageStat.NS_INFO:
            return "NS_INFO";
        case EPageStat.SET_SRC:
            return "SET_SRC";
        case EPageStat.GET_SRC:
            return "GET_SRC";
        case EPageStat.RENDERED:
            return "RENDERED";
    }
}
var Page = /** @class */ (function () {
    function Page(fulltitle, isNew) {
        if (!fulltitle)
            throw new Error("Error: title should be not empty.");
        this.titles = Page.parseTitle(fulltitle);
        this.isNew = isNew;
        this.status = EPageStat.ONLY_TITLE;
        this.PAC = [null, null];
    }
    Page.prototype.updateNs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== EPageStat.ONLY_TITLE)
                            throw new PageError(EPageError.INVALID_OP, this.status, "updateNs");
                        return [4 /*yield*/, SingletonMysql_1["default"].queries(function (conn) { return __awaiter(_this, void 0, void 0, function () {
                                var rows, row;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, conn.query('SELECT * FROM namespace WHERE ns_title=?', [this.titles[0]])];
                                        case 1:
                                            rows = (_a.sent())[0];
                                            if (rows.length === 0)
                                                throw new PageError(EPageError.NO_NS, this.status, this.titles[0]);
                                            else {
                                                row = rows[0];
                                                this.titles[0] = row.ns_title;
                                                this.nsId = row.ns_id;
                                                this.PAC = [row.ns_PAC, 0];
                                                return [2 /*return*/];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * @returns page{Promise} - A promise object that gives the page. If namespace doesn't exist, page.noPage = 1. If namespace exists but page is not, page.noPage = 2. Otherwise, page.noPage = undefined.
     */
    Page.prototype.updatePageInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== EPageStat.ONLY_TITLE)
                            throw new PageError(EPageError.INVALID_OP, this.status, "updatePageInfo");
                        return [4 /*yield*/, SingletonMysql_1["default"].queries(function (conn) { return __awaiter(_this, void 0, void 0, function () {
                                var query, rows, row;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            query = "SELECT * FROM fullpage WHERE ns_title = ? and page_title = ?";
                                            return [4 /*yield*/, conn.query(query, this.titles)];
                                        case 1:
                                            rows = (_a.sent())[0];
                                            if (rows.length === 0)
                                                throw new PageError(EPageError.NO_TITLE, this.status, this.titles.join(':'));
                                            row = rows[0];
                                            this.titles = [row.ns_title, row.page_title];
                                            if (row.deleted) {
                                                this.status = EPageStat.DELETED;
                                                return [2 /*return*/];
                                            }
                                            this.nsId = row.ns_id;
                                            this.pageId = row.page_id;
                                            this.PAC = [row.ns_PAC, row.page_PAC];
                                            this.cached = row.cached === 1;
                                            this.rev_id = row.rev_id;
                                            this.rev_counter = row.rev_counter;
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Page.prototype.setSrc = function (src) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== EPageStat.ONLY_TITLE)
                            throw new PageError(EPageError.INVALID_OP, this.status, "setSrc");
                        if (!this.isNew) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateNs()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.updatePageInfo()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.src = src;
                        this.status = EPageStat.SET_SRC;
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== EPageStat.SET_SRC)
                            throw new PageError(EPageError.INVALID_OP, this.status, "render");
                        return [4 /*yield*/, Parser_1["default"].render(this.titles, this.src)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Page.prototype.getSrc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.status !== EPageStat.ONLY_TITLE || this.isNew)
                    throw new PageError(EPageError.INVALID_OP, this.status, "getSrc, isNew");
                this.updatePageInfo();
                // if(this.status === EPageStat.DELETED)
                return [2 /*return*/, SingletonMysql_1["default"].queries(function (conn) { return __awaiter(_this, void 0, void 0, function () {
                        var rows, row;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [this.pageId, this.rev_id])];
                                case 1:
                                    row = (_a.sent())[0][0];
                                    this.src = row.text;
                                    this.minor = row.minor;
                                    // this.userId = row.user_id;
                                    // this.userText = row.userText;
                                    // this.comment = row.comment;
                                    // this.created = row.created;
                                    this.status = EPageStat.GET_SRC;
                                    return [2 /*return*/, this.src];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     *
     * @param fulltitle
     * @returns {[string,string]} [ns, title]
     */
    Page.parseTitle = function (fulltitle) {
        var regexTitle = /^(?:(.*?):)?(.+?)$/;
        var parsedTitle = regexTitle.exec(fulltitle);
        var ns;
        switch (parsedTitle[1]) {
            case undefined:
            case '':
                ns = 'Main';
                break;
            case '개인':
                ns = 'Private';
                break;
            case '분류':
                ns = 'Category';
                break;
            case '위키':
                ns = 'Wiki';
                break;
            default:
                ns = parsedTitle[1];
        }
        return [ns, parsedTitle[2]];
    };
    Page.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.status !== EPageStat.SET_SRC)
                    throw new PageError(EPageError.INVALID_OP, this.status, "save");
                if (this.isNew) {
                }
                else {
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * @function
     * @param{number} nsId
     * @param{number} pageId
     * @param{number} userId
     * @param{number} type - create(8), read(4), update(2), delete(1)
     * @param nsPAC
     * @param pagePAC
     * @property result - true if you can access.
     */
    Page.prototype.checkAC = function (nsId, pageId, userId, type, nsPAC, pagePAC) {
        //         if ((pagePAC && pagePAC & type) || (!pagePAC && nsPAC & type)) return Promise.resolve(true);
        //         else if (!userId) return Promise.resolve(false);
        //         else return this.makeWork2(async conn => {
        //                 let query = "SELECT AC FROM ACL WHERE user_id = ? and (ns_id = ? OR page_id = ?)";
        //                 let rows = await conn.query(query, [userId, nsId, pageId]).catch(e => {
        //                     throw e
        //                 });
        //                 if (rows.length === 0) return false;
        //                 else {
        //                     for (let i = 0; i < rows.length; i++) {
        //                         if (rows[i].AC & type) {
        //                             return true;
        //                         }
        //                     }
        //                     return false;
        //                 }
        //             });
    };
    ;
    Page.prototype.updatePageCache = function (pageInfo) {
        //         return this.makeWork2(async (conn) => {
        //             if (pageInfo.ns_title === 'Category')
        //                 await conn.query('INSERT INTO category (page_id, cat_title) VALUES (?, ?) ON DUPLICATE KEY UPDATE cat_title = ?', [pageInfo.page_id, pageInfo.page_title, pageInfo.page_title]).catch(e => {
        //                     throw e;
        //                 });
        //
        //             let query = "SELECT text FROM revision WHERE page_id = ? AND rev_id = ?";
        //             let rows = await conn.query(query, [pageInfo.page_id, pageInfo.rev_id]).catch(e => {
        //                 throw e;
        //             });
        //             if (rows.length === 0) throw new Error('Wrong Page Id: ' + pageInfo.page_id + ', Rev Id: ' + pageInfo.rev_id);
        //             let row = rows[0];
        //
        //             let [content, additional] = await this.parser.out(row.text, pageInfo.ns_title, pageInfo.page_title).catch(e => e);
        //
        //             if (additional.category.length === 0)
        //                 additional.category.push('미분류');
        //             await this.updateCategory(conn, pageInfo.page_id, additional.category, pageInfo.ns_title === 'Category' ? 0 : 1);
        //             if(pageInfo.cached === 0)
        //                 query = "INSERT INTO caching (page_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content=?";
        //             await conn.query(query, [pageInfo.page_id, content, content]).catch(e => {
        //                 throw e
        //             });
        //             return content;
        //         });
    };
    Page.prototype.getParsedPage = function (title, userId, updateCache) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    //
    //             let revision = {
    //                 page_id: data.page_id,
    //                 rev_id: data.rev_id,
    //                 user_id: userId,
    //                 user_text: page.userText,
    //                 text: page.text,
    //                 parent_id: data.parent_id,
    //                 minor: parseInt(page.major) ^ 1,
    //                 comment: page.comment
    //             };
    //
    //             if (!(revision.rev_id === 1 || revision.rev_id === 2)) {
    //                 await conn.query('UPDATE revision SET ? WHERE page_id = ? AND rev_id = ?', [{
    //                     user_id: userId,
    //                     user_text: page.userText,
    //                     text: page.text,
    //                     comment: page.comment
    //                 },
    //                     data.page_id,
    //                     data.rev_id - 1,
    //                 ]).catch(e => {
    //                     throw e;
    //                 });
    //
    //                 if (revision.minor === 0)
    //                     return await conn.query("INSERT INTO revision SET ?", [revision]);
    //             } else
    //                 return await conn.query("INSERT INTO revision SET ?", [revision]);
    //         })();
    // }
    /**
     *
     * @param conn
     * @param page_id
     * @param categories
     * @param type{number} - 0: subcategory, 1: page, 2:file
     * @returns {*}
     */
    // updateCategory(conn, page_id, categories, type = 1) {
    //         return this.makeTransaction(async conn => {
    //             let query = "DELETE FROM categorylink WHERE \`to\` = ?";
    //             await conn.query(query, [page_id]).catch(e => {
    //                 throw e
    //             });
    //             if (categories.length === 0) return;
    //
    //             query = "SELECT page_id, cat_title FROM category WHERE " +
    //                 categories.map(title => 'cat_title = ' + conn.escape(title)).join(' OR ');
    //             let rows = await conn.query(query).catch(e => {
    //                 throw e
    //             });
    //             if (rows.length === 0) return categories;
    //             query = "INSERT INTO categorylink (\`from\`, \`to\`, \`type\`) VALUES ?";
    //             await conn.query(query, [rows.map(row => [row.page_id, page_id, type])]).catch(e => {
    //                 throw e
    //             });
    //
    //             let lowercaseCat = categories.map(title => title.toLowerCase());
    //             rows.forEach(row => {
    //                 let i = lowercaseCat.indexOf(row.cat_title.toLowerCase());
    //                 if (i >= 0) {
    //                     categories.splice(i, 1);
    //                     lowercaseCat.splice(i, 1);
    //                 }
    //             });
    //             return categories;
    //         })();
    //     }
    Page.prototype.clearCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.status !== EPageStat.PAGE_INFO)
                    throw new PageError(EPageError.INVALID_OP, this.status, "clearCache");
                return [2 /*return*/, SingletonMysql_1["default"].queries(function (conn) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, conn.query('DELETE FROM caching WHERE page_id = ?', [this.pageId])];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Page.prototype.changeTitle = function (oldTitle, newTitle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Not implemented.");
            });
        });
    };
    return Page;
}());
exports["default"] = Page;
