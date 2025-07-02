import bcrypt from "bcrypt";

import models from "@/models"; // Assuming models.User.signIn maps to getUserByEmail

// Sign in with credentials
export async function POST(req: Request) {
	try {
		// Add a try...catch block for better error handling
		const { email, password } = await req.json();

		// Basic validation
		if (!email || !password) {
			// Use 400 Bad Request for missing input
			return Response.json(
				{ message: "Email and password are required" },
				{ status: 400 },
			);
		}

		// Fetch user including the password hash
		// Ensure models.User.signIn actually fetches the user with the password field
		const dbUser = await models.User.signIn(email); // Renamed to avoid conflict with password variable

		// Check if user exists
		if (!dbUser || !dbUser.password) {
			// User not found or password field missing (shouldn't happen with Prisma schema)
			// Keep the error message generic for security
			console.warn(
				`Sign-in attempt failed for email: ${email}. User not found or password missing.`,
			);
			return Response.json(
				{ message: "Invalid email or password" },
				{ status: 401 },
			);
		}

		// Compare passwords
		const isMatch = await bcrypt.compare(password, dbUser.password);

		if (isMatch) {
			// Exclude password from the returned user object
			const { password: _, ...user } = dbUser; // Use _ to indicate the password variable is intentionally unused
			// Success: Return the user object nested under 'user' key as expected by auth.config.ts
			return Response.json({ user }, { status: 200 });
		} else {
			// Password mismatch
			console.warn(
				`Sign-in attempt failed for email: ${email}. Invalid password.`,
			);
			return Response.json(
				{ message: "Invalid email or password" },
				{ status: 401 },
			);
		}
	} catch (error) {
		console.error("Sign-in API error:", error);
		// Generic server error for unexpected issues
		return Response.json(
			{ message: "An internal server error occurred" },
			{ status: 500 },
		);
	}
}
