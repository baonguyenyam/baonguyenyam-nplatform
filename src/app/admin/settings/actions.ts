"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAllRecord() {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Setting.getAllSettings();
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

export async function updateAllRecord(data: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Setting.updateSetting(data);
		return {
			data: db,
			success: "success",
			message: "Settings updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating settings",
		};
	}
}
