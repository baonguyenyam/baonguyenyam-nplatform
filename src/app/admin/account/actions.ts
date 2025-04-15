"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.User.getUserByEmail(query);
		return {
			data: db,
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

// check ID
export async function checkId(id: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.User.getUserById(id);
		if (!db) {
			return {
				success: "success",
				message: "User ID is valid",
			};
		}
		if (db.id === userId) {
			return {
				success: "success",
				message: "User ID is valid",
			};
		}
		return {
			success: "error",
			message: "User ID already exists",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error checking user ID",
		};
	}
}

export async function updateRecord(body: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		if (!id) {
			throw new Error("User ID is required to update the record.");
		}
		const db = await models.User.updateUser(id, body);
		return {
			data: db,
			success: "success",
			message: "User updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating user",
		};
	}
}
