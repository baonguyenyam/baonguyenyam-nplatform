"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getRecord(slug: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Post.getPostBySlug(slug);
		return {
			success: "success",
			data: db,
			message: "Post fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching category",
		};
	}
}
