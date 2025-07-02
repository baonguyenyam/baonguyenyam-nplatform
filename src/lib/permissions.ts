/**
 * Comprehensive Permission System
 * Định nghĩa các quyền hạn chi tiết cho từng module
 */

// Định nghĩa các actions cơ bản
export const ACTIONS = {
	CREATE: "create",
	READ: "read",
	UPDATE: "update",
	DELETE: "delete",
	EXPORT: "export",
	IMPORT: "import",
	BULK_DELETE: "bulk_delete",
	BULK_UPDATE: "bulk_update",
	APPROVE: "approve",
	REJECT: "reject",
	PUBLISH: "publish",
	UNPUBLISH: "unpublish",
} as const;

// Định nghĩa các resources/modules
export const RESOURCES = {
	USERS: "users",
	PRODUCTS: "products",
	ORDERS: "orders",
	CATEGORIES: "categories",
	POSTS: "posts",
	PAGES: "pages",
	FILES: "files",
	ATTRIBUTES: "attributes",
	CUSTOMERS: "customers",
	VENDORS: "vendors",
	SETTINGS: "settings",
	REPORTS: "reports",
	ANALYTICS: "analytics",
	SEARCH: "search",
} as const;

// Định nghĩa permission levels
export const PERMISSION_LEVELS = {
	NONE: 0,
	READ: 1,
	WRITE: 2,
	ADMIN: 3,
	OWNER: 4,
} as const;

// Định nghĩa roles với permissions mặc định
export const DEFAULT_ROLE_PERMISSIONS = {
	ADMIN: {
		[RESOURCES.USERS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.PRODUCTS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.ORDERS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.CATEGORIES]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.POSTS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.PAGES]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.FILES]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.ATTRIBUTES]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.CUSTOMERS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.VENDORS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.SETTINGS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.REPORTS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.ANALYTICS]: PERMISSION_LEVELS.ADMIN,
		[RESOURCES.SEARCH]: PERMISSION_LEVELS.ADMIN,
	},
	MODERATOR: {
		[RESOURCES.USERS]: PERMISSION_LEVELS.READ,
		[RESOURCES.PRODUCTS]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.ORDERS]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.CATEGORIES]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.POSTS]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.PAGES]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.FILES]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.ATTRIBUTES]: PERMISSION_LEVELS.READ,
		[RESOURCES.CUSTOMERS]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.VENDORS]: PERMISSION_LEVELS.WRITE,
		[RESOURCES.SETTINGS]: PERMISSION_LEVELS.READ,
		[RESOURCES.REPORTS]: PERMISSION_LEVELS.READ,
		[RESOURCES.ANALYTICS]: PERMISSION_LEVELS.READ,
		[RESOURCES.SEARCH]: PERMISSION_LEVELS.WRITE,
	},
	USER: {
		[RESOURCES.USERS]: PERMISSION_LEVELS.READ,
		[RESOURCES.PRODUCTS]: PERMISSION_LEVELS.READ,
		[RESOURCES.ORDERS]: PERMISSION_LEVELS.READ,
		[RESOURCES.CATEGORIES]: PERMISSION_LEVELS.READ,
		[RESOURCES.POSTS]: PERMISSION_LEVELS.READ,
		[RESOURCES.PAGES]: PERMISSION_LEVELS.READ,
		[RESOURCES.FILES]: PERMISSION_LEVELS.READ,
		[RESOURCES.ATTRIBUTES]: PERMISSION_LEVELS.NONE,
		[RESOURCES.CUSTOMERS]: PERMISSION_LEVELS.READ,
		[RESOURCES.VENDORS]: PERMISSION_LEVELS.READ,
		[RESOURCES.SETTINGS]: PERMISSION_LEVELS.NONE,
		[RESOURCES.REPORTS]: PERMISSION_LEVELS.NONE,
		[RESOURCES.ANALYTICS]: PERMISSION_LEVELS.NONE,
		[RESOURCES.SEARCH]: PERMISSION_LEVELS.READ,
	},
} as const;

// Utility types
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type PermissionLevel =
	(typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS];
export type UserRole = "ADMIN" | "MODERATOR" | "USER";

// Permission interface
export interface Permission {
	resource: Resource;
	action: Action;
	level: PermissionLevel;
	conditions?: Record<string, any>; // For attribute-based permissions
}

