import User from "../libs/common/User";
/**
 * Created by Le Reveur on 2017-10-28.
 */
declare namespace Express {
    export interface Request {
        user?: User,
        userId: number
    }
}
