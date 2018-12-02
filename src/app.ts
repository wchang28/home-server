// this application the following environment variables:
// 1. GMAIL_USER
// 2. GMAIL_PASSWORD
// 3. SENDER_EMAIL
// 4. EMAIL_RECIPIENTS
// 5. PORT (optional)
// 6. HOSTNAME (optional)
import * as express from "express";
import * as bodyParser from "body-parser";
import {Router as servicesRouter} from "./services";
import * as request from "./request";
import {ReqExtension} from "./req-ext"; 
import * as nodemailer from "nodemailer";

let gmailUser = process.env["GMAIL_USER"];
if (!gmailUser) {
    console.error(`[${new Date().toISOString()}]: env. var. GMAIL_USER is not set`);
    process.exit(1);
}

let gmailPassword = process.env["GMAIL_PASSWORD"];
if (!gmailPassword) {
    console.error(`[${new Date().toISOString()}]: env. var. GMAIL_PASSWORD is not set`);
    process.exit(1);
}

let senderEmail = process.env["SENDER_EMAIL"];
if (!senderEmail) {
    console.error(`[${new Date().toISOString()}]: env. var. SENDER_EMAIL is not set`);
    process.exit(1);
}

let emailRecipientsCSV = process.env["EMAIL_RECIPIENTS"];
if (!emailRecipientsCSV) {
    console.error(`[${new Date().toISOString()}]: env. var. EMAIL_RECIPIENTS is not set`);
    process.exit(1);
}
let emailRecipients = emailRecipientsCSV.split(",");
if (emailRecipients.length === 0) {
    console.error(`[${new Date().toISOString()}]: no email recipients specified`);
    process.exit(1);
}

let port = ((process.env.PORT as any) as number) || 8080;
let hostname = process.env.HOSTNAME || "127.0.0.1";

let app = express();

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.log('**********************************************************************');
	console.log(`[${new Date().toISOString()}]: incoming ${req.method} request from ${req.connection.remoteAddress}, url=${req.url}, headers: ${JSON.stringify(req.headers)}`);
	console.log('**********************************************************************');
	console.log('');
	next();
});

app.use(bodyParser.json({"limit":"999mb"}));

// no caching
/////////////////////////////////////////////////////////////////////////////////////////////////
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
});
/////////////////////////////////////////////////////////////////////////////////////////////////

// CORS initialization
/////////////////////////////////////////////////////////////////////////////////////////////////
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.options("/*", (req: express.Request, res: express.Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Length,X-Requested-With');
    res.send(200);
});
/////////////////////////////////////////////////////////////////////////////////////////////////

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    let extension = new ReqExtension();
    extension.mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPassword
        }
    });
    extension.senderEmail = senderEmail;
    extension.emailRecipients = emailRecipients;
    req.extension = extension;
    next();
})

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({time: new Date().toISOString(), msg: "Greeting :-)"});
});

app.use("/services", servicesRouter);

// start the app service
app.listen(port, hostname, () => {
    console.log(`[${new Date().toISOString()}]: API server listening on port ${hostname}:${port} :-)`);
});
