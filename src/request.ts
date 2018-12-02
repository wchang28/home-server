import {ReqExtension} from "./req-ext";

// extending Express.Request and Express.Response
declare global {
    namespace Express {
        interface Request {
            extension: ReqExtension;
        }
        /*
        interface Response {
            retError(err: any): void;
            errorObj: any;
        }
        */
    }
}

export {}