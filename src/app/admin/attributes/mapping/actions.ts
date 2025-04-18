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
