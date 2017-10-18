/**
 * Created by Le Reveur on 2017-10-18.
 */
export default class User {
    userInfo() {

    }

    createUser(user, callback) {
        // this.conn.query("INSERT INTO user (username, nickname, password, email) VALUES (?, ?, PASSWORD(?), ?)", [user.username, user.nickname, user.password, user.email], callback);
    }

    updateUser() {

    }

    checkUsername(username) {
//         return this.makeWork2(async conn => {
//             let rows = await conn.query("SELECT user_id FROM user WHERE username=?", [username]);
//             return rows.length !== 0
//         })
    }
//
//     checkNickname(username) {
//         return this.makeWork2(async conn => {
//             let rows = await conn.query("SELECT user_id FROM user WHERE nickname=?", [username]);
//             return rows.length !== 0
//         })
//     }
//     login(username, password) {
//         return this.makeWork(async (conn) => {
//             let [user] = await conn.query("SELECT user_id, nickname, admin, password = PASSWORD(?) as correct FROM user WHERE username = ?", [password, username]).catch(e => {
//                 throw e
//             });
//             return [(user ? user.correct : 2), user];
//         })();
//     }
//     checkAdmin(userId){
//         if (!userId) return Promise.resolve(false);
//         return this.makeWork2(async conn=> {
//             let users = await conn.query('SELECT admin FROM user WHERE user_id = ?', [userId]).catch(e => {
//                 throw e
//             });
//             if (users.length === 0) throw new Error("Wrong User Id");
//             else if (users[0].admin === 1) return true;
//             else return false;
//         });
//     }
// }
}
