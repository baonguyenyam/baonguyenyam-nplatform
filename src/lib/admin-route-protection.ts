/**
 * Enhanced Admin Route Protection
 * Middleware tự động để bảo vệ các admin routes với permission chi tiết
 */

import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import {
	ACTIONS,
	createPermissionChecker,
	PERMISSION_LEVELS,
	type PermissionLevel,
	RESOURCES,
	type UserPermissionContext,
} from "@/lib/permissions";

// Mapping các admin routes với permission requirements
const ADMIN_ROUTE_PERMISSIONS = {
	// Users management
	"/admin/users": {
		resource: RESOURCES.USERS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/users/create": {
		resource: RESOURCES.USERS,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/users/edit": {
		resource: RESOURCES.USERS,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/users/delete": {
		resource: RESOURCES.USERS,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Products management
	"/admin/products": {
		resource: RESOURCES.PRODUCTS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/products/create": {
		resource: RESOURCES.PRODUCTS,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/products/edit": {
		resource: RESOURCES.PRODUCTS,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/products/delete": {
		resource: RESOURCES.PRODUCTS,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Orders management
	"/admin/orders": {
		resource: RESOURCES.ORDERS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/orders/create": {
		resource: RESOURCES.ORDERS,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/orders/edit": {
		resource: RESOURCES.ORDERS,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/orders/delete": {
		resource: RESOURCES.ORDERS,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/orders/approve": {
		resource: RESOURCES.ORDERS,
		action: ACTIONS.APPROVE,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Categories management
	"/admin/categories": {
		resource: RESOURCES.CATEGORIES,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/categories/create": {
		resource: RESOURCES.CATEGORIES,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/categories/edit": {
		resource: RESOURCES.CATEGORIES,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/categories/delete": {
		resource: RESOURCES.CATEGORIES,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Posts management
	"/admin/posts": {
		resource: RESOURCES.POSTS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/posts/create": {
		resource: RESOURCES.POSTS,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/posts/edit": {
		resource: RESOURCES.POSTS,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/posts/delete": {
		resource: RESOURCES.POSTS,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/posts/publish": {
		resource: RESOURCES.POSTS,
		action: ACTIONS.PUBLISH,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Files management
	"/admin/files": {
		resource: RESOURCES.FILES,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/files/upload": {
		resource: RESOURCES.FILES,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/files/delete": {
		resource: RESOURCES.FILES,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Customers management
	"/admin/customers": {
		resource: RESOURCES.CUSTOMERS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/customers/create": {
		resource: RESOURCES.CUSTOMERS,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/customers/edit": {
		resource: RESOURCES.CUSTOMERS,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/customers/delete": {
		resource: RESOURCES.CUSTOMERS,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},

	// Settings (Admin only)
	"/admin/settings": {
		resource: RESOURCES.SETTINGS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.ADMIN,
	},
	"/admin/settings/edit": {
		resource: RESOURCES.SETTINGS,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.ADMIN,
	},

	// Reports and Analytics
	"/admin/reports": {
		resource: RESOURCES.REPORTS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/analytics": {
		resource: RESOURCES.ANALYTICS,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},

	// Attributes management
	"/admin/attributes": {
		resource: RESOURCES.ATTRIBUTES,
		action: ACTIONS.READ,
		level: PERMISSION_LEVELS.READ,
	},
	"/admin/attributes/create": {
		resource: RESOURCES.ATTRIBUTES,
		action: ACTIONS.CREATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/attributes/edit": {
		resource: RESOURCES.ATTRIBUTES,
		action: ACTIONS.UPDATE,
		level: PERMISSION_LEVELS.WRITE,
	},
	"/admin/attributes/delete": {
		resource: RESOURCES.ATTRIBUTES,
		action: ACTIONS.DELETE,
		level: PERMISSION_LEVELS.WRITE,
	},
} as const;

/**
 * Check if user has permission to access admin route
 */
export async function checkAdminRoutePermission(req: NextRequest): Promise<{
	allowed: boolean;
	redirectTo?: string;
	error?: string;
}> {
	try {
		const session = await auth();

		if (!session?.user) {
			return {
				allowed: false,
				redirectTo: "/authentication/login",
				error: "Not authenticated",
			};
		}

		const pathname = req.nextUrl.pathname;

		// Check if it's an admin route
		if (!pathname.startsWith("/admin")) {
			return { allowed: true };
		}

		// Allow access to admin dashboard and deny page
		if (pathname === "/admin" || pathname === "/admin/deny") {
			return { allowed: true };
		}

		// Create user context
		const userContext: UserPermissionContext = {
			userId: session.user.id as string,
			role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
			customPermissions: session.user.permissions
				? parseCustomPermissions(session.user.permissions)
				: undefined,
		};

		const permissionChecker = createPermissionChecker(userContext);

		// Check specific route permissions
		const routePermission = findRoutePermission(pathname);

		if (routePermission) {
			const hasPermission = permissionChecker.hasPermission(
				routePermission.resource,
				routePermission.action,
				routePermission.level,
			);

			if (!hasPermission) {
				return {
					allowed: false,
					redirectTo: "/admin/deny",
					error: "Insufficient permissions",
				};
			}
		} else {
			// For unspecified admin routes, require at least moderator role
			if (!permissionChecker.isModerator()) {
				return {
					allowed: false,
					redirectTo: "/admin/deny",
					error: "Admin access required",
				};
			}
		}

		return { allowed: true };
	} catch (error) {
		console.error("Admin route permission check error:", error);
		return {
			allowed: false,
			redirectTo: "/admin/deny",
			error: "Permission check failed",
		};
	}
}

/**
 * Find permission requirement for a route
 */
function findRoutePermission(pathname: string) {
	// Try exact match first
	if (
		ADMIN_ROUTE_PERMISSIONS[pathname as keyof typeof ADMIN_ROUTE_PERMISSIONS]
	) {
		return ADMIN_ROUTE_PERMISSIONS[
			pathname as keyof typeof ADMIN_ROUTE_PERMISSIONS
		];
	}

	// Try pattern matching for dynamic routes
	for (const [route, permission] of Object.entries(ADMIN_ROUTE_PERMISSIONS)) {
		if (pathname.startsWith(route) || isRouteMatch(pathname, route)) {
			return permission;
		}
	}

	return null;
}

/**
 * Check if pathname matches route pattern
 */
function isRouteMatch(pathname: string, route: string): boolean {
	// Handle dynamic segments like /admin/users/[id]/edit
	const pathSegments = pathname.split("/");
	const routeSegments = route.split("/");

	if (pathSegments.length !== routeSegments.length) {
		// Check if pathname is a sub-route of the base route
		if (pathname.startsWith(route + "/")) {
			return true;
		}
		return false;
	}

	for (let i = 0; i < routeSegments.length; i++) {
		const routeSegment = routeSegments[i];
		const pathSegment = pathSegments[i];

		// Skip dynamic segments
		if (routeSegment.startsWith("[") && routeSegment.endsWith("]")) {
			continue;
		}

		if (routeSegment !== pathSegment) {
			return false;
		}
	}

	return true;
}

/**
 * Parse custom permissions from user data
 */
function parseCustomPermissions(permissions: any): any[] {
	try {
		if (typeof permissions === "string") {
			return JSON.parse(permissions);
		}
		return Array.isArray(permissions) ? permissions : [];
	} catch {
		return [];
	}
}

/**
 * Middleware factory cho specific admin sections
 */
export function createAdminSectionMiddleware(
	resource: string,
	action: string,
	level?: PermissionLevel,
) {
	return async (req: NextRequest) => {
		const session = await auth();

		if (!session?.user) {
			return NextResponse.redirect(new URL("/authentication/login", req.url));
		}

		const userContext: UserPermissionContext = {
			userId: session.user.id as string,
			role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
			customPermissions: session.user.permissions
				? parseCustomPermissions(session.user.permissions)
				: undefined,
		};

		const permissionChecker = createPermissionChecker(userContext);

		const hasPermission = permissionChecker.hasPermission(
			resource as any,
			action as any,
			level || PERMISSION_LEVELS.READ,
		);

		if (!hasPermission) {
			return NextResponse.redirect(new URL("/admin/deny", req.url));
		}

		return NextResponse.next();
	};
}

/**
 * Helper class for checking permissions in admin pages
 */
export class PermissionChecker {
	static async check(
		resource: string,
		action: string,
		level?: PermissionLevel,
	): Promise<void> {
		const session = await auth();

		if (!session?.user) {
			throw new Error("Not authenticated");
		}

		const userContext: UserPermissionContext = {
			userId: session.user.id as string,
			role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
			customPermissions: session.user.permissions
				? parseCustomPermissions(session.user.permissions)
				: undefined,
		};

		const permissionChecker = createPermissionChecker(userContext);
		const hasPermission = permissionChecker.hasPermission(
			resource as any,
			action as any,
			level || PERMISSION_LEVELS.READ,
		);

		if (!hasPermission) {
			const { redirect } = await import("next/navigation");
			redirect("/admin/deny");
		}
	}
}

// Export specific middleware for common admin sections
export const usersAdminMiddleware = createAdminSectionMiddleware(
	RESOURCES.USERS,
	ACTIONS.READ,
);
export const productsAdminMiddleware = createAdminSectionMiddleware(
	RESOURCES.PRODUCTS,
	ACTIONS.READ,
);
export const ordersAdminMiddleware = createAdminSectionMiddleware(
	RESOURCES.ORDERS,
	ACTIONS.READ,
);
export const settingsAdminMiddleware = createAdminSectionMiddleware(
	RESOURCES.SETTINGS,
	ACTIONS.READ,
	PERMISSION_LEVELS.ADMIN,
);
