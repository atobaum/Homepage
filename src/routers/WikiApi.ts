/**
 * Created by Le Reveur on 2017-10-29.
 */

import {Router} from "express";
import {Page} from "../libs/wiki/Page";
import WikiHelper from "../libs/wiki/WikiHelper";

let router = Router();
router.post('/parse', async (req, res) => {
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

router.get('/titleSearch', (req, res) => {
    WikiHelper.searchTitles(req.query.q)
        .then(result => {
            res.json({ok: 1, result: result})
        })
        .catch(e => {
            res.json({ok: 0, error: e});
        });
});

export default router;
