"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Post.getAllPosts(query);
		const dbCount = await models.Post.getPostsCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Posts fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}
