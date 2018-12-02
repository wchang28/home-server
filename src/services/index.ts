import * as express from 'express';
import * as core from 'express-serve-static-core';
import {Router as ipMonitorRouter} from "./ip-monitor";

let router = express.Router();
export {router as Router};

router.use("/ip-monitor", ipMonitorRouter);