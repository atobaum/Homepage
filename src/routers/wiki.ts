"use strict";
import {NewPage, OldPage, Page} from "../libs/wiki/Page";
import {Router} from "express";

let router = Router();
router.get('/', (req, res) => {
    res.redirect('/wiki/view/index');
});

router.get(/\/search\/(.*)/, function (req, res) {
    res.render('wiki/noPage', {title: decodeURI(req.params[0]),});
});

router.get(/\/view\/(.*)/, async (req, res) => {
    let title = decodeURI(req.params[0]);
    let user = req.user;
    try {
        let page = await Page.load(title);
        if (page instanceof NewPage) {
            res.redirect('/wiki/search/' + title);
        }
        else if (page instanceof OldPage) {
            await page.getSrc(user);
            await page.getRen(user);
            res.render('wiki/viewPage', {page: page});
        }
    } catch (e) {
        res.render('error', {error: e.stack});
    }
});

router.get(/\/edit\/(.*)/, async (req, res) => {
    let title = decodeURI(req.params[0]);
    let user = req.user;
    try {
        let page = await Page.load(title);
        if (page instanceof NewPage)
            res.render('wiki/editPage', {page: {fulltitle: title, isNew: true, readOnly: !user}});
        else if (page instanceof OldPage) {
            await page.getSrc(user);
            res.render('wiki/editPage', {page: page});
        }
    } catch (e) {
        res.render('error', {error: e.stack});
    }
});

router.post(/\/edit\/(.*)/, async (req, res) => {
    let data = req.body;
    if (!req.user)
        res.render("error", {error: new Error('Login first.')});
    else {
        let page = await Page.load(data.title);
        page.setSrc(data.src);
        page.save(req.user).then(() => {
            res.redirect('/wiki/view/' + data.title);
        }).catch(e => {
            res.render("error", {error: e});
        })

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

export default router;
