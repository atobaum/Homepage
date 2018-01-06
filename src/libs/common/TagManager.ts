/**
 * Created by Le Reveur on 2017-12-27.
 */
import * as Tag from "./Tag";

export default class TagManager {
    private constructor() {
    }

    static async search(name: string): Promise<Tag.ITag> {
        throw new Error('not yet')
    }
}
