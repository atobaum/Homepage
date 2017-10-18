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
            res.render('noPage', {title: decodeURI(req.params[0]), session: req.session});
        });

//         this.router.get(/\/view\/(.*)/, function (req, res) {
//             let title = decodeURI(req.params[0]);
//             let userId = req.session ? req.session.userId : null;
//             wiki.getParsedPage(title, userId, req.query.updateCache !== undefined)
//                 .then(page => {
//                     if (page.noPage) {
//                         res.redirect('/wiki/search/' + encodeURI(title));
//                     } else if (page.noPrivilege) {
//                         res.render('noPrivilege', {wikiTitle: title, priType: 4, session: req.session});
//                     } else {
//                         res.render('viewPage', {wiki: page, session: req.session});
//                     }
//                 })
//                 .catch(e => {
//                     res.render('error', {error: e, session: req.session});
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
            res.render('wiki/editPage', {wiki: data, session: req.session});
            //     wiki.getSrc(title, userId)
            //         .then(page => {
            //             if (page.noPage === 1) { //no namespace
            //                 res.render('error', {
            //                     error: {message: "You tried edit a page whose namespace is not exists:" + page.ns_title},
            //                     session: req.session
            //                 });
            //             } else if (page.noPage === 2) {
            //                 let data = {
            //                     title: page.title,
            //                     newPage: true,
            //                 };
            //                 res.render('editPage', {wiki: data, session: req.session});
            //             } else if (page.noPrivilege) {
            //                 res.render('noPrivilege', {wikiTitle: page.title, priType: 4, session: req.session});
            //             } else {
            //                 res.render('editPage', {wiki: page, session: req.session});
            //             }
            //         })
            //         .catch(e => {
            //             res.render('error', {error: e, session: req.session});
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
//         router.get('/admin', (req, res)=>{
//             res.render('admin', {session: req.session});
//         });
//
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
//                     res.render('noPrivilege', {wikiTitle: title, priType: 2, session: req.session});
//                 } else res.render('error', {error: e, session: req.session});
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
                    console.log(result)
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
//
//         router.get('/api/admin', async (req, res)=>{
//             try {
//                 let userId = req.session ? req.session.userId : null;
//                 if (!userId) return ({ok: 0, error: new Error('Please Login first.')});
//
//                 // let admin = await wiki.checkAdmin(userId);
//                 let admin = req.session.userAdmin;
//                 if (!admin) {res.json({ok: 0, error: new Error('No Privilege')}); return;}
//                 switch (req.query.action.toLowerCase()) {
//                     case 'clearcache':
//                         await wiki.clearCache(req.query.title).catch(e => {
//                             throw e;
//                         });
//                         res.json({ok: 1});
//                         break;
//                     case 'changetitle':
//                         let title = await wiki.changeTitle(req.query.title, req.query.newTitle).catch(e => {
//                             throw e;
//                         });
//
//                         if (title) res.json({ok: 1, title: title});
//                         else res.json({ok: 0, error: new Error('Fail to remane page')});
//                         break;
//                     default:
//                         res.json({ok:0, error: new Error('Unsupported Action: '+req.query.action)});
//                 }
//             } catch (e) {
//                 console.log(e);
//                 res.json({ok: 0, error: e});
//             }
//         });
//
//         // catch 404 and forward to error handler
//         this.router.use(function(req, res, next) {
//             let err: any = new Error('Not Found');
//             err.status = 404;
//             next(err);
//         });
//
//         // error handler
//         this.router.use(function(err, req, res, next) {
//             // set locals, only providing error in development
//             res.locals.message = err.message;
//             res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//             // render the error page
//             res.status(err.status || 500);
//             res.render('error', {session: req.session});
//         });
//
//         router.login = (uname, pass)=> wiki.login(uname, pass);
//         router.userInfo = wiki.userInfo;
//         router.createUser = wiki.createUser;
//         router.updateUser = wiki.updateUser;
//         router.checkUsername = wiki.checkUsername;
//         router.checkNickname = wiki.checkNickname;
    }

    public getRouter() {
        return this.router;
    }
}
