import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
	if (!str) return "";
	return str.replace(/<[^>]*>?/gm, "");
};

// Format date
export const dateFormat = (date: any) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString();
};

// Format bytes
export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Generate slug
export const genSlug = (str: string) => {
	if (!str) return "";
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

// String to key value
export const stringToKeyValue = (str: string) => {
	if (!str) return {};
	try {
		return JSON.parse(str);
	} catch {
		return {};
	}
};

// Random order string
export const randomOrderString = () => {
	return Math.random().toString(36).substring(2, 15);
};

// Check string is text or color hex or URL
export const checkStringIsTextOrColorHexOrURL = (str: string) => {
	if (!str) return "text";

	// Check if it's a hex color
	if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str)) {
		return "color";
	}

	// Check if it's a URL
	try {
		new URL(str);
		return "url";
	} catch {
		return "text";
	}
};

// Count object array
export const countObjectArray = (arr: any[]) => {
	if (!Array.isArray(arr)) return 0;
	return arr.length;
};

// Auto order date
export const autoOderDate = () => {
	return new Date().toISOString();
};

// Check all object empty
export const checkAllObjectEmpty = (obj: any) => {
	if (!obj || typeof obj !== "object") return true;
	return Object.keys(obj).length === 0;
};

// Convert string to JSON
export const convertStringToJson = (str: string) => {
	if (!str) return {};
	try {
		return JSON.parse(str);
	} catch {
		return {};
	}
};

// Remove underscore and dash
export const removeUnderscoreAndDash = (str: string) => {
	if (!str) return "";
	return str.replace(/[_-]/g, " ");
};
