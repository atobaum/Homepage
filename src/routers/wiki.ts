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

        // this.router.get(/\/edit\/(.*)/, function (req, res) {
        //     let title = decodeURI(req.params[0]);
        //     let userId = req.userId;
        //     Page.getSrc(title, userId)
        //         .then(result=>{
        //             res.render('wiki/editPage', {page: result, newPage: false});
        //         })
        //         .catch(e=>res.render('error', {error:e}));
        // });
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
//             wiki.getRenderedPage(title, userId, function(err, page){
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
//             wiki.loadSrc(title, userId, function(err, page){
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
