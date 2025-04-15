import { db } from "@/lib/db";

// Get AttributeMeta by ID
export const getAttributeMetaById = async (id: number) => {
	try {
		const attributeMeta = await db.attributeMeta.findUnique({
			where: {
				id,
			},
		});

		return attributeMeta;
	} catch (error) {
		return null;
	}
};

// getAttributeByIdAndValue
export const getAttributeByAttributeIdIdAndValue = async (attributeId: number, value: string) => {
	try {
		const attributeMeta = await db.attributeMeta.findFirst({
			where: {
				attributeId,
				value,
			},
		});

		return attributeMeta;
	} catch (error) {
		return null;
	}
};

// getAllAttributeByParentID
export const getAllAttributeByParentID = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type, min, parent } = query;
	try {
		const categories = await db.attributeMeta.findMany({
			take: take ? take : undefined,
			skip: skip ? skip : undefined,
			where: {
				attributeId: Number(parent),
				OR: [{ key: { contains: s, mode: "insensitive" } }, { value: { contains: s, mode: "insensitive" } }],
			},
			select: {
				id: true,
				key: true,
				value: true,
			},
			orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
		});

		return categories;
	} catch (error) {
		return null;
	}
};
// getAllAttributeByParentIDCount
export const getAllAttributeByParentIDCount = async (query: any) => {
	const { s, byCat, type, filterBy } = query;
	try {
		const count = await db.attributeMeta.count({
			where: {
				attributeId: Number(query.parent),
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// Get AttributeMeta by AttributeID
export const getAttributeMetaByAttributeID = async (attributeId: number) => {
	try {
		const attributeMeta = await db.attributeMeta.findMany({
			where: {
				attributeId,
			},
		});

		return attributeMeta;
	} catch (error) {
		return null;
	}
};

// Get AttributeMeta by Slug
export const getAttributeMetaByKey = async (key: string) => {
	try {
		const attributeMeta = await db.attributeMeta.findFirst({
			where: {
				key,
			},
		});

		return attributeMeta;
	} catch (error) {
		return null;
	}
};

// Get all AttributeMeta by Key Or Value
export const getAllAttributeMetaByKeyOrValue = async (s: string, attributeId: number) => {
	try {
		const attributeMeta = await db.attributeMeta.findMany({
			where: {
				attributeId,
				OR: [{ key: { contains: s, mode: "insensitive" } }, { value: { contains: s, mode: "insensitive" } }],
			},
			select: {
				id: true,
				key: true,
				value: true,
			},
		});
		return attributeMeta;
	} catch (error) {
		return null;
	}
};

// Create AttributeMeta
export const createAttributeMeta = async (values: any) => {
	const { attributeId, data } = values;
	const res: any = [];
	try {
		for (let i = 0; i < data.length; i++) {
			// check if the key already exists
			const attributeMeta = await db.attributeMeta.findFirst({
				where: {
					attributeId,
					key: data[i].key,
				},
			});
			if (attributeMeta) {
				// update the attributeMeta
				const updatedAttributeMeta = await db.attributeMeta.update({
					where: {
						id: attributeMeta.id,
					},
					data: {
						value: data[i].value,
					},
				});
				res.push(updatedAttributeMeta);
			}
			if (!attributeMeta) {
				// create the attributeMeta
				const createdAttributeMeta = await db.attributeMeta.create({
					data: {
						attributeId,
						key: data[i].key,
						value: data[i].value,
					},
				});
				res.push(createdAttributeMeta);
			}
		}
		return res;
	} catch (error) {
		return null;
	}
};

// delete attributeMeta
export const deleteAttributeMeta = async (id: number) => {
	try {
		const attributeMeta = await db.attributeMeta.delete({
			where: {
				id,
			},
		});
		return attributeMeta;
	} catch (error) {
		return null;
	}
};

// update attributeMeta
export const updateAttributeMeta = async (id: number, data: any) => {
	const getdb = data.data;
	const res: any = [];
	console.log("getdb", getdb);
	try {
		for (let i = 0; i < getdb.length; i++) {
			const attributeMeta = await db.attributeMeta.update({
				where: {
					id,
				},
				data: {
					key: getdb[i].key,
					value: getdb[i].value,
				},
			});
			res.push(attributeMeta);
		}
		return res;
	} catch (error) {
		return null;
	}
};

// delete multiple attributeMeta
export const deleteMulti = async (ids: number[]) => {
	try {
		const attributeMeta = await db.attributeMeta.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return attributeMeta;
	} catch (error) {
		return null;
	}
};
