import { useSession } from "next-auth/react";

export const useCurrentPermissions = () => {
	const session = useSession();

	return JSON.parse(typeof session.data?.user.permissions === "string" ? session.data.user.permissions : "[]");
};
