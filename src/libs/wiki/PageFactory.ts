/**
 * Created by Le Reveur on 2017-10-28.
 */
export {IPage} from './Page'

export default class PageFactory {
    /**
     *
     * @param fulltitle
     * @returns {[string,string]} [ns, title]
     */
    static parseTitle(fulltitle: string): [string, string] {
        let regexTitle = /^(?:(.*?):)?(.+?)$/;
        let parsedTitle = regexTitle.exec(fulltitle);
        let ns;
        switch (parsedTitle[1]) {
            case undefined:
            case '':
                ns = 'Main';
                break;
            case '개인':
                ns = 'Private';
                break;
            case '분류':
                ns = 'Category';
                break;
            case '위키':
                ns = 'Wiki';
                break;
            default:
                ns = parsedTitle[1];
        }
        return [ns, parsedTitle[2]];
    }
}