// User permission context
export interface UserPermissionContext {
	userId: string;
	role: UserRole;
	customPermissions?: Permission[];
	departmentId?: string;
	teamId?: string;
}

/**
 * Kiểm tra quyền hạn người dùng
 */
export class PermissionChecker {
	private userContext: UserPermissionContext;

	constructor(userContext: UserPermissionContext) {
		this.userContext = userContext;
	}

	/**
	 * Kiểm tra quyền hạn cơ bản
	 */
	hasPermission(
		resource: Resource,
		action: Action,
		targetLevel: PermissionLevel = PERMISSION_LEVELS.READ,
	): boolean {
		// Kiểm tra role permissions mặc định
		const rolePermissions = DEFAULT_ROLE_PERMISSIONS[this.userContext.role];
		const userLevel = rolePermissions[resource] || PERMISSION_LEVELS.NONE;

		// Kiểm tra custom permissions
		if (this.userContext.customPermissions) {
			const customPermission = this.userContext.customPermissions.find(
				(p) => p.resource === resource && p.action === action,
			);
			if (customPermission) {
				return customPermission.level >= targetLevel;
			}
		}

		return userLevel >= targetLevel;
	}

	/**
	 * Kiểm tra quyền owner (chỉ được truy cập resource của chính mình)
	 */
	hasOwnerPermission(resource: Resource, resourceUserId: string): boolean {
		return this.userContext.userId === resourceUserId;
	}

	/**
	 * Kiểm tra quyền đặc biệt (attribute-based)
	 */
	hasConditionalPermission(
		resource: Resource,
		action: Action,
		conditions: Record<string, any>,
	): boolean {
		if (!this.userContext.customPermissions) return false;

		const permission = this.userContext.customPermissions.find(
			(p) => p.resource === resource && p.action === action,
		);

		if (!permission || !permission.conditions) return false;

		// Kiểm tra các điều kiện
		return Object.entries(permission.conditions).every(([key, value]) => {
			return conditions[key] === value;
		});
	}

	/**
	 * Lấy tất cả quyền hạn của user
	 */
	getAllPermissions(): Record<string, PermissionLevel> {
		const rolePermissions = DEFAULT_ROLE_PERMISSIONS[this.userContext.role];
		const result: Record<string, PermissionLevel> = { ...rolePermissions };

		// Merge custom permissions
		if (this.userContext.customPermissions) {
			this.userContext.customPermissions.forEach((permission) => {
				if (
					permission.level >
					(result[permission.resource] || PERMISSION_LEVELS.NONE)
				) {
					result[permission.resource] = permission.level;
				}
			});
		}

		return result;
	}

	/**
	 * Kiểm tra có phải admin không
	 */
	isAdmin(): boolean {
		return this.userContext.role === "ADMIN";
	}

	/**
	 * Kiểm tra có phải moderator trở lên không
	 */
	isModerator(): boolean {
		return ["ADMIN", "MODERATOR"].includes(this.userContext.role);
	}
}

/**
 * Helper functions để sử dụng trong components và API
 */
export const createPermissionChecker = (
	userContext: UserPermissionContext,
): PermissionChecker => {
	return new PermissionChecker(userContext);
};

export const checkPermission = (
	userContext: UserPermissionContext,
	resource: Resource,
	action: Action,
	level: PermissionLevel = PERMISSION_LEVELS.READ,
): boolean => {
	const checker = createPermissionChecker(userContext);
	return checker.hasPermission(resource, action, level);
};

/**
 * Decorator cho API routes
 */
export const requirePermission = (
	resource: Resource,
	action: Action,
	level: PermissionLevel = PERMISSION_LEVELS.READ,
) => {
	return (
		target: any,
		propertyName: string,
		descriptor: PropertyDescriptor,
	) => {
		const method = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			// Giả sử args[0] là request object với user context
			const req = args[0];
			const userContext = req.userContext; // Cần implement trong middleware

			if (!userContext) {
				throw new Error("Unauthorized");
			}

			const hasPermission = checkPermission(
				userContext,
				resource,
				action,
				level,
			);
			if (!hasPermission) {
				throw new Error("Insufficient permissions");
			}

			return method.apply(this, args);
		};
	};
};
