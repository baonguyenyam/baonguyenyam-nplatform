import { db } from "@/lib/db";

// Get File by ID
export const getFileById = async (id: number) => {
	try {
		const file = await db.file.findUnique({
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
			},
		});

		return file;
	} catch (error) {
		return null;
	}
};

// Create File
export const createFile = async (data: any) => {
	try {
		const file = await db.file.create({
			data,
		});
		return file;
	} catch (error) {
		return null;
	}
};

// get all files
export const getAllFiles = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type, published } = query;
	try {
		const files = await db.file.findMany({
			take: take ? take : undefined,
			skip: skip ? skip : undefined,
			where: {
				published: published ? published : undefined,
				OR: s ? [{ name: { contains: s, mode: "insensitive" } }] : undefined,
			},
			select: {
				id: true,
				name: true,
				type: true,
				url: true,
				published: true,
				createdAt: true,
				ext: true,
				size: true,
				user: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
		});
		return files;
	} catch (error) {
		return null;
	}
};

// get all files count
export const getFilesCount = async (query: any) => {
	const { s, byCat, type, filterBy, published } = query;
	try {
		const count = await db.file.count({
			where: {
				published: published ? published : undefined,
				OR: s ? [{ name: { contains: s, mode: "insensitive" } }] : undefined,
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// delete file
export const deleteFile = async (id: number) => {
	try {
		const file = await db.file.delete({
			where: {
				id,
			},
		});
		return file;
	} catch (error) {
		return null;
	}
};

// update file
export const updateFile = async (id: number, data: any) => {
	try {
		const file = await db.file.update({
			where: {
				id,
			},
			data,
		});
		return file;
	} catch (error) {
		return null;
	}
};

// delete multiple files
export const deleteMulti = async (ids: number[]) => {
	try {
		const files = await db.file.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return files;
	} catch (error) {
		return null;
	}
};

// updateMulti
export const updateMulti = async (ids: number[], data: any) => {
	try {
		const files = await db.file.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data,
		});
		return files;
	} catch (error) {
		return null;
	}
};
