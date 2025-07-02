import { render } from "@react-email/render";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import WelcomeEmail from "@/email/WelcomeEmail";
import MailService from "@/lib/email";

export async function sendEmail(email: string, name: string, subject?: string) {
	const emailTemplate = await render(
		WelcomeEmail({
			url: process.env.PUBLIC_SITE_URL ?? "",
			host: process.env.PUBLIC_SITE_NAME ?? "",
			name: name,
		}),
	);
	const mailService = MailService.getInstance();
	mailService.sendMail("welcomeEmail", {
		to: email,
		subject: subject || `Welcome to ${process.env.PUBLIC_SITE_NAME ?? ""}'s website`,
		text: emailTemplate || "",
		html: emailTemplate,
	});
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const pageSkip = (page: number, pagesize: number) => {
	return (page - 1) * pagesize;
};

// secureSearchString
export const secureSearchString = (str: any) => {
	if (!str) {
		return "";
	}
	// Remove special characters
	str = str?.replace(/[^a-zA-Z0-9]/g, "");
	return str;
};

// Remove special characters and spaces
export const removeSpecialCharacters = (str: any) => {
	return str.replace(/[^a-zA-Z0-9]/g, "");
};

// Remove HTML tags
export const removeTags = (str: any) => {
	// Replace [[ ]] with empty string
	str = str.replace(/\[\[.*\]\]/g, "");
	return str.replace(/(<([^>]+)>)/gi, "");
};

// Truncate string
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

// Random Order Number
export const randomOrderString = (num = 5) => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < num; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const genSlug = (string: string) => {
	const slug = string
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "");
	return slug;
};

export const dateFormat = (date: string) => {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	};
	const formatter = new Intl.DateTimeFormat("en-US", options);
	const parts = formatter.formatToParts(new Date(date));
	const formattedDate = date ? parts.map((part) => (part.type === "literal" ? part.value : part.value.padStart(2, "0"))).join("") : "N/A";
	return formattedDate;
};

export const autoOderDate = () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");
	return `ORDER:${month}${day}${year}-${hour}${minute}${second}`;
};

export const checkStringIsTextOrColorHexOrURL = (str: string) => {
	// Check if the string is a valid hex color code
	const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
	if (hexColorRegex.test(str)) {
		return "color";
	}

	// Check if the string is a valid URL
	const urlRegex = /^(https?:\/\/[^\s]+|\/uploads\/[a-zA-Z0-9\-_.]+)$/;
	if (urlRegex.test(str)) {
		return "url";
	}

	// If it's neither, return "text"
	return "text";
};

export const stringToKeyValue = (str: string) => {
	// Remove space, special characters, and convert to lowercase
	const sanitizedStr = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
	// Convert to key-value pair
	return sanitizedStr;
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

// Count Object Array
export const countObjectArray = (arr: string) => {
	if (arr && typeof arr === "string") {
		try {
			const parsedArr = JSON.parse(arr);
			if (Array.isArray(parsedArr)) {
				return parsedArr.length;
			}
		} catch (error) {
			console.error("Error parsing JSON:", error);
		}
	}
	return 0;
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

// Convert String to JSON
export const convertStringToJson = (str: string) => {
	// Check if the string is valid JSON
	if (typeof str === "string") {
		try {
			const parsed = JSON.parse(str);
			if (typeof parsed === "object" && parsed !== null) {
				return parsed;
			}
		} catch (e) {
			// Not valid JSON
		}
	}
	return null;
};

export const removeUnderscoreAndDash = (str: string, addons: string) => {
	// Remove _ and - from string and remove addons to empty string
	const regex = new RegExp(`${addons}`, "g");
	const result = str.replace(/[_-]/g, " ").replace(regex, "");
	return result;
};

// checkAllObjectEmpty
export const checkAllObjectEmpty = (obj: any, key: string) => {
	// Check in object find key and check value is empty
	let arrCheck = false;
	if (obj && Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			if (obj[i]?.value === "" || obj[i]?.value === null || obj[i]?.value === undefined || obj[i]?.value === "[]") {
				arrCheck = true;
			}
		}
	}
	return arrCheck;
};

// formatBytes
export const formatBytes = (bytes: number) => {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
	return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

export const rolesCheck = (role: any, acceptRole: string[]) => {
	if (role && acceptRole.includes(role)) {
		return true;
	}
	return false;
};

export const permissionsCheck = (permissions: any, permission: string) => {
	const checkPermissions = JSON.parse(typeof permissions === "string" ? permissions : JSON.stringify(permissions || []));

	if (checkPermissions && checkPermissions.includes(permission)) {
		return true;
	}
	return false;
};

/**
 * Enhanced permission checking functions
 */
export const hasAnyRole = (userRole: string, allowedRoles: string[]): boolean => {
	return allowedRoles.includes(userRole);
};

export const hasAllRoles = (userRoles: string[], requiredRoles: string[]): boolean => {
	return requiredRoles.every((role) => userRoles.includes(role));
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
	return requiredPermissions.some((permission) => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
	return requiredPermissions.every((permission) => userPermissions.includes(permission));
};

/**
 * Resource-based permission checking
 */
export const hasResourcePermission = (userPermissions: any, resource: string, action: string): boolean => {
	try {
		const permissions = typeof userPermissions === "string" ? JSON.parse(userPermissions) : userPermissions || {};

		const resourcePermissions = permissions[resource];
		if (!resourcePermissions) return false;

		return resourcePermissions.includes(action) || resourcePermissions.includes("*");
	} catch {
		return false;
	}
};

/**
 * Level-based permission checking
 */
export const hasMinimumPermissionLevel = (userLevel: number, requiredLevel: number): boolean => {
	return userLevel >= requiredLevel;
};

/**
 * Context-aware permission checking
 */
export const canAccessResource = (user: any, resource: string, action: string, resourceOwnerId?: string): boolean => {
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
export const isPermissionValid = (permission: any, currentTime: Date = new Date()): boolean => {
	if (!permission.validFrom && !permission.validTo) {
		return true;
	}

	const validFrom = permission.validFrom ? new Date(permission.validFrom) : null;
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
