"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * Created by Le Reveur on 2017-10-16.
 */
var Components_1 = require("../Components");
var TCell = /** @class */ (function (_super) {
    __extends(TCell, _super);
    function TCell(inToks, head) {
        var _this = _super.call(this, inToks) || this;
        _this.head = head;
        return _this;
    }
    TCell.prototype.render = function () {
        if (this.head)
            return "<th>" + this.renderContent() + "</th>";
        else
            return "<td>" + this.renderContent() + "</td>";
    };
    return TCell;
}(Components_1.BlockToken));
var TRow = /** @class */ (function (_super) {
    __extends(TRow, _super);
    function TRow(cells, option) {
        var _this = _super.call(this, cells) || this;
        _this.head = option === 'h';
        return _this;
    }
    TRow.prototype.render = function () {
        if (this.head)
            return "<thead><tr>" + this.renderContent() + "</tr></thead>";
        else
            return "<tbody\n><tr>" + this.renderContent() + "</tr></tbody>";
    };
    return TRow;
}(Components_1.BlockToken));
var Table = /** @class */ (function (_super) {
    __extends(Table, _super);
    function Table(rows) {
        return _super.call(this, rows) || this;
    }
    Table.prototype.render = function () {
        return "<table class=\"ui celled collapsing table\">" + this.renderContent() + "</table>";
    };
    return Table;
}(Components_1.BlockToken));
exports.Table = Table;
