import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

import { db } from "@/lib/db";
import models from "@/models";

import "next-auth/jwt";

import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
	debug: !!process.env.AUTH_DEBUG,
	secret: process.env.AUTH_SECRET,
	session: { strategy: "jwt" },
	pages: {
		signIn: "/authentication/login",
		signOut: "/authentication/logout",
		verifyRequest: "/authentication/verify-request",
		newUser: "/authentication/register",
		error: "/authentication/error",
	},
	events: {
		async signIn({ user }) {
			try {
				const existingUser = await models.User.getUserByEmail(user?.email || "");
				if (!existingUser) {
					await models.User.createUser({
						email: user.email!,
						name: user.name!,
						emailVerified: new Date(),
						role: "USER",
						avatar: user.image ? user.image : null,
					});
				}
				if (existingUser && !existingUser?.emailVerified) return;
				if (existingUser?.isTwoFactorEnabled) {
					const twoFactorConfirmation = await models.Auth.getTwoFactorConfirmationByUserId(existingUser?.id);
					if (!twoFactorConfirmation) return;
					await db.twoFactorConfirmation.delete({
						where: {
							id: twoFactorConfirmation.id,
						},
					});
				}
			} catch (error) {
				console.error("Error creating user:", error);
			}
		},
	},
	callbacks: {
		async authorized({ request, auth }) {
			// console.log("Authorized callback:", auth?.user?.role);
			const { pathname } = request.nextUrl;
			if (pathname === "/middleware-example") return !!auth;
			return true;
		},
		async jwt({ token }) {
			const existingUser = await models.User.getUserByEmail(token?.email || "");
			if (existingUser) {
				token.id = existingUser.id;
				token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
				token.role = existingUser.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.accessToken) session.accessToken = token.accessToken;
			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
				session.user.id = token.id as string;
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
			}
			return session;
		},
	},
	...authConfig,
});

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
	}
}
