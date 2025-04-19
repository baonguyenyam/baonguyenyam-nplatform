import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ZodError } from "zod"
import { z } from "zod";

const FormSchema = z.object({
	email: z.string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: z.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});

export default {
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "Email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Password",
				},
			},
			// The name to display on the sign-in form (e.g. "Sign in with...")
			async authorize(credentials) {
				try {
					const { email, password } = await FormSchema.parseAsync(credentials);
					const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					}).then((res) => res.json());
					if (res.error) {
						throw new Error(res.error);
					}
					if (res.user) {
						return res.user;
					}
					// If you return null or false then the credentials will be rejected
					return null;
				}
				catch (error) {
					if (error instanceof ZodError) {
						return null;
					}
					return null;
				}
			},
		}),
	],
} satisfies NextAuthConfig;
