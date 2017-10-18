import {Section} from "./Basic";
import {Macro} from "../Components";
/**
 * Created by Le Reveur on 2017-10-17.
 */
export class TOC extends Macro {
    parent: TOC;
    children: TOC[];
    index: number;
    section: Section;

    constructor(section: Section, parent: TOC = null) {
        super();
        this.parent = parent;
        if (parent !== null) {
            this.section = section;
            section.toc = this;
        }
        this.children = [];
    }

    get indexList() {
        if (this.parent === null) return [];
        else return [...this.parent.indexList, this.index];
    }

    get root() {
        if (this.isRoot)
            return this;
        else
            return this.parent.root;
    }

    get isRoot(): boolean {
        return this.parent === null;
    }

    addChild(section: Section): TOC {
        let childToc = new TOC(section, this);
        childToc.index = this.children.length;
        this.children.push(childToc);
        return childToc;
    }

    addSection(level: number, section: Section): TOC {
        console.log(this.indexList, level, section.plainText());
        if (this.indexList.length < level)
            return this.addChild(section);
        else
            return this.parent.addSection(level, section);
    }

    render() {

    }

    plainText() {
        return '[TOC]';
    }
}