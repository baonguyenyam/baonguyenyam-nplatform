import { auth } from "@/auth";

export const currentUser = async () => {
	const session = await auth();
	return session?.user;
};

export const currentRole = async () => {
	const session = await auth();
	return session?.user.role;
};

export const currentPermissions = async () => {
	const session = await auth();
	return JSON.parse(typeof session?.user.permissions === "string" ? session.user.permissions : "[]");
};
