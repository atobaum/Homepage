import User from "../common/User";
/**
 * Created by Le Reveur on 2018-01-01.
 */
export default class Note {
    private id: number;
    private title: string;
    private contents: string;
    private source: string;
    private user: User;
    private tag: Tag[];
    private created: string;
    private deleted: boolean;

    constructor() {

    }
}
