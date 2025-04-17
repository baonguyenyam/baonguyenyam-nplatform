"use server";

import { render } from "@react-email/render";

import { auth } from "@/auth";
import WelcomeEmail from "@/email/WelcomeEmail";
import MailService from "@/lib/email";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Customer.getAllCustomers(query);
		const dbCount = await models.Customer.getCustomersCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Customers fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}

export async function deleteRecord(id: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Customer.deleteCustomer(id);
		return {
			success: "success",
			data: db,
			message: "Customer deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting category",
		};
	}
}

export async function createRecord(data: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Customer.createCustomer(data);
		return {
			success: "success",
			data: db,
			message: "Customer created successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error creating category",
		};
	}
}

export async function updateRecord(id: string, data: any) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Customer.updateCustomer(id, data);
		return {
			success: "success",
			data: db,
			message: "Customer updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating category",
		};
	}
}

export async function getRecord(id: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Customer.getCustomerById(id);
		return {
			success: "success",
			data: db,
			message: "Customer fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching category",
		};
	}
}

// Delete Multiple Records
export async function deleteMultipleRecords(ids: string[]) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Customer.deleteMulti(ids);
		return {
			success: "success",
			data: db,
			message: "Customers deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting categories",
		};
	}
}

// Update Multiple Records
export async function updateMultipleRecords(ids: string[], data: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Customer.updateMulti(ids, data);
		return {
			success: "success",
			data: db,
			message: "Customers updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating categories",
		};
	}
}

// Send Welcome Email
export async function sendMail(email: string, name: string) {
	// sendEmail
	const Subject = `Welcome to ${process.env.PUBLIC_SITE_NAME ?? ""}'s website`;
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
		subject: Subject,
		text: emailTemplate || "",
		html: emailTemplate,
	});
}
