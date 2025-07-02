import { db } from "@/lib/db";

// Enhanced database query utilities for better performance
export class DatabaseOptimizer {
	// Batch queries to reduce database round trips
	static async batchUserQueries(userIds: string[]) {
		// Instead of multiple individual queries, use one query with 'in' operator
		return await db.user.findMany({
			where: {
				id: {
					in: userIds,
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				avatar: true,
				role: true,
			},
		});
	}

	// Optimized pagination with cursor-based pagination for large datasets
	static async getCursorPaginatedPosts(cursor?: string, limit: number = 20) {
		return await db.post.findMany({
			take: limit,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: parseInt(cursor) } : undefined,
			where: {
				published: true,
			},
			select: {
				id: true,
				title: true,
				slug: true,
				createdAt: true,
				user: {
					select: {
						id: true,
						name: true,
						avatar: true,
					},
				},
			},
			orderBy: {
				id: "desc",
			},
		});
	}

	// Efficient search with full-text search (requires PostgreSQL)
	static async fullTextSearch(query: string, limit: number = 20) {
		// Using PostgreSQL full-text search for better performance
		return await db.$queryRaw`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p."createdAt",
        u.name as "userName",
        u.avatar as "userAvatar",
        ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', ${query})) as rank
      FROM "Post" p
      JOIN "User" u ON p."userId" = u.id
      WHERE 
        p.published = true AND
        (to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', ${query}))
      ORDER BY rank DESC, p."createdAt" DESC
      LIMIT ${limit}
    `;
	}

	// Optimized count queries with approximate counts for large tables
	static async getApproximateCount(tableName: string): Promise<number> {
		// For very large tables, use approximate count for better performance
		const result = await db.$queryRaw<Array<{ reltuples: number }>>`
      SELECT reltuples::BIGINT AS reltuples
      FROM pg_class 
      WHERE relname = ${tableName}
    `;

		return Math.floor(result[0]?.reltuples || 0);
	}

	// Efficient bulk operations
	static async bulkCreatePosts(posts: any[]) {
		// Use createMany for bulk operations
		return await db.post.createMany({
			data: posts,
			skipDuplicates: true,
		});
	}

	// Optimized data aggregation
	static async getPostStatistics() {
		return await db.post.aggregate({
			_count: {
				id: true,
			},
			_avg: {
				setorder: true,
			},
			where: {
				published: true,
			},
		});
	}

	// Efficient relationship loading with selected fields
	static async getPostsWithRelations(limit: number = 20, offset: number = 0) {
		return await db.post.findMany({
			take: limit,
			skip: offset,
			where: {
				published: true,
			},
			select: {
				id: true,
				title: true,
				slug: true,
				image: true,
				createdAt: true,
				user: {
					select: {
						id: true,
						name: true,
						avatar: true,
					},
				},
				categories: {
					select: {
						id: true,
						title: true,
						slug: true,
					},
					take: 3, // Limit categories to avoid large response
				},
				_count: {
					select: {
						meta: true,
						files: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	// Connection-aware query execution
	static async executeWithRetry<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
		let lastError: Error;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error as Error;

				// Only retry on connection errors
				if (attempt < maxRetries && this.isRetryableError(error)) {
					await this.delay(attempt * 1000); // Exponential backoff
					continue;
				}

				throw error;
			}
		}

		throw lastError!;
	}

	private static isRetryableError(error: any): boolean {
		const retryableErrors = ["ECONNRESET", "ENOTFOUND", "ETIMEDOUT", "connection refused"];

		const errorMessage = error?.message?.toLowerCase() || "";
		return retryableErrors.some((code) => errorMessage.includes(code));
	}

	private static delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// Usage examples and performance tips
export const PerformanceTips = {
	// 1. Use select to fetch only needed fields
	selectiveQuery: () =>
		db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				// Don't fetch large fields like 'data' unless needed
			},
		}),

	// 2. Use proper indexing for where clauses
	indexedQuery: () =>
		db.post.findMany({
			where: {
				published: true, // This field is indexed
				userId: "user-id", // This field is indexed
			},
		}),

	// 3. Limit includes to avoid deep nesting
	limitedIncludes: () =>
		db.post.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						// Don't include nested relations unless necessary
					},
				},
				// Avoid including relations that include other relations
			},
		}),

	// 4. Use pagination for large datasets
	paginatedQuery: (page: number, limit: number = 20) =>
		db.post.findMany({
			take: limit,
			skip: (page - 1) * limit,
			orderBy: {
				createdAt: "desc",
			},
		}),
};
