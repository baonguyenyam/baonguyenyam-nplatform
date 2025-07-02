import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

import {
	ACTIONS,
	createPermissionChecker,
	PERMISSION_LEVELS,
	PermissionLevel,
	RESOURCES,
	UserPermissionContext,
} from "./permissions";

/**
 * Enhanced Authorization Middleware
 * Middleware nâng cao để kiểm tra phân quyền chi tiết
 */

interface AuthorizationOptions {
	resource?: string;
	action?: string;
	level?: PermissionLevel;
	requireOwnership?: boolean;
	customCheck?: (
		userContext: UserPermissionContext,
		req: NextRequest,
	) => boolean;
}

/**
 * Middleware chính để kiểm tra authorization
 */
export async function withAuthorization(
	req: NextRequest,
	options: AuthorizationOptions = {},
): Promise<{ authorized: boolean; user?: any; error?: string }> {
	try {
		// Lấy session từ auth
		const session = await auth();

		if (!session?.user) {
			return { authorized: false, error: "Not authenticated" };
		}

		const { user } = session;

		// Tạo user context
		const userContext: UserPermissionContext = {
			userId: user.id as string,
			role: user.role as "ADMIN" | "MODERATOR" | "USER",
			customPermissions: user.permissions
				? parseCustomPermissions(user.permissions)
				: undefined,
		};

		// Nếu không có options, chỉ cần authenticated
		if (!options.resource && !options.action && !options.customCheck) {
			return { authorized: true, user: userContext };
		}

		const permissionChecker = createPermissionChecker(userContext);

		// Kiểm tra custom check trước
		if (options.customCheck) {
			const customResult = options.customCheck(userContext, req);
			if (!customResult) {
				return { authorized: false, error: "Custom authorization failed" };
			}
		}

		// Kiểm tra resource permission
		if (options.resource && options.action) {
			const hasPermission = permissionChecker.hasPermission(
				options.resource as any,
				options.action as any,
				options.level || PERMISSION_LEVELS.READ,
			);

			if (!hasPermission) {
				return { authorized: false, error: "Insufficient permissions" };
			}
		}

		// Kiểm tra ownership nếu cần
		if (options.requireOwnership) {
			const resourceId = extractResourceId(req);
			if (resourceId) {
				// Cần implement logic để lấy owner của resource
				const resourceOwner = await getResourceOwner(
					options.resource!,
					resourceId,
				);
				if (
					resourceOwner &&
					!permissionChecker.hasOwnerPermission(
						options.resource as any,
						resourceOwner,
					)
				) {
					// Nếu không phải owner, kiểm tra có quyền admin không
					if (!permissionChecker.isAdmin()) {
						return { authorized: false, error: "Resource access denied" };
					}
				}
			}
		}

		return { authorized: true, user: userContext };
	} catch (error) {
		console.error("Authorization middleware error:", error);
		return { authorized: false, error: "Authorization error" };
	}
}

/**
 * HOC cho API routes với authorization
 */
export function withApiAuthorization(options: AuthorizationOptions = {}) {
	return function (
		handler: (req: NextRequest, context: any) => Promise<NextResponse>,
	) {
		return async function (
			req: NextRequest,
			context: any,
		): Promise<NextResponse> {
			const authResult = await withAuthorization(req, options);

			if (!authResult.authorized) {
				return NextResponse.json(
					{
						success: false,
						message: authResult.error || "Unauthorized",
						code: "AUTHORIZATION_FAILED",
					},
					{ status: authResult.error === "Not authenticated" ? 401 : 403 },
				);
			}

			// Thêm user context vào request
			(req as any).userContext = authResult.user;

			return handler(req, context);
		};
	};
}

/**
 * Middleware cho specific resources
 */
export const withUsersPermission = (action: string, level?: PermissionLevel) =>
	withApiAuthorization({
		resource: RESOURCES.USERS,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withProductsPermission = (
	action: string,
	level?: PermissionLevel,
) =>
	withApiAuthorization({
		resource: RESOURCES.PRODUCTS,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withOrdersPermission = (action: string, level?: PermissionLevel) =>
	withApiAuthorization({
		resource: RESOURCES.ORDERS,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withCategoriesPermission = (
	action: string,
	level?: PermissionLevel,
) =>
	withApiAuthorization({
		resource: RESOURCES.CATEGORIES,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withPostsPermission = (action: string, level?: PermissionLevel) =>
	withApiAuthorization({
		resource: RESOURCES.POSTS,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withFilesPermission = (action: string, level?: PermissionLevel) =>
	withApiAuthorization({
		resource: RESOURCES.FILES,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withAttributesPermission = (
	action: string,
	level?: PermissionLevel,
) =>
	withApiAuthorization({
		resource: RESOURCES.ATTRIBUTES,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withCustomersPermission = (
	action: string,
	level?: PermissionLevel,
) =>
	withApiAuthorization({
		resource: RESOURCES.CUSTOMERS,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withVendorsPermission = (
	action: string,
	level?: PermissionLevel,
) =>
	withApiAuthorization({
		resource: RESOURCES.VENDORS,
		action,
		level: level || PERMISSION_LEVELS.READ,
	});

export const withSettingsPermission = (
	action: string,
	level?: PermissionLevel,
) =>
	withApiAuthorization({
		resource: RESOURCES.SETTINGS,
		action,
		level: level || PERMISSION_LEVELS.WRITE,
	});

/**
 * Admin only middleware
 */
export const requireAdmin = () =>
	withApiAuthorization({
		customCheck: (userContext) => userContext.role === "ADMIN",
	});

/**
 * Moderator or Admin middleware
 */
export const requireModerator = () =>
	withApiAuthorization({
		customCheck: (userContext) =>
			["ADMIN", "MODERATOR"].includes(userContext.role),
	});

/**
 * Owner or Admin middleware
 */
export const requireOwnerOrAdmin = (resourceType: string) =>
	withApiAuthorization({
		resource: resourceType,
		requireOwnership: true,
	});

/**
 * Helper functions
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

function extractResourceId(req: NextRequest): string | null {
	const pathname = req.nextUrl.pathname;
	const segments = pathname.split("/");

	// Tìm ID trong URL pattern /api/v1/admin/{resource}/{id}
	const idIndex = segments.findIndex((segment) => segment === "admin") + 2;
	return segments[idIndex] || null;
}

async function getResourceOwner(
	resource: string,
	resourceId: string,
): Promise<string | null> {
	// Implement logic để lấy owner của resource từ database
	// Ví dụ:
	try {
		const { db } = await import("@/lib/db");

		switch (resource) {
			case RESOURCES.POSTS:
				const post = await db.post.findUnique({
					where: { id: parseInt(resourceId) },
					select: { userId: true },
				});
				return post?.userId || null;

			case RESOURCES.FILES:
				const file = await db.file.findUnique({
					where: { id: parseInt(resourceId) },
					select: { userId: true },
				});
				return file?.userId || null;

			case RESOURCES.ORDERS:
				const order = await db.order.findUnique({
					where: { id: resourceId },
					select: { user: { select: { id: true } } },
				});
				return order?.user?.[0]?.id || null;

			default:
				return null;
		}
	} catch (error) {
		console.error("Error getting resource owner:", error);
		return null;
	}
}

/**
 * Utility cho client-side permission checking
 */
export function createClientPermissionChecker(user: any) {
	if (!user) return null;

	const userContext: UserPermissionContext = {
		userId: user.id,
		role: user.role,
		customPermissions: user.permissions
			? parseCustomPermissions(user.permissions)
			: undefined,
	};

	return createPermissionChecker(userContext);
}
