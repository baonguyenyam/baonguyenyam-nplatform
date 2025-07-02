/**
 * Edge-safe utility functions for middleware
 * These functions do not depend on Node.js modules
 */

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
