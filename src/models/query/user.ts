import { db } from "@/lib/db";

// Get User by Email
export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	} catch (error) {
		return null;
	}
};

// Get User by ID
export const getUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				id,
			},
		});

		return user;
	} catch (error) {
		return null;
	}
};

// Create User
export const createUser = async (data: any) => {
	try {
		const user = await db.user.create({
			data,
		});
		return user;
	} catch (error) {
		return null;
	}
};

// get all users
export const getAllUsers = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, published } = query;
	try {
		const users = await db.user.findMany({
			take: take ? take : undefined,
			skip: skip ? skip : undefined,
			where: {
				// emailVerified: {
				// 	not: null,
				// },
				published: published ? published : undefined,
				OR: [{ email: { contains: s, mode: "insensitive" } }, { name: { contains: s, mode: "insensitive" } }],
			},
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
				avatar: true,
				emailVerified: true,
				createdAt: true,
				isTwoFactorEnabled: true,
				role: true,
				published: true,
			},

			orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
		});
		return users;
	} catch (error) {
		return null;
	}
};

// get all users count
export const getUsersCount = async (query: any) => {
	const { s, byCat, filterBy, published } = query;
	try {
		const count = await db.user.count({
			where: {
				// emailVerified: {
				// 	not: null,
				// },
				published: published ? published : undefined,
				OR: [{ email: { contains: s, mode: "insensitive" } }, { name: { contains: s, mode: "insensitive" } }],
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// delete user
export const deleteUser = async (id: string) => {
	try {
		const user = await db.user.delete({
			where: {
				id,
			},
		});
		return user;
	} catch (error) {
		return null;
	}
};

// update user
export const updateUser = async (id: string, data: any) => {
	try {
		const user = await db.user.update({
			where: {
				id,
			},
			data,
		});
		return user;
	} catch (error) {
		return null;
	}
};

// delete multiple users
export const deleteMulti = async (ids: string[]) => {
	try {
		const users = await db.user.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return users;
	} catch (error) {
		return null;
	}
};

// update multiple users
export const updateMulti = async (ids: string[], data: any) => {
	try {
		const users = await db.user.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data,
		});
		return users;
	} catch (error) {
		return null;
	}
};

// signIn
export const signIn = async (email: string) => {
	// This function simply wraps getUserByEmail, which is fine.
	// It will return the user object with the password hash or null.
	return getUserByEmail(email);
}