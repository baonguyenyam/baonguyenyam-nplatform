"use server";

import { createHash } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.File.getAllFiles(query);
		const dbCount = await models.File.getFilesCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Files fetched successfully",
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
		const db = await models.File.deleteFile(Number(id));
		return {
			success: "success",
			data: db,
			message: "File deleted successfully",
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
	data.userId = id;
	try {
		const db = await models.File.createFile(data);
		return {
			success: "success",
			data: db,
			message: "File created successfully",
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
		const db = await models.File.updateFile(Number(id), data);
		return {
			success: "success",
			data: db,
			message: "File updated successfully",
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
		const db = await models.File.getFileById(Number(id));
		return {
			success: "success",
			data: db,
			message: "File fetched successfully",
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
		const db = await models.File.deleteMulti(ids.map(Number));
		return {
			success: "success",
			data: db,
			message: "Files deleted successfully",
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
		const db = await models.File.updateMulti(ids.map(Number), data);
		return {
			success: "success",
			data: db,
			message: "Files updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating categories",
		};
	}
}
