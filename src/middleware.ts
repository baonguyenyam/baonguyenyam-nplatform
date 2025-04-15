import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { secureSearchString } from "@/lib/utils";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, pathAuthPrefix, publicApp, publicRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const response = NextResponse.next();
	// Query params
	const searchParams = req.nextUrl.searchParams;
	const search = secureSearchString(searchParams?.get("s")) || "";
	const orderBy = secureSearchString(searchParams?.get("orderBy")) || "";
	const filterBy = secureSearchString(searchParams?.get("filterBy")) || "";
	const byCat = secureSearchString(searchParams?.get("cat")) || "";
	const callbackUrl = secureSearchString(searchParams?.get("callbackUrl")) || "";
	// Set headers
	response?.headers?.set("x-search", search ?? "");
	response?.headers?.set("x-orderBy", orderBy ?? "");
	response?.headers?.set("x-filterBy", filterBy ?? "");
	response?.headers?.set("x-cat", byCat ?? "");
	response?.headers?.set("x-callbackUrl", callbackUrl ?? "");

	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	// Publix publicRoute
	const publicApps = publicApp.includes(nextUrl.pathname);
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isAdminAuthRoute = nextUrl.pathname.startsWith(pathAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (nextUrl.pathname.startsWith("/admin")) {
		response.headers.set("x-isadmin", "true");
	}

	if (isApiAuthRoute) {
		return response;
	}

	if (isAdminAuthRoute) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL(`/authentication/login`, nextUrl));
		}
		return response;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return response;
	}

	if (!isLoggedIn && !publicApps) {
		// Check if the route is public
		if (publicRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
			// If the route is public, allow access
			return response;
		}
	}

	if (!isLoggedIn && !isPublicRoute) {
		let callbackUrl = nextUrl.pathname;
		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);
		return NextResponse.redirect(new URL(`/authentication/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
	}

	return response;
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
