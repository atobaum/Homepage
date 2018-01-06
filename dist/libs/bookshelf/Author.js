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
const SingletonMysql_1 = require("../common/SingletonMysql");
var EAuthorType;
(function (EAuthorType) {
    EAuthorType["AUTHOR"] = "\uC9C0\uC74C";
    EAuthorType["TRANSLATOR"] = "\uBC88\uC5ED";
    EAuthorType["SUPERVISOR"] = "\uAC10\uC218";
    EAuthorType["ILLUSTRATOR"] = "\uADF8\uB9BC";
    EAuthorType["PHOTO"] = "\uC0AC\uC9C4";
    EAuthorType["EDITOR"] = "\uAC10\uC218";
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
    save(bookId) {
        let type;
        switch (this.type) {
            case EAuthorType.AUTHOR:
                type = 1;
                break;
            case EAuthorType.TRANSLATOR:
                type = 2;
                break;
            case EAuthorType.SUPERVISOR:
                type = 3;
                break;
            case EAuthorType.ILLUSTRATOR:
                type = 4;
                break;
            case EAuthorType.PHOTO:
                type = 5;
                break;
            case EAuthorType.EDITOR:
                type = 6;
                break;
        }
        return SingletonMysql_1.default.transaction((conn) => __awaiter(this, void 0, void 0, function*() {
            let [rows] = yield conn.query('INSERT INTO people (name_ko) VALUES (?) ON DUPLICATE KEY UPDATE id=id', [this.name]);
            if (rows.insertId !== 0)
                this.id = rows.insertId;
            else {
                [rows] = yield conn.query('SELECT * FROM people WHERE name_ko=?', [this.name]);
                this.id = rows[0].id;
            }
            let query = 'INSERT INTO author_to_person (book_id, person_id, type_id) VALUES (?, ?, ?)';
            return yield conn.query(query, [bookId, this.id, type]);
        }));
    }
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
