import { useAppSelector } from "@/store";
import {
	selectAuth,
	selectAuthLoading,
	selectAuthUser,
	selectIsLoggedIn,
} from "@/store/authSlice";

/**
 * Hook để lấy thông tin user hiện tại từ Redux store
 * Sử dụng hook này thay vì trực tiếp access NextAuth session
 */
export const useAuth = () => {
	const authState = useAppSelector(selectAuth);
	const user = useAppSelector(selectAuthUser);
	const isLoggedIn = useAppSelector(selectIsLoggedIn);
	const isLoading = useAppSelector(selectAuthLoading);

	return {
		user,
		isLoggedIn,
		isLoading,
		authState,
		// Helper functions
		hasRole: (role: string) => user?.role === role,
		hasPermission: (permission: string) =>
			user?.permissions?.includes(permission) || false,
		isAdmin: () => user?.role === "ADMIN",
		isModerator: () => user?.role === "MODERATOR" || user?.role === "ADMIN",
	};
};

/**
 * Hook để check permissions
 */
export const usePermissions = () => {
	const { user } = useAuth();

	const checkPermission = (permission: string) => {
		if (!user) return false;
		return user.permissions?.includes(permission) || false;
	};

	const checkRole = (role: string) => {
		if (!user) return false;
		return user.role === role;
	};

	const checkRoles = (roles: string[]) => {
		if (!user) return false;
		return roles.includes(user.role);
	};

	return {
		checkPermission,
		checkRole,
		checkRoles,
		hasAdminAccess: () => checkRoles(["ADMIN", "MODERATOR"]),
		isAdmin: () => checkRole("ADMIN"),
		isModerator: () => checkRole("MODERATOR"),
		isUser: () => checkRole("USER"),
	};
};
