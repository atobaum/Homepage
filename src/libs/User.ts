import SingletonMysql from "./SingletonMysql";
/**
 * Created by Le Reveur on 2017-10-18.
 */
export default class User {
    private id: number;
    private username: string;
    private admin: boolean;

    constructor(id, username, admin = false) {
        this.id = id;
        this.username = username;
        this.admin = admin;
    }

    getId() {
        return this.id;
    }

    getUsername() {
        return this.username;
    }
    // createUser(user, callback) {
        // this.conn.query("INSERT INTO user (username, nickname, password, email) VALUES (?, ?, PASSWORD(?), ?)", [user.username, user.nickname, user.password, user.email], callback);
    // }

    updateUser() {

    }

    static checkUsername(username) {
        return SingletonMysql.queries(conn => {
            return conn.query("SELECT user_id FROM user WHERE user_id=?", [username])
                .then(res => res[0].length !== 0);
        });
    }

    static checkNickname(username): Promise<boolean> {
        return SingletonMysql.queries(conn => {
            return conn.query("SELECT user_id FROM user WHERE nickname=?", [username])
                .then(res => res[0].length !== 0);
        });
    }

    static login(username, password): Promise<User> {
        return SingletonMysql.query("SELECT user_id, nickname, admin, password = PASSWORD(?) as correct FROM user WHERE username = ?", [password, username])
            .then(res => {
                let user = res[0][0];
                if (!res[0].length) {
                    let e: any = new Error('Wrong username');
                    e.code = 2;
                    throw e;
                } else if (user.correct != 1) {
                    let e: any = new Error('Wrong password');
                    e.code = 0;
                    throw e;
                } else
                    return new User(user.user_id, user.nickname, user.admin == 1);
            });
    }
}
