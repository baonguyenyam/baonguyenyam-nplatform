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

// Sign In
export async function signIn(body: any) {
	const { email, password } = body;
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		if (!email || !password) {
			throw new Error("Email and password are required to sign in.");
		}
		const db = await models.User.signIn(email);
		if (!db) {
			return {
				success: "error",
				message: "Invalid email or password",
			};
		}
		return {
			data: db,
			success: "success",
			message: "User signed in successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error signing in user",
		};
	}
}
