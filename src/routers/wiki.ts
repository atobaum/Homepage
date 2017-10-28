"use strict";
import * as express from "express";
import {Page} from "../libs/wiki/Page";

export class WikiRouter {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', (req, res: express.Response) => {
            res.redirect('/wiki/view/index');
        });

        this.router.get(/\/search\/(.*)/, function (req, res) {
            res.render('noPage', {title: decodeURI(req.params[0]),});
        });

        this.router.get(/\/view\/(.*)/, function (req: express.Request, res) {
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

        this.router.get(/\/edit\/(.*)/, function (req, res) {
            let title = decodeURI(req.params[0]);
            let userId = req.userId;
            Page.getSrc(title, userId)
                .then(result => {
                    res.render('wiki/editPage', {page: result});
                })
                .catch(e => {
                    console.log(e);
                    res.render('error', {error: e})
                });
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

    }

    public getRouter() {
        return this.router;
    }
}
