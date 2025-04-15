"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function searchAttribute(attributeId: string, s: string) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.AttributeMeta.getAllAttributeByParentID({
			parent: Number(attributeId),
			s,
		});
		return {
			data: db,
			success: "success",
			message: "Orders fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}

export async function getAttribute(attributeId: number, value: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.AttributeMeta.getAttributeByAttributeIdIdAndValue(attributeId, value);
		return {
			data: db,
			success: "success",
			message: "Orders fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}
