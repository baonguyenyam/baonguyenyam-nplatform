import { db } from "@/lib/db";

// Get Post by ID
export const getPostById = async (id: number) => {
	try {
		const post = await db.post.findUnique({
			where: {
				id,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				categories: {
					select: {
						id: true,
						title: true,
					},
				},
				files: {
					select: {
						id: true,
						name: true,
						url: true,
					},
				},
				meta: {
					select: {
						key: true,
						value: true,
					},
				},
			},
		});

		return post;
	} catch (error) {
		return null;
	}
};

// Get Post by Slug
export const getPostBySlug = async (slug: string) => {
	try {
		const post = await db.post.findFirst({
			where: {
				slug,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				categories: {
					select: {
						id: true,
						title: true,
					},
				},
				files: {
					select: {
						id: true,
						name: true,
						url: true,
					},
				},
			},
		});

		return post;
	} catch (error) {
		return null;
	}
};

// Create Post
export const createPost = async (data: any) => {
	try {
		const post = await db.post.create({
			data,
		});
		return post;
	} catch (error) {
		return null;
	}
};

// get all posts
export const getAllPosts = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type, published } = query;
	try {
		const posts = await db.post.findMany({
			take: take ? take : undefined,
			skip: skip ? skip : undefined,
			where: {
				published: published ? published : undefined,
				type: type ? type : filterBy ? filterBy : undefined,
				OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
			},
			select: {
				id: true,
				createdAt: true,
				slug: true,
				title: true,
				image: true,
				published: true,
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				categories: {
					select: {
						id: true,
						title: true,
					},
				},
				meta: {
					select: {
						key: true,
						value: true,
					},
				},
			},

			orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
		});
		return posts;
	} catch (error) {
		return null;
	}
};

// get all posts count
export const getPostsCount = async (query: any) => {
	const { s, byCat, filterBy, type, published } = query;
	try {
		const count = await db.post.count({
			where: {
				published: published ? published : undefined,
				type: type ? type : filterBy ? filterBy : undefined,
				OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// delete post
export const deletePost = async (id: number) => {
	try {
		const post = await db.post.delete({
			where: {
				id,
			},
		});
		return post;
	} catch (error) {
		return null;
	}
};

// update post
export const updatePost = async (id: number, data: any) => {
	try {
		const post = await db.post.update({
			where: {
				id,
			},
			data,
		});
		return post;
	} catch (error) {
		return null;
	}
};

// delete multiple
export const deleteMulti = async (ids: number[]) => {
	try {
		const posts = await db.post.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return posts;
	} catch (error) {
		return null;
	}
};

// Update multiple
export const updateMulti = async (ids: number[], data: any) => {
	try {
		const posts = await db.post.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data,
		});
		return posts;
	} catch (error) {
		return null;
	}
};
