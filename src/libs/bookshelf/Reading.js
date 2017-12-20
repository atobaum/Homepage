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
var SingletonMysql_1 = require("../SingletonMysql");
var Book_1 = require("./Book");
/**
 * Created by Le Reveur on 2017-10-18.
 */
var ESearchType;
(function (ESearchType) {
    ESearchType["RECENT"] = "recent";
})(ESearchType = exports.ESearchType || (exports.ESearchType = {}));
var Reading = /** @class */ (function () {
    function Reading(user, book, startDate, finishedDate, rating, comment, link, isSecret) {
        this.book = book;
        this.date = [startDate, finishedDate];
        this.rating = rating;
        this.comment = comment;
        this.link = link;
        this.isSecret = isSecret == '1';
        this.user = user;
    }
    Reading.prototype.setId = function (id) {
        if (this.id)
            throw new Error('id already setted.');
        this.id = id;
    };
    Reading.load = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, reading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SingletonMysql_1["default"].query('SELECT * FROM readings WHERE id = ?', [id])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (rows.length === 0) {
                            throw new Error('잘못된 id:' + id);
                        }
                        reading = rows[0];
                        return [2 /*return*/, Reading.makeFromDbRow(reading, userId)];
                }
            });
        });
    };
    ;
    Reading.makeFromDbRow = function (reading, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var temp, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (reading.deleted == 1)
                            throw new Error('DELETED_DATA');
                        if (reading.is_secret && reading.user_id !== userId) {
                            delete reading.comment;
                        }
                        _a = Reading.bind;
                        _b = [void 0, reading.user];
                        return [4 /*yield*/, Book_1.Book.load(reading.book_id)];
                    case 1:
                        temp = new (_a.apply(Reading, _b.concat([_c.sent(),
                            reading.date_started,
                            reading.date_finished,
                            reading.rating,
                            (reading.is_secret && reading.user_id !== userId ? null : reading.comment),
                            reading.link,
                            reading.is_secret])))();
                        temp.id = reading.id;
                        return [2 /*return*/, temp];
                }
            });
        });
    };
    Reading.prototype["delete"] = function () {
        return SingletonMysql_1["default"].query('UPDATE readings SET deleted=1 WHERE id=?', [this.id]);
    };
    Reading.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.book.save()];
                    case 1:
                        _a.sent();
                        data = {
                            date_started: this.date[0],
                            date_finished: this.date[1],
                            book_id: this.book.getIsbn13(),
                            rating: this.rating,
                            comment: this.comment,
                            link: this.link,
                            user_id: this.user.getId(),
                            user: this.user.getUsername(),
                            is_secret: this.isSecret
                        };
                        return [2 /*return*/, SingletonMysql_1["default"].query('INSERT INTO readings SET ?', [data])];
                }
            });
        });
    };
    Reading.searchReading = function (type, keyword, page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var articlePerPage, result, _a, rows, numOfReadings, pages;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        articlePerPage = 10;
                        _a = type;
                        switch (_a) {
                            case ESearchType.RECENT: return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, SingletonMysql_1["default"].query('SELECT * FROM readings WHERE deleted = 0 ORDER BY date_started DESC LIMIT ?, ?', [(page - 1) * articlePerPage, articlePerPage])];
                    case 2:
                        rows = (_b.sent())[0];
                        return [4 /*yield*/, Promise.all(rows.map(function (reading) { return Reading.makeFromDbRow(reading); }))];
                    case 3:
                        result = _b.sent();
                        _b.label = 4;
                    case 4: return [4 /*yield*/, SingletonMysql_1["default"].query('SELECT count(*) FROM readings')];
                    case 5:
                        numOfReadings = (_b.sent())[0][0]['count(*)'];
                        pages = Math.ceil(numOfReadings / articlePerPage);
                        return [2 /*return*/, [result, pages]];
                }
            });
        });
    };
    return Reading;
}());
exports["default"] = Reading;
