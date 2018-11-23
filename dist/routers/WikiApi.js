"use strict";
/**
 * Created by Le Reveur on 2017-10-29.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Page_1 = require("../libs/wiki/Page");
const WikiHelper_1 = require("../libs/wiki/WikiHelper");
let router = express_1.Router();
router.post('/parse', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let page = new Page_1.TempPage(req.body.title);
    page.setSrc(req.body.text);
    page.getRen(null).then((ren) => {
        res.json({ ok: 1, result: ren });
    }).catch((e) => {
        res.status(500).json({ ok: 0, error: e.stack });
    });
}));
router.get('/titleSearch', (req, res) => {
    WikiHelper_1.default.searchTitles(req.user, req.query.q)
        .then(result => {
        res.json({ ok: 1, result: result });
    })
        .catch(e => {
        res.json({ ok: 0, error: e });
    });
});
router.get('/src', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let title = decodeURI(req.query.title);
    let user = req.user;
    try {
        let page = yield Page_1.Page.load(title);
        if (page instanceof Page_1.NewPage)
            res.json({ ok: 1, result: { fulltitle: title, isNew: true, readOnly: !user, tags: [] } });
        else if (page instanceof Page_1.OldPage) {
            yield page.getSrc(user);
            res.json({ ok: 1, result: page });
        }
    }
    catch (e) {
        res.json({ ok: 0, error: e.stack });
    }
}));
router.post('/edit', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let data = JSON.parse(req.body.data);
    if (!req.user)
        res.json({ ok: 0, error: (new Error('Login first.')).stack });
    else {
        try {
            let page = yield Page_1.Page.load(data.fulltitle);
            page.setSrc(data.srcStr);
            page.setTags(data.tags);
            page.save(req.user).then(() => {
                res.json({ ok: 1 });
            });
        }
        catch (e) {
            res.json({ ok: 0, error: e.stack });
        }
    }
}));
exports.default = router;
