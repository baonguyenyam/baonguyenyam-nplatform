// Re-export from client-utils to maintain backward compatibility
export * from "./client-utils";

// Additional functions that can be safely used in both client and server
export const truncateString = (str: any, num: any) => {
	if (str.length <= num) {
		return str;
	}
	// Clear & remove last word
	const newStr = str.slice(0, num + 1).trim();
	// Clear & remove last comma
	const lastSpace = newStr.lastIndexOf(" ");
	if (lastSpace === -1) {
		return `${newStr}...`;
	}
	return `${newStr.slice(0, lastSpace)}...`;
};

// f_demographic_8_20
export const getIdFromAttributeKey = (key: string) => {
	const regex = /_(\d+)$/;
	const match = key.match(regex);
	if (match) {
		return match[1];
	}
	return null;
};

// Check is String or json.string
export const checkIsStringOrJson = (str: string) => {
	if (typeof str === "string") {
		try {
			const parsed = JSON.parse(str);
			if (typeof parsed === "object") {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
	return false;
};

export const rolesCheck = (role: any, acceptRole: string[]) => {
	if (role && acceptRole.includes(role)) {
		return true;
	}
	return false;
};

export const permissionsCheck = (permissions: any, permission: string) => {
	const checkPermissions = JSON.parse(
		typeof permissions === "string"
			? permissions
			: JSON.stringify(permissions || []),
	);

	if (checkPermissions && checkPermissions.includes(permission)) {
		return true;
	}
	return false;
};

/**
 * Enhanced permission checking functions
 */
export const hasAnyRole = (
	userRole: string,
	allowedRoles: string[],
): boolean => {
	return allowedRoles.includes(userRole);
};

export const hasAllRoles = (
	userRoles: string[],
	requiredRoles: string[],
): boolean => {
	return requiredRoles.every((role) => userRoles.includes(role));
};

export const hasAnyPermission = (
	userPermissions: string[],
	requiredPermissions: string[],
): boolean => {
	return requiredPermissions.some((permission) =>
		userPermissions.includes(permission),
	);
};

export const hasAllPermissions = (
	userPermissions: string[],
	requiredPermissions: string[],
): boolean => {
	return requiredPermissions.every((permission) =>
		userPermissions.includes(permission),
	);
};

/**
 * Resource-based permission checking
 */
export const hasResourcePermission = (
	userPermissions: any,
	resource: string,
	action: string,
): boolean => {
	try {
		const permissions =
			typeof userPermissions === "string"
				? JSON.parse(userPermissions)
				: userPermissions || {};

		const resourcePermissions = permissions[resource];
		if (!resourcePermissions) return false;

		return (
			resourcePermissions.includes(action) || resourcePermissions.includes("*")
		);
	} catch {
		return false;
	}
};

/**
 * Level-based permission checking
 */
export const hasMinimumPermissionLevel = (
	userLevel: number,
	requiredLevel: number,
): boolean => {
	return userLevel >= requiredLevel;
};

/**
 * Context-aware permission checking
 */
export const canAccessResource = (
	user: any,
	resource: string,
	action: string,
	resourceOwnerId?: string,
): boolean => {
	// Admin có thể truy cập tất cả
	if (user.role === "ADMIN") {
		return true;
	}

	// Owner có thể truy cập resource của mình
	if (resourceOwnerId && user.id === resourceOwnerId) {
		return true;
	}

	// Kiểm tra permission cụ thể
	return hasResourcePermission(user.permissions, resource, action);
};

/**
 * Time-based permission checking
 */
export const isPermissionValid = (
	permission: any,
	currentTime: Date = new Date(),
): boolean => {
	if (!permission.validFrom && !permission.validTo) {
		return true;
	}

	const validFrom = permission.validFrom
		? new Date(permission.validFrom)
		: null;
	const validTo = permission.validTo ? new Date(permission.validTo) : null;

	if (validFrom && currentTime < validFrom) {
		return false;
	}

	if (validTo && currentTime > validTo) {
		return false;
	}

	return true;
};

/**
 * IP-based permission checking
 */
export const isIpAllowed = (userIp: string, allowedIps: string[]): boolean => {
	if (!allowedIps || allowedIps.length === 0) {
		return true;
	}

	return allowedIps.some((allowedIp) => {
		// Exact match
		if (allowedIp === userIp) {
			return true;
		}

		// CIDR notation support (simplified)
		if (allowedIp.includes("/")) {
			// Implement proper CIDR checking if needed
			return false;
		}

		// Wildcard support
		if (allowedIp.includes("*")) {
			const pattern = allowedIp.replace(/\*/g, ".*");
			const regex = new RegExp(`^${pattern}$`);
			return regex.test(userIp);
		}

		return false;
	});
};
