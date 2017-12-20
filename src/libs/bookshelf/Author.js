"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * Created by Le Reveur on 2017-10-18.
 */
var SingletonMysql_1 = require("../SingletonMysql");
var EAuthorType;
(function (EAuthorType) {
    EAuthorType["AUTHOR"] = "\uC9C0\uC74C";
    EAuthorType["TRANSLATOR"] = "\uBC88\uC5ED";
    EAuthorType["SUPERVISOR"] = "\uAC10\uC218";
    EAuthorType["ILLUSTRATOR"] = "\uADF8\uB9BC";
    EAuthorType["PHOTO"] = "\uC0AC\uC9C4";
})(EAuthorType = exports.EAuthorType || (exports.EAuthorType = {}));
var Author = /** @class */ (function () {
    function Author(name, type) {
        if (!(name && type))
            throw new Error('constructor argument not fulfilled: Author');
        this.type = type;
        this.name = name;
    }
    Author.prototype.toString = function () {
        return this.name + ' ' + this.type;
    };
    Author.formatAuthors = function (authors) {
        return authors.map(function (author) { return author.toString(); }).join(', ');
    };
    Author.prototype.searchPerson = function (type, keyword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SingletonMysql_1["default"].query('SELECT * FROM people WHERE ? LIKE "' + keyword + '%"', [type])];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
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
    Author.createFromJSON = function (json) {
        var type;
        switch (json.type) {
            case '지음':
                type = EAuthorType.AUTHOR;
                break;
            case '번역':
                type = EAuthorType.TRANSLATOR;
                break;
        }
        return new Author(json.name, type);
    };
    return Author;
}());
exports.Author = Author;
