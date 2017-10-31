/**
 * Created by Le Reveur on 2017-10-16.
 */
import {BigToken, Token} from "../Components";
export class TCell extends BigToken {
    head: boolean;

    constructor(inToks: Token[], head: boolean) {
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
export class TRow extends BigToken {
    head: boolean;

    constructor(cells: TCell[]) {
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

class Table extends BigToken {
    constructor(rows) {
        super(rows);
    }

    render() {
        return `<table class="ui celled collapsing table">${this.renderContent()}</table>`;
    }
}