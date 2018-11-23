/**
 * Created by Le Reveur on 2017-10-29.
 */

import {Router} from "express";
import {NewPage, OldPage, Page, TempPage} from "../libs/wiki/Page";
import WikiHelper from "../libs/wiki/WikiHelper";

let router = Router();
router.post('/parse', async (req, res) => {
    let page = new TempPage(req.body.title);
    page.setSrc(req.body.text);
    page.getRen(null).then((ren) => {
        res.json({ok: 1, result: ren});
    }).catch((e) => {
        res.status(500).json({ok: 0, error: e.stack});
    });
});

router.get('/titleSearch', (req, res) => {
    WikiHelper.searchTitles(req.user, req.query.q)
        .then(result => {
            res.json({ok: 1, result: result})
        })
        .catch(e => {
            res.json({ok: 0, error: e});
        });
});


router.get('/src', async (req, res) => {
    let title = decodeURI(req.query.title);
    let user = req.user;
    try {
        let page = await Page.load(title);
        if (page instanceof NewPage)
            res.json({ok: 1, result: {fulltitle: title, isNew: true, readOnly: !user, tags: []}});
        else if (page instanceof OldPage) {
            await page.getSrc(user);
            res.json({ok: 1, result: page});
        }
    } catch (e) {
        res.json({ok: 0, error: e.stack});
    }

});

router.post('/edit', async (req, res) => {
    let data = JSON.parse(req.body.data);
    if (!req.user)
        res.json({ok: 0, error: (new Error('Login first.')).stack});
    else {
        try {
            let page = await Page.load(data.fulltitle);
            page.setSrc(data.srcStr);
            page.setTags(data.tags);
            page.save(req.user).then(() => {
                res.json({ok: 1});
            })
        } catch (e) {
            res.json({ok: 0, error: e.stack});
        }
    }
});

router.get('/admin', (req:any, res)=>{
    if(!req.user.getAdmin()) {
        res.json({ok: 0, error: new Error("You are not amin.")});
        return;
    }
    console.log(req.query.action);

    switch (req.query.action){
        case 'getPAC':
            WikiHelper.getPAC(req.user, req.query.title)
                .then(result=>{
                    if(result)
                        res.json({ok:1, result: result});
                    else
                        res.json({ok: 0});
                })
                .catch(e => {
                    res.json({ok: 0, error: e});
                });
            break;

        case 'setPAC':
            WikiHelper.setPAC(req.user, req.query.title, req.query.pac)
                .then(result=>{
                    if(result)
                        res.json({ok:1});
                    else
                        res.json({ok: 0});
                })
                .catch(e => {
                    res.json({ok: 0, error: e});
                });
            break;
    }
});

export default router;
