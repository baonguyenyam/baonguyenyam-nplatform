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
		error: "/authentication/login",
	},
	events: {
		async signIn({ user }) {
			try {
				const existingUser = await models.User.getUserByEmail(
					user?.email || "",
				);
				if (!existingUser) {
					await models.User.createUser({
						email: user.email!,
						name: user.name!,
						emailVerified: new Date(),
						role: "USER",
						permissions: "[]",
						avatar: user.image ? user.image : null,
					});
					// sendEmail - only import and use in server environment
					if (typeof window === "undefined") {
						try {
							const { sendEmail } = await import("./lib/server-utils");
							const Subject = `Welcome to ${process.env.PUBLIC_SITE_NAME ?? ""}'s website`;
							await sendEmail(user.email!, user.name!, Subject);
						} catch (error) {
							console.error("Error sending welcome email:", error);
						}
					}
				}
				if (existingUser && !existingUser?.emailVerified) return;
				if (existingUser?.isTwoFactorEnabled) {
					const twoFactorConfirmation =
						await models.Auth.getTwoFactorConfirmationByUserId(
							existingUser?.id,
						);
					if (!twoFactorConfirmation) return;
					await db.twoFactorConfirmation.delete({
						where: {
							id: twoFactorConfirmation.id,
						},
					});
				}
				// IF exits user update avatar
				if (existingUser && user.image) {
					await models.User.updateUser(existingUser?.id, {
						avatar: user.image,
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
				token.permissions = existingUser.permissions;
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.accessToken) session.accessToken = token.accessToken;
			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
				session.user.id = token.id as string;
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
				session.user.permissions = token.permissions as string[];
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
