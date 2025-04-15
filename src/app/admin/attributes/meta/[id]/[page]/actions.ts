"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.AttributeMeta.getAllAttributeByParentID(query);
		const dbCount = await models.AttributeMeta.getAllAttributeByParentIDCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "AttributeMetas fetched successfully",
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
		const db = await models.AttributeMeta.deleteAttributeMeta(Number(id));
		return {
			success: "success",
			data: db,
			message: "AttributeMeta deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting category",
		};
	}
}

export async function createRecord(id: string, data: any) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	const _body = {
		data,
		attributeId: Number(id),
	};
	try {
		const db = await models.AttributeMeta.createAttributeMeta(_body);
		return {
			success: "success",
			data: db,
			message: "AttributeMeta created successfully",
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
	const _body = {
		data,
	};
	try {
		const db = await models.AttributeMeta.updateAttributeMeta(Number(id), _body);
		return {
			success: "success",
			data: db,
			message: "AttributeMeta updated successfully",
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
		const db = await models.AttributeMeta.getAttributeMetaById(Number(id));
		return {
			success: "success",
			data: db,
			message: "AttributeMeta fetched successfully",
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
		const db = await models.AttributeMeta.deleteMulti(ids.map(Number));
		return {
			success: "success",
			data: db,
			message: "AttributeMetas deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting categories",
		};
	}
}
