import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

import authConfig from "./auth.config";

// Middleware-safe auth without database imports
export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	// Remove all database-related callbacks for middleware
	callbacks: {
		async authorized({ request, auth }) {
			const { pathname } = request.nextUrl;
			if (pathname === "/middleware-example") return !!auth;
			return true;
		},
		async jwt({ token }) {
			// Minimal JWT handling for middleware
			return token;
		},
		async session({ session, token }) {
			// Minimal session handling for middleware
			return session;
		},
	},
});
