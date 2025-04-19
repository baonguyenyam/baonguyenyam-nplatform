/**
 * An array of routes accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */

// PUBLIC 
export const publicApp: string[] = [
	"/",
	"/(blogs|blog)/:slug",
];

// ADMIN 
export const publicRoutes: string[] = [
	"/",
	"/authentication/logout/success",
	"/authentication/new-verification"
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes: string[] = [
	"/authentication/login",
	"/authentication/register",
	"/authentication/reset",
	"/authentication/new-password"
];

/**
 * The prefix for the API authentication routes.
 * Routes that start with this prefix are used for API authentication purpose.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";
export const pathAuthPrefix: string = "/admin";

/**
 * The default route to redirect to after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/admin";
export const DEFAULT_LOGOUT_REDIRECT: string = "/authentication/logout/success";
export const SIGNIN_ERROR_URL: string = "/authentication/login";
