import { render } from "@react-email/render";

import MailService from "@/lib/email";

import WelcomeEmail from "../../emails/WelcomeEmail";

/**
 * Server-only utility functions
 * These functions use Node.js modules and should only be used in server-side code
 */

export async function sendEmail(email: string, name: string, subject?: string) {
	const emailTemplate = await render(
		WelcomeEmail({
			url: process.env.PUBLIC_SITE_URL ?? "",
			host: process.env.PUBLIC_SITE_NAME ?? "",
			name: name,
		}),
	);
	const mailService = MailService.getInstance();
	mailService.sendMail("welcomeEmail", {
		to: email,
		subject:
			subject || `Welcome to ${process.env.PUBLIC_SITE_NAME ?? ""}'s website`,
		text: emailTemplate || "",
		html: emailTemplate,
	});
}
