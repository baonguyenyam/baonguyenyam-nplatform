"use server";

import { auth } from "@/auth";
import { ACTIONS, createPermissionChecker, PERMISSION_LEVELS, RESOURCES } from "@/lib/permissions";
import { sendEmail } from "@/lib/utils";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to read customers
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.READ, PERMISSION_LEVELS.READ)) {
		return {
			success: "error",
			message: "Insufficient permissions to read customers",
		};
	}

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
			message: "Error fetching customers",
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

	// Check permission to delete customers
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.DELETE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to delete customers",
		};
	}

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
			message: "Error deleting customer",
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

	// Check permission to create customers
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.CREATE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to create customers",
		};
	}

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
			message: "Error creating customer",
		};
	}
}

export async function updateRecord(id: string, data: any) {
	const session = await auth();
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to update customers
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.UPDATE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to update customers",
		};
	}

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
			message: "Error updating customer",
		};
	}
}

export async function getRecord(id: string) {
	const session = await auth();
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to read customers
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.READ, PERMISSION_LEVELS.READ)) {
		return {
			success: "error",
			message: "Insufficient permissions to read customers",
		};
	}

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
			message: "Error fetching customer",
		};
	}
}

// Delete Multiple Records
export async function deleteMultipleRecords(ids: string[]) {
	const session = await auth();
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to delete customers (bulk delete requires higher permissions)
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.BULK_DELETE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to bulk delete customers",
		};
	}

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
			message: "Error deleting customers",
		};
	}
}

// Update Multiple Records
export async function updateMultipleRecords(ids: string[], data: any) {
	const session = await auth();
	if (!session?.user) {
		return {
			success: "error",
			message: "Not authenticated",
		};
	}

	// Check permission to update customers (bulk update requires higher permissions)
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.hasPermission(RESOURCES.CUSTOMERS, ACTIONS.BULK_UPDATE, PERMISSION_LEVELS.WRITE)) {
		return {
			success: "error",
			message: "Insufficient permissions to bulk update customers",
		};
	}

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
			message: "Error updating customers",
		};
	}
}

// Send Welcome Email
export async function sendMail(email: string, name: string) {
	// sendEmail
	const Subject = `Welcome to ${process.env.PUBLIC_SITE_NAME ?? ""}'s website`;
	await sendEmail(email, name, Subject);
}
