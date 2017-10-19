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
 * Created by Le Reveur on 2017-10-20.
 */
const request = require("request-promise-native");
const Book_1 = require("./Book");
const Author_1 = require("./Author");
var ESearchType;
(function (ESearchType) {
    ESearchType["ALL"] = "all";
    ESearchType["TITLE"] = "title";
    ESearchType["ISBN"] = "isbn";
    ESearchType["KEYWORD"] = "keyword";
    ESearchType["CONTENTS"] = " contents";
    ESearchType["OVERVIEW"] = "overview";
    ESearchType["PUBLISHER"] = "publisher";
})(ESearchType || (ESearchType = {}));
class Aladin {
    constructor(apikey) {
        this.apikey = apikey;
    }

    search(query, searchType = ESearchType.ALL) {
        return __awaiter(this, void 0, void 0, function*() {
            let queryOption = {
                uri: 'https://apis.daum.net/search/book',
                qs: {
                    output: 'json',
                    apikey: this.apikey,
                    q: query,
                    searchType: searchType,
                    sort: 'accu'
                },
                json: true
            };
            let data = (yield request(queryOption)).channel.item;
            return data.map(item => {
                let authors = [new Author_1.Author(item.author, Author_1.EAuthorType.AUTHOR)];
                if (item.etc_author)
                    authors = authors.concat(item.etc_author.split(',').map(item => new Author_1.Author(item, Author_1.EAuthorType.AUTHOR)));
                if (item.translator)
                    authors = authors.concat(item.translator.split('|').map(item => new Author_1.Author(item, Author_1.EAuthorType.TRANSLATOR)));
                let pubDate = [item.pub_date.substr(0, 4), item.pub_date.substr(4, 2), item.pub_date.substr(6, 2)].join('-');
                let book = new Book_1.Book(item.title, authors, item.pub_nm, pubDate, item.isbn13, item.cover_l_url);
                book.description = item.description;
                return book;
            });
        });
    }
    ;

    searchByISBN(isbn13) {
        return this.search(isbn13, ESearchType.ISBN);
    }
}
exports.default = Aladin;

