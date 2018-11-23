import SingletonMysql from "../common/SingletonMysql";
import {IPage} from "./Page";
import User from "../common/User";
/**
 * Created by Le Reveur on 2017-10-17.
 */
export default class WikiHelper {
    private constructor() {
    }

    /**
     * @async
     * @param title
     */
    static searchTitles(user: User, title: string) {
        let parsedTitle = IPage.parseTitle(title);
        return SingletonMysql.query('SELECT ns_title, page_title, ns_PAC, page_PAC FROM fullpage WHERE ns_title LIKE "%' + parsedTitle[0] + '%" AND page_title LIKE "' + parsedTitle[1] + '%" AND deleted = 0 LIMIT 7')
            .then(([rows]) => {
                let res = [];
                for(let item of rows){
                    if(user || (item.page_PAC && (item.page_PAC & 16)) || (!item.page_PAC && (item.ns_PAC & 16))){ //로그인 되있으면 pass
                        let title = (item.ns_title === 'Main' ? '' : item.ns_title + ':') + item.page_title;
                        res.push({
                            title: title,
                            url: '/wiki/view/' + title
                        });
                    }
                }
                return res;
            });
    }
}
//     getPageList(catTitle) {
//         return this.makeWork2(async conn => {
//             let query = 'SELECT page_id, cat_title, num_page, num_subcat, num_file FROM category WHERE cat_title = ?';
//             let [cat] = await conn.query(query, [catTitle]).catch(e => {
//                 throw e;
//             });
//             if (!cat) throw new Error('Wrong category title: ' + catTitle);
//
//             query = 'SELECT categorylink.type as type, fullpage.ns_title as ns_title, fullpage.page_title as page_title FROM categorylink, fullpage WHERE categorylink.from = ? AND fullpage.page_id = categorylink.to';
//             let rows = await conn.query(query, [cat.page_id]).catch(e => {
//                 throw e
//             });
//             let result = [[], [], []]; //result[0] is for subcategory, result[1] for page, result[2] for file
//             rows.forEach(item => {
//                 if (item.type > 2 && item.type < 0) throw new Error('Invalid categorylink.type = ' + item.type);
//                 result[item.type].push((item.ns_title === 'Main' ? '' : item.ns_title + ':') + item.page_title);
//             });
//             return result;
//         });
//     }
//
//     existPages(titles) {
//         let thisClass = this;
//         return this.makeWork2(async conn => {
//             for (let i = 0; i < titles.length; i++) {
//                 let parsedTitle = Wiki.parseTitle(titles[i]);
//                 titles[i] = (await conn.query('SELECT page_id from fullpage where ns_title = ? and page_title = ?', parsedTitle)).length !== 0;
//             }
//         })
//     }
//
//     existingPages(titles, ns = 'Main') {
//         let thisClass = this;
//         if (titles.length === 0) return Promise.resolve([]);
//         return this.makeWork2(async conn => {
//             let query = 'SELECT ns_title, page_title from fullpage WHERE ';
//             query += titles.map(item => {
//                 let parsedTitle = Wiki.parseTitle(item);
//                 return '(ns_title = ' + conn.escape(parsedTitle[0]) + ' AND page_title = ' + conn.escape(parsedTitle[1]) + ')'
//             }).join(' OR ');
//             let rows = conn.query(query).catch(e => {
//                 throw e
//             });
//             return rows.map(item => ((item.ns_title === 'Main' ? '' : item.ns_title + ':') + item.page_title).toLowerCase());
//         })
//     }
//     backup(dest, callback) {
//         let mysqlDump = require('mysqldump');
//         mysqlDump({
//             host: config.host,
//             port: config.port,
//             user: config.user,
//             password: config.password,
//             database: config.database,
//             dest: dest
//         }, function (err) {
//             callback(err);
//         })
//     }
