"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Attribute.getAllAttributes(query);
		const dbCount = await models.Attribute.getAttributesCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Attributes fetched successfully",
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
		const db = await models.Attribute.deleteAttribute(Number(id));
		return {
			success: "success",
			data: db,
			message: "Attribute deleted successfully",
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
		const db = await models.Attribute.createAttribute(data);
		return {
			success: "success",
			data: db,
			message: "Attribute created successfully",
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
		const db = await models.Attribute.updateAttribute(Number(id), data);
		return {
			success: "success",
			data: db,
			message: "Attribute updated successfully",
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
		const db = await models.Attribute.getAttributeById(Number(id));
		return {
			success: "success",
			data: db,
			message: "Attribute fetched successfully",
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
		const db = await models.Attribute.deleteMulti(ids.map(Number));
		return {
			success: "success",
			data: db,
			message: "Attributes deleted successfully",
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
		const db = await models.Attribute.updateMulti(ids.map(Number), data);
		return {
			success: "success",
			data: db,
			message: "Attributes updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating categories",
		};
	}
}
