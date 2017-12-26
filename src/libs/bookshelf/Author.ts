/**
 * Created by Le Reveur on 2017-10-18.
 */
import SingletonMysql from "../common/SingletonMysql";

export enum EAuthorType{
    AUTHOR = "지음", TRANSLATOR = "번역", SUPERVISOR = "감수", ILLUSTRATOR = "그림", PHOTO = "사진", EDITOR = "감수"
}

export class Author {
    private id: number;
    type: EAuthorType;
    name: string;

    constructor(name, type) {
        if (!(name && type))
            throw new Error('constructor argument not fulfilled: Author');
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
        return SingletonMysql.transaction(async conn => {
            let [rows] = await conn.query('INSERT INTO people (name_ko) VALUES (?) ON DUPLICATE KEY UPDATE id=id', [this.name]);
            if (rows.insertId !== 0)
                this.id = rows.insertId;
            else {
                [rows] = await conn.query('SELECT * FROM people WHERE name_ko=?', [this.name]);
                this.id = rows[0].id;
            }
            let query = 'INSERT INTO author_to_person (book_id, person_id, type_id) VALUES (?, ?, ?)';
            return await conn.query(query, [bookId, this.id, type]);
        });
    }

    static createFromJSON(json: Author) {
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