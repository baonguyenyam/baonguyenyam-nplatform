import type { UserRole } from "@prisma/client";
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
			// Preserve token data from main auth
			return token;
		},
		async session({ session, token }) {
			// Map token data to session for middleware
			if (token?.role && session.user) {
				session.user.role = token.role as UserRole;
				session.user.id = token.id as string;
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
				session.user.permissions = token.permissions as string[];
			}
			return session;
		},
	},
});
