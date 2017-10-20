"use strict";
import * as express from "express";
import Page from "../libs/wiki/Page";

export class WikiRouter {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', (req: express.Request, res: express.Response) => {
            res.redirect('/wiki/view/index');
        });

        this.router.get(/\/search\/(.*)/, function (req, res) {
            res.render('noPage', {title: decodeURI(req.params[0]),});
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
            let title = decodeURI(req.params[0]);
            let userId = req.session ? req.session.userId : null;
            let newPage = req.query.newPage;
            let data = {
                title: title,
                newPage: true,
            };
            res.render('wiki/editPage', {wiki: data,});
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
        this.router.post('/api/parse', async (req, res) => {
            let page = new Page(req.body.title, true);
            await page.setSrc(req.body.text)
                .catch(e => {
                    res.json(e)
                });
            page.render()
                .then(result => {
                    res.json(result);
                });
        });
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
    }

    public getRouter() {
        return this.router;
    }
}
