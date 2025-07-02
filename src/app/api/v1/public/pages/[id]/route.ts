import { notFoundError, successResponse } from "@/lib/api-helpers";
import { cachedGetPostBySlug } from "@/lib/db-cache";
import models from "@/models";

// Get Post by slug - optimized with caching
export async function GET(req: Request) {
	try {
		const params = req.url.split("/").pop();

		if (!params) {
			return notFoundError("Post");
		}

		// Use cached version for better performance
		const db = await cachedGetPostBySlug(params);

		if (!db) {
			return notFoundError("Post");
		}

		return successResponse(db, "Post fetched successfully");
	} catch (error) {
		return notFoundError("Post");
	}
}
