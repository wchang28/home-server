import * as express from 'express';
import * as core from 'express-serve-static-core';
import * as request from "../../request";
import {SendMailOptions} from "nodemailer";

let router = express.Router();
export {router as Router};

router.get("/ip-changed", (req: express.Request, res: express.Response) => {
    let {oldIP, newIP} = req.query as {oldIP: string, newIP: string};
    let extension = req.extension;
    let mailOptions: SendMailOptions = {
        from: extension.senderEmail, // sender address
        to: extension.emailRecipients, // list of receivers
        subject: `IP Address Changed ${oldIP} ===> ${newIP}`, // Subject line
        html: `<p>Your ip address has changed from ${oldIP} to ${newIP}. Please go to <a href="https://www.noip.com">no-ip.com</a> to check the DNS mapping. </p>`
    };
    extension.mailTransporter.sendMail(mailOptions, (err: any, info: any) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(info);
        }
    });
});