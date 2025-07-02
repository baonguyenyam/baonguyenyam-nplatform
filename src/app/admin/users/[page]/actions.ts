"use server";

import { render } from "@react-email/render";

import { auth } from "@/auth";
import WelcomeEmail from "@/email/WelcomeEmail";
import MailService from "@/lib/email";
import { ACTIONS, createPermissionChecker, PERMISSION_LEVELS, RESOURCES } from "@/lib/permissions";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.User.getAllUsers(query);
		const dbCount = await models.User.getUsersCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Users fetched successfully",
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
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to delete users
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as 'ADMIN' | 'MODERATOR' | 'USER',
	});

	if (!permissionChecker.hasPermission(RESOURCES.USERS, ACTIONS.DELETE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to delete users",
		};
	}

	try {
		const db = await models.User.deleteUser(id);
		return {
			success: "success",
			data: db,
			message: "User deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting user",
		};
	}
}

export async function createRecord(data: any) {
	const session = await auth();
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to create users
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as 'ADMIN' | 'MODERATOR' | 'USER',
	});

	if (!permissionChecker.hasPermission(RESOURCES.USERS, ACTIONS.CREATE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to create users",
		};
	}

	try {
		const db = await models.User.createUser(data);
		return {
			success: "success",
			data: db,
			message: "User created successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error creating user",
		};
	}
}

export async function updateRecord(id: string, data: any) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	if (role !== "ADMIN") {
		data.role = "USER";
	}
	try {
		const db = await models.User.updateUser(id, data);
		return {
			success: "success",
			data: db,
			message: "User updated successfully",
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
		const db = await models.User.getUserById(id);
		return {
			success: "success",
			data: db,
			message: "User fetched successfully",
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
		const db = await models.User.deleteMulti(ids);
		return {
			success: "success",
			data: db,
			message: "Users deleted successfully",
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
		const db = await models.User.updateMulti(ids, data);
		return {
			success: "success",
			data: db,
			message: "Users updated successfully",
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
