"use strict";
import {Page} from "../libs/wiki/Page";
import {Router} from "express";

let router = Router();
router.get('/', (req, res) => {
    res.redirect('/wiki/view/index');
});

router.get(/\/search\/(.*)/, function (req, res) {
    res.render('noPage', {title: decodeURI(req.params[0]),});
});

router.get(/\/view\/(.*)/, function (req, res) {
    let title = decodeURI(req.params[0]);
    let userId = req.userId;
    Page.getRenderedPage(title, userId)
        .then((result) => {
            console.log(result);
            res.render('wiki/viewPage', {page: result});
        })
        .catch(e => {
            res.render('error', {error: e});
        });
});

router.get(/\/edit\/(.*)/, function (req, res) {
    let title = decodeURI(req.params[0]);
    let userId = req.userId;
    Page.getSrc(title, userId)
        .then(result => {
            console.log(result);
            res.render('wiki/editPage', {page: result});
        })
        .catch(e => {
            // console.log(e);
            res.render('error', {error: e})
        });
});
router.post(/\/edit\/(.*)/, function (req, res) {
    console.log(req.body);
    let title = decodeURI(req.params[0]);
    let data = req.body;
    if (!req.user)
        res.render("error", {error: new Error('Login first.')});
    else {
        Page.edit(data, req.user)
            .catch(e => {
                res.render('error', {error: e});
            })
            .then(() => {
                res.redirect('/wiki/view/' + encodeURI(title));
            });
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
