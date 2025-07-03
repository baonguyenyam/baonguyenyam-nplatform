"use server";

// Server Actions to replace some API endpoints and reduce serverless function count
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { currentRole, currentUser } from "@/lib/auth";
import models from "@/models";

// Admin authentication check
async function checkAdminPermission() {
	const role = await currentRole();
	if (role !== UserRole.ADMIN) {
		throw new Error("Unauthorized: Admin access required");
	}
}

// Posts actions
export async function getPosts(params: {
	s?: string;
	skip?: number;
	take?: number;
	orderBy?: string;
	filterBy?: string;
	byCat?: string;
	type?: string;
}) {
	await checkAdminPermission();

	try {
		const query = {
			s: params.s || "",
			skip: params.skip || 0,
			take: params.take || 10,
			orderBy: params.orderBy || "createdAt",
			filterBy: params.filterBy || "",
			byCat: params.byCat || "all",
			type: params.type || null,
		};

		const [count, posts] = await Promise.all([
			models.Post.getPostsCount(query),
			models.Post.getAllPosts(query),
		]);

		return {
			success: true,
			data: posts,
			count,
			message: "Posts fetched successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error fetching posts",
		};
	}
}

export async function createPost(formData: FormData) {
	await checkAdminPermission();

	try {
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const categoryId = formData.get("categoryId") as string;

		const post = await models.Post.createPost({
			title,
			content,
			categoryId: categoryId ? parseInt(categoryId) : undefined,
			authorId: (await currentUser())?.id || "",
		});

		revalidatePath("/admin/posts");

		return {
			success: true,
			data: post,
			message: "Post created successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error creating post",
		};
	}
}

export async function updatePost(id: string, formData: FormData) {
	await checkAdminPermission();

	try {
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const categoryId = formData.get("categoryId") as string;

		const post = await models.Post.updatePost(parseInt(id), {
			title,
			content,
			categoryId: categoryId ? parseInt(categoryId) : undefined,
		});

		revalidatePath("/admin/posts");
		revalidatePath(`/admin/posts/${id}`);

		return {
			success: true,
			data: post,
			message: "Post updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error updating post",
		};
	}
}

export async function deletePost(id: string) {
	await checkAdminPermission();

	try {
		await models.Post.deletePost(parseInt(id));

		revalidatePath("/admin/posts");

		return {
			success: true,
			message: "Post deleted successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error deleting post",
		};
	}
}

// Users actions
export async function getUsers(params: {
	s?: string;
	skip?: number;
	take?: number;
	orderBy?: string;
}) {
	await checkAdminPermission();

	try {
		const query = {
			s: params.s || "",
			skip: params.skip || 0,
			take: params.take || 10,
			orderBy: params.orderBy || "createdAt",
		};

		const [count, users] = await Promise.all([
			models.User.getUsersCount(query),
			models.User.getAllUsers(query),
		]);

		return {
			success: true,
			data: users,
			count,
			message: "Users fetched successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error fetching users",
		};
	}
}

export async function createUser(formData: FormData) {
	await checkAdminPermission();

	try {
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const role = formData.get("role") as UserRole;

		const user = await models.User.createUser({
			name,
			email,
			role,
		});

		revalidatePath("/admin/users");

		return {
			success: true,
			data: user,
			message: "User created successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error creating user",
		};
	}
}

export async function deleteUser(id: string) {
	await checkAdminPermission();

	try {
		await models.User.deleteUser(id);

		revalidatePath("/admin/users");

		return {
			success: true,
			message: "User deleted successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error deleting user",
		};
	}
}

// Categories actions
export async function getCategories() {
	await checkAdminPermission();

	try {
		const categories = await models.Category.getAllCategories({});

		return {
			success: true,
			data: categories,
			message: "Categories fetched successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error fetching categories",
		};
	}
}

export async function createCategory(formData: FormData) {
	await checkAdminPermission();

	try {
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;

		const category = await models.Category.createCategory({
			name,
			description,
		});

		revalidatePath("/admin/categories");

		return {
			success: true,
			data: category,
			message: "Category created successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error creating category",
		};
	}
}

export async function deleteCategory(id: string) {
	await checkAdminPermission();

	try {
		await models.Category.deleteCategory(parseInt(id));

		revalidatePath("/admin/categories");

		return {
			success: true,
			message: "Category deleted successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Error deleting category",
		};
	}
}
