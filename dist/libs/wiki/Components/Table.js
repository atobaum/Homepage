"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Le Reveur on 2017-10-16.
 */
const Components_1 = require("../Components");
class TCell extends Components_1.BlockToken {
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
class TRow extends Components_1.BlockToken {
    constructor(cells, option) {
        super(cells);
        this.head = option === 'h';
    }
    render() {
        if (this.head)
            return `<thead><tr>${this.renderContent()}</tr></thead>`;
        else
            return `<tbody
><tr>${this.renderContent()}</tr></tbody>`;
    }
}
class Table extends Components_1.BlockToken {
    constructor(rows) {
        super(rows);
    }
    render() {
        return `<table class="ui celled collapsing table">${this.renderContent()}</table>`;
    }
}
exports.Table = Table;
