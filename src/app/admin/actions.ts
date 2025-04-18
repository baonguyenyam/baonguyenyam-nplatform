"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAllAttributes() {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Attribute.getAllAttributes({ min: true, published: true });
		return {
			data: db,
			success: "success",
			message: "Settings fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}

export async function getAllCategories() {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Category.getAllCategories({ min: true, published: true });
		return {
			data: db,
			success: "success",
			message: "Settings fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}
