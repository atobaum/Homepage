"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
class TCell extends Components_1.BigToken {
    constructor(inToks, head) {
        super(inToks);
        this.head = head;
    }
    render() {
        if (this.head)
            return `<th>${this.renderContent()}</th>`;
        else
            return `<td>${this.renderContent()}</td>`;
    }
}
exports.TCell = TCell;
class TRow extends Components_1.BigToken {
    constructor(cells) {
        super(cells);
        this.head = cells[0].head;
    }

    parse(toks) {
        let table = [this];
        while (toks[0] instanceof TRow) {
            table.push(toks.shift());
        }
        return new Table(table);
    }
    render() {
        if (this.head)
            return `<thead><tr>${this.renderContent()}</tr></thead>`;
        else
            return `<tbody
><tr>${this.renderContent()}</tr></tbody>`;
    }
}
exports.TRow = TRow;
class Table extends Components_1.BigToken {
    constructor(rows) {
        super(rows);
    }
    render() {
        return `<table class="ui celled collapsing table">${this.renderContent()}</table>`;
    }
}
