"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-28.
 */
const SingletonMysql_1 = require("../common/SingletonMysql");
const Page_1 = require("./Page");
var Page_2 = require("./Page");
exports.IPage = Page_2.IPage;
class PageFactory {
    static getSrc(fulltitle, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = new Page_1.Page(fulltitle, false, user);
            yield page.loadPageInfo();
            return yield page.loadSrc();
        });
    }
    static edit(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.id)
                throw new Error('Error: required in function "edit" id');
            let page = Page_1.Page.createPageWithId(parseInt(data.id), user);
            yield page.loadPageInfo();
            page.srcStr = data.src;
            page.status = EPageStat.SET_SRC;
            page.major = data.major;
            yield page.save();
            return;
        });
    }
    static loadSrc() {
        let tmp = this;
        return SingletonMysql_1.default.queries((conn) => __awaiter(this, void 0, void 0, function* () {
            let rows, row;
            row = (yield conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [this.pageId, this.revId]))[0][0];
            if (!row)
                throw new Error('Invalid page id and rev_id: ' + this.pageId + ' , ' + this.revId + ' , ' + "title: " + this.titles);
            this.srcStr = row.text;
            this.major = row.major;
            // this.userId = row.user_id;
            // this.userText = row.userText;
            // this.comment = row.comment;
            // this.created = row.created;
            this.status = EPageStat.GET_SRC;
            return this;
        }));
    }
    static getRenderedPage(fulltitle, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = new Page_1.Page(fulltitle, false, user);
            yield page.loadPageInfo();
            yield page.loadSrc();
            return yield page.getRenderedPage();
        });
    }
}
exports.default = PageFactory;
