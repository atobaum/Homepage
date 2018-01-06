/**
 * Created by Le Reveur on 2017-10-28.
 */
import SingletonMysql from "../common/SingletonMysql";
export {IPage} from './Page'

export default class PageFactory {
    static async getSrc(fulltitle, user) {
        let page = new Page(fulltitle, false, user);
        await page.loadPageInfo();
        return await page.loadSrc();
    }

    static async edit(data, user) {
        if (!data.id)
            throw new Error('Error: required in function "edit" id');
        let page = Page.createPageWithId(parseInt(data.id), user);
        await page.loadPageInfo();
        page.srcStr = data.src;
        page.status = EPageStat.SET_SRC;
        page.major = data.major;
        await page.save();
        return;
    }

    static loadSrc(): Promise<any> {
        let tmp = this;
        return SingletonMysql.queries(async conn => {
            let rows, row;
            row = (await conn.query("SELECT * FROM revision WHERE page_id = ? AND rev_id = ?", [this.pageId, this.revId]))[0][0];
            if (!row)
                throw new Error('Invalid page id and rev_id: ' + this.pageId + ' , ' + this.revId + ' , ' + "title: " + this.titles);
            this.srcStr = row.text;
            this.major = row.major;
            // this.userId = row.user_id;
            // this.userText = row.userText;
            // this.comment = row.comment;
            // this.created = row.created;
            this.status = EPageStat.GET_SRC;
            return this;
        });
    }

    static async getRenderedPage(fulltitle, user) {
        let page = new Page(fulltitle, false, user);
        await page.loadPageInfo();
        await page.loadSrc();
        return await page.getRenderedPage();
    }

}