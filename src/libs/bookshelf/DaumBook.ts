/**
 * Created by Le Reveur on 2017-10-20.
 */
import * as request from "request-promise-native";
import {Book} from "./Book";
import {Author, EAuthorType} from "./Author";

enum ESearchType{
    ALL = 'all',
    TITLE = 'title',
    ISBN = 'isbn',
    KEYWORD = 'keyword',
    CONTENTS = ' contents',
    OVERVIEW = 'overview',
    PUBLISHER = 'publisher'
}

export default class Aladin {
    private apikey: string;
    constructor(apikey) {
        this.apikey = apikey;
    }

    async search(query, searchType = ESearchType.ALL): Promise<Book[]> {
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
        let data: any[] = (await request(queryOption) as any).channel.item;
        return data.map(item => {
            let authors = [new Author(item.author, EAuthorType.AUTHOR)];
            if (item.etc_author)
                authors = authors.concat(item.etc_author.split(',').map(item => new Author(item, EAuthorType.AUTHOR)));
            if (item.translator)
                authors = authors.concat(item.translator.split('|').map(item => new Author(item, EAuthorType.TRANSLATOR)));

            let pubDate = [item.pub_date.substr(0, 4), item.pub_date.substr(4, 2), item.pub_date.substr(6, 2)].join('-');
            let book = new Book(item.title, authors, item.pub_nm, pubDate, item.isbn13, item.cover_l_url);
            book.description = item.description;
            return book;
        });
    };

    searchByISBN(isbn13: string) {
        return this.search(isbn13, ESearchType.ISBN)
    }
};
