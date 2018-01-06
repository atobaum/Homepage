"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../libs/wiki/Page");
const express_1 = require("express");
let router = express_1.Router();
router.get('/', (req, res) => {
    res.redirect('/wiki/view/index');
});
router.get(/\/search\/(.*)/, function (req, res) {
    res.render('wiki/noPage', {title: decodeURI(req.params[0]),});
});
router.get(/\/view\/(.*)/, (req, res) => __awaiter(this, void 0, void 0, function*() {
    let title = decodeURI(req.params[0]);
    let user = req.user;
    try {
        let page = yield Page_1.Page.load(title);
        if (page instanceof Page_1.NewPage) {
            res.redirect('/wiki/search/' + title);
        }
        else if (page instanceof Page_1.OldPage) {
            yield page.getSrc(user);
            yield page.getRen(user);
            res.render('wiki/viewPage', {page: page});
        }
    }
    catch (e) {
        res.render('error', {error: e});
    }
}));
router.get(/\/edit\/(.*)/, (req, res) => __awaiter(this, void 0, void 0, function*() {
    let title = decodeURI(req.params[0]);
    res.render('wiki/editPage', {page: {fulltitle: title}});
}));
router.post(/\/edit\/(.*)/, (req, res) => __awaiter(this, void 0, void 0, function*() {
    let data = req.body;
    if (!req.user)
        res.render("error", {error: new Error('Login first.')});
    else {
        let page = yield Page_1.Page.load(data.title);
        page.setSrc(data.src);
        page.save(req.user).then(() => {
            res.redirect('/wiki/view/' + data.title);
        }).catch(e => {
            res.render("error", {error: e});
        });
        // Page.edit(data, req.user)
        //     .catch(e => {
        //         res.render('error', {error: e});
        //     })
        //     .then(() => {
        //         res.redirect('/wiki/view/' + encodeURI(title));
        //     });
        // data.userText = data.user || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // wiki.editPage(data, userId)
        //     .then(() => {
        //     }).catch(e => {
        //     if (e.name === "NO_PRIVILEGE") {
        //         res.render('noPrivilege', {wikiTitle: title, priType: 2, });
        //     } else res.render('error', {error: e, });
        // });
    }
}));
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
exports.default = router;
