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
const request = require("request-promise-native");
const Book_1 = require("./Book");
/** @module aladin
 * @author Hanjitori
 * @constructor{string} TTBKey- TTBKey of aladin api.
 * @version 20170322
 */
class Aladin {
    constructor(TTBKey) {
        this.TTBKey = TTBKey;
    }

    parseAuthors(strAuthors) {
        let result = [];
        let authors = strAuthors.split(', ');
        let typeRegex = /(?:\s)(\S+?)$/;
        authors.forEach(function (strAuthor) {
            let type = typeRegex.exec(strAuthor);
            if (!type)
                throw new Error('Error at 9283');
            type = type[1];
            let names = strAuthor.substr(0, strAuthor.length - type.length - 1).split('.');
            switch (type) {
                case '지음':
                    type = 'author';
                    break;
                case '옮김':
                    type = 'translator';
                    break;
                case '감수':
                    type = 'supervisor';
                    break;
                case '사진':
                    type = 'photo';
                    break;
                case '그림':
                    type = 'illustrator';
                    break;
                case '엮음':
                    type = 'editor';
                    break;
                default:
                    throw new Error('지원하지 않는 저자 타입: ' + type);
            }
            for (let i in names) {
                result.push({name: names[i], type: type});
            }
        });
        return result;
    }
    ;

    bookInfo(isbn) {
        return __awaiter(this, void 0, void 0, function*() {
            let queryOption = {
                uri: Aladin.host + "ItemLookUp.aspx",
                qs: {
                    output: 'js',
                    ttbkey: this.TTBKey,
                    itemIdType: "ISBN13",
                    ItemId: isbn,
                    Version: 20131101
                },
                json: true
            };
            try {
                let item = yield request(queryOption);
                if (item.errorCode) {
                    return new Error(item.errorMessage);
                }
                item = item[0];
                let result = {
                    title: item.title,
                    publisher: item.publisher,
                    published_date: item.pubDate,
                    isbn13: item.isbn13,
                    cover_URL: item.cover
                };
                try {
                    let authors = this.parseAuthors(item.author);
                    result.authors = authors;
                }
                catch (e) {
                    result.authorsText = item.author;
                }
                if (item.subInfo) {
                    result.subtitle = item.subInfo.subTitle;
                    result.original_title = item.subInfo.originalTitle;
                    result.pages = item.subInfo.itemPage;
                }
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    ;
    /**
     * search books from aladin and arrange.
     * @function search
     * @param {string} type - It could be one of Keyword, Title, Author, Publisher
     * @param {string} keyword - search keyword.
     * @property {object[]} books - book info.
     * @property {string} books[].title
     * @property {string} books[].author
     * @property {string} books[].publishedDate
     * @property {string} books[].isbn13
     * @property {string} books[].coverURL
     */
    search(type, keyword) {
        return __awaiter(this, void 0, void 0, function*() {
            let queryOption = {
                uri: Aladin.host + "ItemSearch.aspx",
                qs: {
                    output: 'js',
                    Version: '20131101',
                    Cover: 'Small',
                    MaxResults: 10,
                    SearchTarget: 'Book',
                    ttbkey: this.TTBKey,
                    QueryType: type,
                    Query: keyword
                },
                json: true
            };
            let data = (yield request(queryOption)).item;
            return data.map(item => {
                let authors = item.author.split(',').map(str => {
                    let [_, name, type] = /^(.*) (.*?)$/.exec(str);
                    console.log(name, type);
                    return [name, type];
                });
                return new Book_1.Book(item.title, authors, item.publisher, item.pubDate, item.isbn13, item.cover);
            });
        });
    }
    ;
}
Aladin.host = 'http://www.aladin.co.kr/ttb/api/';
exports.default = Aladin;

