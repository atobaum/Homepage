/**
 * Created by Le Reveur on 2017-10-18.
 */
import SingletonMysql from "../SingletonMysql";
export enum EAuthorType{
    AUTHOR = "지음", TRANSLATOR = "번역", SUPERVISOR = "감수", ILLUSTRATOR = "그림", PHOTO = "사진"
}

export class Author {
    type: EAuthorType;
    name: string;

    constructor(name, type) {
        this.type = type;
        this.name = name;
    }

    toString() {
        return this.name + ' ' + this.type;
    }

    static formatAuthors(authors: Author[]) {
        return authors.map(author => author.toString()).join(', ');
    }

    async searchPerson(type, keyword) {
        return (await SingletonMysql.query('SELECT * FROM people WHERE ? LIKE "' + keyword + '%"', [type]))[0];
    }

    // async save(bookId){
    //     if (typeof(author.type) === "string"){
    //         switch(author.type){
    //             case '저자':
    //             case 'author':
    //                 author.type = 1;
    //                 break;
    //             case '옮김':
    //             case 'translator':
    //                 author.type = 2;
    //                 break;
    //             case '감수':
    //             case 'supervisor':
    //                 author.type = 3;
    //                 break;
    //             case '그림':
    //             case 'illustrator':
    //                 author.type = 4;
    //                 break;
    //             case '사진':
    //             case 'photo':
    //                 author.type = 5;
    //                 break;
    //             case '엮음':
    //             case 'editor':
    //                 author.type = 6;
    //                 break;
    //             default:
    //                 callback(new Error("지원하지 않는 저자 타입: "+author.type));
    //                 return;
    //         }
    //     }
    //
    //     async.waterfall([
    //         (next) => {
    //             thisClass.conn.query('INSERT INTO people (name_ko) VALUES (?)', [author.name], (err, result) => {
    //                 if(err && err.code === 'ER_DUP_ENTRY'){
    //                     next(null, null);
    //                 } else {next(err, (result ? result.insertId : null));}
    //             });
    //         },
    //         (person_id, next) => {
    //             if(person_id) next(null, person_id);
    //             else {
    //                 thisClass.conn.query('SELECT * FROM people WHERE name_ko=?', [author.name], (err, rows) => {
    //                     next(err, (rows ? rows[0].id : null));
    //                 });
    //             }
    //         },
    //         (person_id, next) => {
    //             let query = 'INSERT INTO author_to_person (book_id, person_id, type_id) VALUES (?, ?, ?)';
    //             thisClass.conn.query(query, [bookId, person_id, author.type], (err) => {
    //                 next(err);
    //             });
    //         }
    //     ], callback);
    // },
}