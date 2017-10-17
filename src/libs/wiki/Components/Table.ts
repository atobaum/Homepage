/**
 * Created by Le Reveur on 2017-10-16.
 */
import {BlockToken, InlineToken} from "../Components";
class TCell extends BlockToken {
    head: boolean;

    constructor(inToks: InlineToken[], head: boolean) {
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
class TRow extends BlockToken {
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

export class Table extends BlockToken {
    constructor(rows) {
        super(rows);
    }

    render() {
        return `<table class="ui celled collapsing table">${this.renderContent()}</table>`;
    }
}