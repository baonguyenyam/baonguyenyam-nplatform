import { db } from "@/lib/db";

// Get Attribute by ID
export const getAttributeById = async (id: number) => {
	try {
		const attribute = await db.attribute.findUnique({
			where: {
				id,
			},
		});

		return attribute;
	} catch (error) {
		return null;
	}
};

// Create Attribute
export const createAttribute = async (data: any) => {
	const { title, content, type, parent, mapto } = data;
	const parentId = parent ? parseInt(parent) : null;

	try {
		const attribute = await db.attribute.create({
			data: {
				title,
				content,
				type,
				childrenId: parentId,
				mapto,
				published: data.published ? data.published : false,
			},
		});
		return attribute;
	} catch (error) {
		return null;
	}
};

// get all attributes
export const getAllAttributes = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type, parent, min, published } = query;
	try {
		const attributes = !min
			? await db.attribute.findMany({
				take: take ? take : undefined,
				skip: skip ? skip : undefined,
				where: {
					published: published ? published : undefined,
					type: type ? type : filterBy ? filterBy : undefined,
					childrenId: parent && parseInt(parent) ? parseInt(parent) : null,
					OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
				},
				select: {
					id: true,
					title: true,
					type: true,
					mapto: true,
					published: true,
					order: true,
					_count: {
						select: {
							meta: true,
							children: true,
						},
					},
				},
				orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
			})
			: await db.attribute.findMany({
				where: {
					type: type ? type : filterBy ? filterBy : undefined,
					published: published ? published : undefined,
					childrenId: parent && parseInt(parent) ? parseInt(parent) : null,
					OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
				},
				select: {
					id: true,
					title: true,
					type: true,
					mapto: true,
					published: true,
					order: true,
					children: {
						where: {
							published: published ? published : undefined,
						},
						select: {
							id: true,
							title: true,
							type: true,
							order: true,
							// meta: {
							// 	select: {
							// 		id: true,
							// 		key: true,
							// 		value: true,
							// 	},
							// },
							_count: {
								select: {
									meta: true,
								},
							}
						},
					},
					_count: {
						select: {
							meta: true,
							children: true,
						},
					},
				},
				orderBy: {
					order: "asc",
				},
			});

		return attributes;
	} catch (error) {
		return null;
	}
};

// get all attributes count
export const getAttributesCount = async (query: any) => {
	const { s, byCat, type, parent, filterBy, published } = query;
	try {
		const count = await db.attribute.count({
			where: {
				published: published ? published : undefined,
				type: type ? type : filterBy ? filterBy : undefined,
				childrenId: parent && parseInt(parent) ? parseInt(parent) : null,
				OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// delete attribute
export const deleteAttribute = async (id: number) => {
	try {
		const attribute = await db.attribute.delete({
			where: {
				id,
			},
		});
		return attribute;
	} catch (error) {
		return null;
	}
};

// update attribute
export const updateAttribute = async (id: number, data: any) => {
	const { title, content, type, parent, mapto, order } = data;
	const parentId = parent ? parseInt(parent) : null;

	try {
		const attribute = await db.attribute.update({
			where: {
				id,
			},
			data: {
				title,
				content,
				type,
				childrenId: parentId,
				mapto,
				published: data.published ? data.published : false,
				order,
			},
		});
		return attribute;
	} catch (error) {
		return null;
	}
};

// delete multiple attributes
export const deleteMulti = async (ids: number[]) => {
	try {
		const attribute = await db.attribute.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return attribute;
	} catch (error) {
		return null;
	}
};

// updateMulti
export const updateMulti = async (ids: number[], data: any) => {
	const { title, content, type, parent, mapto, order } = data;
	const parentId = parent ? parseInt(parent) : null;

	try {
		const attribute = await db.attribute.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				title,
				content,
				type,
				mapto,
				published: data.published ? data.published : false,
				order,
			},
		});
		return attribute;
	} catch (error) {
		return null;
	}
};
