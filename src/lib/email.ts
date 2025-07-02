import nodemailer from "nodemailer";

import { removeTags } from "@/lib/client-utils";
import Logging from "@/lib/logging";

interface MailInterface {
	from?: string;
	to: string | string[];
	cc?: string | string[];
	bcc?: string | string[];
	subject: string;
	text?: string;
	html: string;
}

export default class MailService {
	private static instance: MailService;
	private transporter: nodemailer.Transporter | undefined;
	//PRIVATE CONSTRUCTOR
	private constructor() { }
	//INSTANCE CREATE FOR MAIL
	static getInstance() {
		if (!MailService.instance) {
			MailService.instance = new MailService();
		}
		return MailService.instance;
	}
	//CREATE CONNECTION FOR LOCAL
	async createLocalConnection() {
		const account = await nodemailer.createTestAccount();
		this.transporter = nodemailer.createTransport({
			host: account.smtp.host,
			port: account.smtp.port,
			secure: account.smtp.secure,
			auth: {
				user: account.user,
				pass: account.pass,
			},
		});
	}
	//CREATE A CONNECTION FOR LIVE
	async createConnection() {
		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT || "587",
			secure: process.env.EMAIL_SECURE === "true" || process.env.EMAIL_SECURE === "1" ? true : false,
			auth: {
				user: process.env.EMAIL_ADDRESS,
				pass: process.env.EMAIL_PASSWORD,
			},
		} as nodemailer.TransportOptions);
	}
	//SEND MAIL
	async sendMail(requestId: string | number | string[], options: MailInterface) {
		this.createConnection();
		return await this.transporter
			?.sendMail({
				from: `"${process.env.EMAIL_NAME}" ${process.env.EMAIL_ADDRESS || options.from}`,
				to: options.to,
				cc: options.cc ?? "",
				bcc: options.bcc ?? "",
				subject: options.subject,
				text: removeTags(options.text),
				html: options.html,
			})
			.then((info: nodemailer.SentMessageInfo) => {
				Logging.info(`${requestId} - Mail sent successfully!!`);
				Logging.info(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
				if (process.env.NODE_ENV === "development") {
					Logging.info(`${requestId} - Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(info)}`);
				}
				return info;
			});
	}
	//VERIFY CONNECTION
	async verifyConnection() {
		return this.transporter?.verify();
	}
	//CREATE TRANSPORTER
	getTransporter() {
		return this.transporter;
	}
}
