/**
 * Created by Le Reveur on 2017-10-29.
 */

import {Router} from "express";
import {NewPage, OldPage, Page, TempPage} from "../libs/wiki/Page";
import WikiHelper from "../libs/wiki/WikiHelper";

let router = Router();
router.post('/parse', async (req, res) => {
    console.log(req.body);
    let page = new TempPage(req.body.title);
    page.setSrc(req.body.text);
    page.getRen(null).then((ren) => {
        res.json({ok: 1, result: ren});
    }).catch((e) => {
        res.json({ok: 0, error: e.stack});
    });
});

router.get('/titleSearch', (req, res) => {
    WikiHelper.searchTitles(req.query.q)
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
            res.json({ok: 1, result: {fulltitle: title, isNew: true, readOnly: !user}});
        else if (page instanceof OldPage) {
            await page.getSrc(user);
            res.json({ok: 1, result: page});
        }
    } catch (e) {
        res.json({ok: 0, error: e.stack});
    }

});

export default router;
