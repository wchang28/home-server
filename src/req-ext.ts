import {Transporter} from "nodemailer";

export class ReqExtension {
    public mailTransporter: Transporter;
    public senderEmail: string;
    public emailRecipients: string | string[];
    constructor() {

    }
}