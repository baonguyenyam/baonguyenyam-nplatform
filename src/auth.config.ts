import type { NextAuthConfig } from "next-auth";
import { CredentialsSignin } from "next-auth"; // Import CredentialsSignin
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z, ZodError } from "zod";

// Consider moving this schema to a shared location if used elsewhere (e.g., the login form)
const FormSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required"),
	// You might remove min/max length checks here if you prefer the API to handle all validation
	// .min(8, "Password must be more than 8 characters")
	// .max(32, "Password must be less than 32 characters"),
});

export default {
	trustHost: true, // This allows NextAuth to trust all hosts
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
			// Optional: You can remove name and credentials if you use a custom login form exclusively
			// name: "Credentials",
			// credentials: {
			// 	email: { label: "Email", type: "text", placeholder: "Email" },
			// 	password: { label: "Password", type: "password", placeholder: "Password" },
			// },
			async authorize(credentials: any) {
				// credentials type is any, which is okay here
				try {
					// 1. Validate input using Zod
					const { email, password } = await FormSchema.parseAsync(credentials);

					// 2. Call your custom sign-in API endpoint
					// Ensure PUBLIC_SITE_URL is correctly set in your environment variables
					const apiEndpoint = `${process.env.PUBLIC_SITE_URL}/api/auth/signin`;
					console.log(`Calling sign-in API: ${apiEndpoint}`); // Log the endpoint being called

					const res = await fetch(apiEndpoint, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});

					const responseBody = await res.json();

					// 3. Check the response from your API
					if (!res.ok || !responseBody.user) {
						// Log the error message from the API if available
						console.error(
							"API Sign-in failed:",
							responseBody.message || `Status code: ${res.status}`,
						);
						// Throwing an error here can provide feedback to the user on the login page
						// You can throw a generic error or a specific one like CredentialsSignin
						throw new CredentialsSignin(
							responseBody.message ||
							"Login failed. Please check your credentials.",
						);
						// Alternatively, returning null will also indicate failure, but might provide less feedback
						// return null;
					}

					// 4. Return the user object if authentication was successful
					console.log("API Sign-in successful for:", responseBody.user.email);
					return responseBody.user; // Return the user object nested under 'user'
				} catch (error) {
					// Handle Zod validation errors
					if (error instanceof ZodError) {
						console.error("Zod Validation Error:", error.errors);
						// You might want to throw a specific error message based on validation
						throw new CredentialsSignin("Invalid email or password format.");
						// return null;
					}
					// Handle errors thrown from the fetch/response check block
					if (error instanceof CredentialsSignin) {
						// Re-throw the specific error for NextAuth to handle
						throw error;
					}
					// Handle other unexpected errors
					console.error("Authorize Error:", error);
					// Throw a generic error for other cases
					throw new CredentialsSignin(
						"An unexpected error occurred during login.",
					);
					// return null;
				}
			},
		}),
	],
} satisfies NextAuthConfig;
