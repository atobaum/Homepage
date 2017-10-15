/**
 * Created by Le Reveur on 2017-10-15.
 */
export class Page {
    private ns: string;
    private title: string;
    private id: number;
    private originalText: string;
    private parsedText: string;

    constructor(title?: string) {

    }

    async clearCache(): Promise<boolean> {

    }

    async save(): Promise<boolean> {

    }
}
