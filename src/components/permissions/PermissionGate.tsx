/**
 * Client-side Permission Components
 * Các component để kiểm tra permission ở client-side
 */

"use client";

import { useSession } from "next-auth/react";

import {
	Action,
	ACTIONS,
	createPermissionChecker,
	PERMISSION_LEVELS,
	PermissionLevel,
	Resource,
	RESOURCES,
	UserPermissionContext,
} from "@/lib/permissions";

interface PermissionGateProps {
	resource: Resource;
	action: Action;
	level?: PermissionLevel;
	fallback?: React.ReactNode;
	children: React.ReactNode;
	requireOwnership?: boolean;
	resourceOwnerId?: string;
}

/**
 * Component để kiểm tra permission và render content có điều kiện
 */
export function PermissionGate({
	resource,
	action,
	level = PERMISSION_LEVELS.READ,
	fallback = null,
	children,
	requireOwnership = false,
	resourceOwnerId,
}: PermissionGateProps) {
	const { data: session } = useSession();

	if (!session?.user) {
		return <>{fallback}</>;
	}

	const userContext: UserPermissionContext = {
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
		customPermissions: session.user.permissions
			? JSON.parse(
					typeof session.user.permissions === "string"
						? session.user.permissions
						: JSON.stringify(session.user.permissions || []),
				)
			: undefined,
	};

	const permissionChecker = createPermissionChecker(userContext);

	// Check basic permission
	const hasPermission = permissionChecker.hasPermission(
		resource,
		action,
		level,
	);

	// Check ownership if required
	if (requireOwnership && resourceOwnerId) {
		const hasOwnership = permissionChecker.hasOwnerPermission(
			resource,
			resourceOwnerId,
		);
		// User must have permission AND (be owner OR be admin)
		if (!hasPermission || (!hasOwnership && !permissionChecker.isAdmin())) {
			return <>{fallback}</>;
		}
	} else if (!hasPermission) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

/**
 * Hook để kiểm tra permission
 */
export function usePermissions() {
	const { data: session } = useSession();

	if (!session?.user) {
		return null;
	}

	const userContext: UserPermissionContext = {
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
		customPermissions: session.user.permissions
			? JSON.parse(
					typeof session.user.permissions === "string"
						? session.user.permissions
						: JSON.stringify(session.user.permissions || []),
				)
			: undefined,
	};

	return createPermissionChecker(userContext);
}

/**
 * Component shortcuts cho các permission thường dùng
 */

// Admin only components
export function AdminOnly({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	const permissionChecker = usePermissions();

	if (!permissionChecker?.isAdmin()) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

// Moderator+ only components
export function ModeratorOnly({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	const permissionChecker = usePermissions();

	if (!permissionChecker?.isModerator()) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

// Products permissions
export function CanViewProducts({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.PRODUCTS}
			action={ACTIONS.READ}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

export function CanEditProducts({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.PRODUCTS}
			action={ACTIONS.UPDATE}
			level={PERMISSION_LEVELS.WRITE}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

export function CanDeleteProducts({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.PRODUCTS}
			action={ACTIONS.DELETE}
			level={PERMISSION_LEVELS.WRITE}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

// Users permissions
export function CanViewUsers({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.USERS}
			action={ACTIONS.READ}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

export function CanEditUsers({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.USERS}
			action={ACTIONS.UPDATE}
			level={PERMISSION_LEVELS.WRITE}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

// Orders permissions
export function CanViewOrders({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.ORDERS}
			action={ACTIONS.READ}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

export function CanEditOrders({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.ORDERS}
			action={ACTIONS.UPDATE}
			level={PERMISSION_LEVELS.WRITE}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

// Settings permissions (usually admin only)
export function CanViewSettings({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.SETTINGS}
			action={ACTIONS.READ}
			level={PERMISSION_LEVELS.ADMIN}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}

export function CanEditSettings({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<PermissionGate
			resource={RESOURCES.SETTINGS}
			action={ACTIONS.UPDATE}
			level={PERMISSION_LEVELS.ADMIN}
			fallback={fallback}
		>
			{children}
		</PermissionGate>
	);
}
