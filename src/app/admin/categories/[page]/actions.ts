"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Category.getAllCategories(query);
		const dbCount = await models.Category.getCategoriesCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Categories fetched successfully",
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
		const db = await models.Category.deleteCategory(Number(id));
		return {
			success: "success",
			data: db,
			message: "Category deleted successfully",
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
		const db = await models.Category.createCategory(data);
		return {
			success: "success",
			data: db,
			message: "Category created successfully",
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
		const db = await models.Category.updateCategory(Number(id), data);
		return {
			success: "success",
			data: db,
			message: "Category updated successfully",
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
		const db = await models.Category.getCategoryById(Number(id));
		return {
			success: "success",
			data: db,
			message: "Category fetched successfully",
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
		const db = await models.Category.deleteMulti(ids.map(Number));
		return {
			success: "success",
			data: db,
			message: "Categories deleted successfully",
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
		const db = await models.Category.updateMulti(ids.map(Number), data);
		return {
			success: "success",
			data: db,
			message: "Categories updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating categories",
		};
	}
}
