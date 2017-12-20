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
var express = require("express");
var Page_1 = require("../libs/wiki/Page");
var WikiRouter = /** @class */ (function () {
    function WikiRouter() {
        this.router = express.Router();
        this.routes();
    }
    WikiRouter.prototype.routes = function () {
        var _this = this;
        this.router.get('/', function (req, res) {
            res.redirect('/wiki/view/index');
        });
        this.router.get(/\/search\/(.*)/, function (req, res) {
            res.render('noPage', { title: decodeURI(req.params[0]) });
        });
        //         this.router.get(/\/view\/(.*)/, function (req, res) {
        //             let title = decodeURI(req.params[0]);
        //             let userId = req.session ? req.session.userId : null;
        //             wiki.getParsedPage(title, userId, req.query.updateCache !== undefined)
        //                 .then(page => {
        //                     if (page.noPage) {
        //                         res.redirect('/wiki/search/' + encodeURI(title));
        //                     } else if (page.noPrivilege) {
        //                         res.render('noPrivilege', {wikiTitle: title, priType: 4, });
        //                     } else {
        //                         res.render('viewPage', {wiki: page, });
        //                     }
        //                 })
        //                 .catch(e => {
        //                     res.render('error', {error: e, });
        //                 });
        //         });
        //
        this.router.get(/\/edit\/(.*)/, function (req, res) {
            var title = decodeURI(req.params[0]);
            var userId = req.session ? req.session.userId : null;
            var newPage = req.query.newPage;
            var data = {
                title: title,
                newPage: true
            };
            res.render('wiki/editPage', { wiki: data });
            //     wiki.getSrc(title, userId)
            //         .then(page => {
            //             if (page.noPage === 1) { //no namespace
            //                 res.render('error', {
            //                     error: {message: "You tried edit a page whose namespace is not exists:" + page.ns_title},
            //
            //                 });
            //             } else if (page.noPage === 2) {
            //                 let data = {
            //                     title: page.title,
            //                     newPage: true,
            //                 };
            //                 res.render('editPage', {wiki: data, });
            //             } else if (page.noPrivilege) {
            //                 res.render('noPrivilege', {wikiTitle: page.title, priType: 4, });
            //             } else {
            //                 res.render('editPage', {wiki: page, });
            //             }
            //         })
            //         .catch(e => {
            //             res.render('error', {error: e, });
            //         });
        });
        //
        //         router.get(/\/history\/(.*)/, function (req, res) {
        //             res.render('error', {
        //                 error: {message: "준비중..."}
        //             });
        //         });
        //
        // //backlinks
        //         router.get(/\/xref\/(.*)/, function (req, res) {
        //             res.render('error', {
        //                 error: {message: "준비중..."}
        //             });
        //         });
        //
        // //for backend
        //         router.get(/\/delete\/(.*)/, function (req, res) {
        //             res.render('error', {
        //                 error: {message: "준비중..."}
        //             });
        //         });
        //
        //         router.post(/\/edit\/(.*)/, function (req, res) {
        //             let title = decodeURI(req.params[0]);
        //             let data = req.body;
        //             data.title = title;
        //             let userId = (req.session && req.session.userId) ? req.session.userId : null;
        //             data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //             wiki.editPage(data, userId)
        //                 .then(() => {
        //                     res.redirect('/wiki/view/' + encodeURI(title));
        //                 }).catch(e => {
        //                 if (e.name === "NO_PRIVILEGE") {
        //                     res.render('noPrivilege', {wikiTitle: title, priType: 2, });
        //                 } else res.render('error', {error: e, });
        //             });
        //         });
        //
        this.router.post('/api/parse', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = new Page_1["default"](req.body.title, true);
                        return [4 /*yield*/, page.setSrc(req.body.text)["catch"](function (e) {
                                res.json(e);
                            })];
                    case 1:
                        _a.sent();
                        page.render()
                            .then(function (result) {
                            res.json(result);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        //
        //         router.get(/\/api\/parse\/(.*)/, function(req, res){
        //             let title = decodeURI(req.params[0]);
        //             let userId = req.session ? req.session.userId : null;
        //             wiki.getParsedPage(title, userId, function(err, page){
        //                 if(err){
        //                     if(err.name === 'NO_PAGE_ERROR') {
        //                         res.json({ok:2, error: err});
        //                     } else{
        //                         res.json({ok:0, error: err});
        //                     }
        //                 }else{
        //                     res.json({ok:1, result: page});
        //                 }
        //             });
        //         });
        //
        //         router.get(/\/api\/rawtext\/(.*)/, function(req, res){
        //             let title = decodeURI(req.params[0]);
        //             let userId = req.session ? req.session.userId : null;
        //             wiki.getSrc(title, userId, function(err, page){
        //                 if(err){
        //                     if(err.name === 'NO_PAGE_ERROR') {
        //                         res.json({ok:2, error: err});
        //                     } else{
        //                         res.json({ok:0, error: err});
        //                     }
        //                 }else{
        //                     res.json({ok:1, result: page});
        //                 }
        //             });
        //         });
        //
        //         router.post(/\/api\/edit\/(.*)/, function(req, res){
        //             let title = decodeURI(req.params[0]);
        //             let data = req.body;
        //             data.title = title;
        //             data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //             let userId = req.session ? req.session.userId : null;
        //             wiki.editPage(data, userId)
        //                 .then(() => {
        //                     res.json({ok: 1})
        //                 }).catch(e => {
        //                 res.json({ok: 0, error: e})
        //             });
        //         });
        //
        //         router.get('/api/titleSearch', (req, res) => {
        //             wiki.searchTitles(req.query.q)
        //                 .then(result => {
        //                     res.json({ok: 1, result: result})
        //                 })
        //                 .catch(e => {
        //                     res.json({ok: 0, error: e});
        //                 });
        //         });
    };
    WikiRouter.prototype.getRouter = function () {
        return this.router;
    };
    return WikiRouter;
}());
exports.WikiRouter = WikiRouter;
