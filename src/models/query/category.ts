import { db } from "@/lib/db";

// Get Category by ID
export const getCategoryById = async (id: number) => {
	try {
		const category = await db.category.findUnique({
			where: {
				id,
			},
		});

		return category;
	} catch (error) {
		return null;
	}
};

// Get Category by Slug
export const getCategoryBySlug = async (slug: string) => {
	try {
		const category = await db.category.findFirst({
			where: {
				slug,
			},
		});

		return category;
	} catch (error) {
		return null;
	}
};

// Create Category
export const createCategory = async (data: any) => {
	try {
		const category = await db.category.create({
			data,
		});
		return category;
	} catch (error) {
		return null;
	}
};

// get all categories
export const getAllCategories = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type, min, published } = query;
	try {
		const categories = !min
			? await db.category.findMany({
					take: take ? take : undefined,
					skip: skip ? skip : undefined,
					where: {
						published: published ? published : undefined,
						type: type ? type : filterBy ? filterBy : undefined,
						OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
					},
					select: {
						id: true,
						title: true,
						slug: true,
						createdAt: true,
						type: true,
						published: true,
					},
					orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
				})
			: await db.category.findMany({
					where: {
						published: published ? published : undefined,
						type: type ? type : filterBy ? filterBy : undefined,
						OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
					},
					select: {
						id: true,
						title: true,
						type: true,
						_count: {
							select: {
								posts: true,
							},
						},
					},
					orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
				});
		return categories;
	} catch (error) {
		return null;
	}
};

// get all categories count
export const getCategoriesCount = async (query: any) => {
	const { s, byCat, type, filterBy, published } = query;
	try {
		const count = await db.category.count({
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

// delete category
export const deleteCategory = async (id: number) => {
	try {
		const category = await db.category.delete({
			where: {
				id,
			},
		});
		return category;
	} catch (error) {
		return null;
	}
};

// update category
export const updateCategory = async (id: number, data: any) => {
	try {
		const category = await db.category.update({
			where: {
				id,
			},
			data,
		});
		return category;
	} catch (error) {
		return null;
	}
};

// delete multiple categories
export const deleteMulti = async (ids: number[]) => {
	try {
		const categories = await db.category.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return categories;
	} catch (error) {
		return null;
	}
};

// update multiple categories
export const updateMulti = async (ids: number[], data: any) => {
	try {
		const categories = await db.category.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data,
		});
		return categories;
	} catch (error) {
		return null;
	}
};
