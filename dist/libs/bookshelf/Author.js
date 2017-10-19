"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * Created by Le Reveur on 2017-10-18.
 */
const SingletonMysql_1 = require("../SingletonMysql");
var EAuthorType;
(function (EAuthorType) {
    EAuthorType["AUTHOR"] = "\uC9C0\uC74C";
    EAuthorType["TRANSLATOR"] = "\uBC88\uC5ED";
    EAuthorType["SUPERVISOR"] = "\uAC10\uC218";
    EAuthorType["ILLUSTRATOR"] = "\uADF8\uB9BC";
    EAuthorType["PHOTO"] = "\uC0AC\uC9C4";
})(EAuthorType = exports.EAuthorType || (exports.EAuthorType = {}));
class Author {
    constructor(name, type) {
        if (!(name && type))
            throw new Error('constructor argument not fulfilled: Author');
        this.type = type;
        this.name = name;
    }

    toString() {
        return this.name + ' ' + this.type;
    }

    static formatAuthors(authors) {
        return authors.map(author => author.toString()).join(', ');
    }

    searchPerson(type, keyword) {
        return __awaiter(this, void 0, void 0, function*() {
            return (yield SingletonMysql_1.default.query('SELECT * FROM people WHERE ? LIKE "' + keyword + '%"', [type]))[0];
        });
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
    static createFromJSON(json) {
        let type;
        switch (json.type) {
            case '지음':
                type = EAuthorType.AUTHOR;
                break;
            case '번역':
                type = EAuthorType.TRANSLATOR;
                break;
        }
        return new Author(json.name, type);
    }
}
exports.Author = Author;
