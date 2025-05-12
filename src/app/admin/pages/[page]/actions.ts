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

export async function deleteRecord(id: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Post.deletePost(Number(id));
		return {
			success: "success",
			data: db,
			message: "Post deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting category",
		};
	}
}

export async function createRecord(data: any, meta: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	data.userId = id;
	try {
		const db = await models.Post.createPost(data);
		if (db && meta) {
			const dbMeta = await models.PostMeta.createPostMeta({
				postId: db.id,
				data: meta.data,
			});
		}
		return {
			success: "success",
			data: db,
			message: "Post created successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error creating category",
		};
	}
}

export async function updateRecord(id: string, data: any, meta?: any) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Post.updatePost(Number(id), data);
		return {
			success: "success",
			data: db,
			message: "Post updated successfully",
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
		const db = await models.Post.getPostById(Number(id));
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

// Delete Multiple Records
export async function deleteMultipleRecords(ids: string[]) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Post.deleteMulti(ids.map(Number));
		return {
			success: "success",
			data: db,
			message: "Posts deleted successfully",
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
		const db = await models.Post.updateMulti(ids.map(Number), data);
		return {
			success: "success",
			data: db,
			message: "Posts updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating categories",
		};
	}
}
