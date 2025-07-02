/**
 * Middleware-safe Admin Route Protection
 * Đây là version đơn giản cho middleware, không sử dụng database
 */

import { NextRequest, NextResponse } from "next/server";

// Basic admin route patterns
const ADMIN_ROUTES = [
	"/admin",
	"/admin/dashboard",
	"/admin/users",
	"/admin/products",
	"/admin/orders",
	"/admin/categories",
	"/admin/posts",
	"/admin/files",
	"/admin/settings",
	"/admin/attributes",
	"/admin/pages",
	"/admin/account",
	"/admin/customers",
	"/admin/vendors",
	"/admin/search",
];

/**
 * Simplified admin route checker for middleware
 * Only checks if user is authenticated and has basic admin role
 */
export function checkAdminRoutePermission(
	pathname: string,
	userRole?: string,
): boolean {
	// Check if it's an admin route
	const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

	if (!isAdminRoute) {
		return true; // Not an admin route, allow access
	}

	// For admin routes, require ADMIN or MODERATOR role
	const hasPermission = userRole === "ADMIN" || userRole === "MODERATOR";

	return hasPermission;
}

/**
 * Get redirect URL for unauthorized access
 */
export function getUnauthorizedRedirectUrl(pathname: string): string {
	return `/authentication/login?callbackUrl=${encodeURIComponent(pathname)}`;
}
