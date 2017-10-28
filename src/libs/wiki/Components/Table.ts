/**
 * Created by Le Reveur on 2017-10-16.
 */
import {BigToken, Token} from "../Components";
class TCell extends BigToken {
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
class TRow extends BigToken {
    head: boolean;

    constructor(cells: TCell[], option) {
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

export class Table extends BigToken {
    constructor(rows) {
        super(rows);
    }

    render() {
        return `<table class="ui celled collapsing table">${this.renderContent()}</table>`;
    }
}