"use server";

import { Prisma } from "@prisma/client"; // Import Prisma namespace for types

import { auth } from "@/auth"; // Assuming you need authentication
import { db } from "@/lib/db";

// Define an interface for the shape of items returned by the search
interface SearchResultItem {
	id: string; // Or number, depending on your ID types. Use string if mixing types.
	search_name: string; // The common name/title field
	search_content: string; // The common content field
	// Add other common fields if needed, e.g., createdAt: Date;
}

// Define an interface for the count query result
interface CountResult {
	count: bigint; // Prisma count queries typically return bigint
}

export async function getAll(params: {
	take: number;
	skip: number;
	s?: string; // The search term (optional)
	// Add orderBy parameters if needed, e.g., orderBy: string, orderDir: 'asc' | 'desc'
}) {
	const session = await auth();
	// Optional: Add authorization checks if necessary
	// if (!session?.user) {
	//   return { success: "error", message: "Unauthorized", data: [], count: 0 };
	// }

	const { take, skip, s = "" } = params;
	const searchTerm = `%${s}%`; // Prepare search term for ILIKE

	// Define which tables and columns to search
	// Ensure 'id' and the search column ('title', 'name', etc.) exist in each table
	// Use aliases to create consistent 'search_name' and 'type' columns
	const tablesToSearch = [
		{
			tableName: "Post",
			nameColumn: "title",
			contentColumn: "content",
			contentType: "type",
		},
		{ tableName: "User", nameColumn: "name", contentColumn: "email" },
		{ tableName: "Order", nameColumn: "title", contentColumn: "content" },
		// { tableName: "Attribute", nameColumn: "title", contentColumn: "content" },
		// { tableName: "AttributeMeta", nameColumn: "key", contentColumn: "value" },
		{
			tableName: "Category",
			nameColumn: "title",
			contentColumn: "content",
			contentType: "type",
		},
		{
			tableName: "Customer",
			nameColumn: "name",
			contentColumn: "email",
			contentType: "type",
		},
		{ tableName: "File", nameColumn: "name", contentColumn: "data" },
		// Add other tables here, e.g., { tableName: "Order", nameColumn: "orderNumber" }
	];

	// --- Build UNION ALL parts ---
	// INNER JOIN ${table.contentType ? table.contentType : table.contentColumn} ON ${table.contentType ? table.contentType : table.contentColumn} = ${table.nameColumn},
	// ${table.contentType ? table.contentType : table.contentColumn} AS search_type,
	const unionParts = tablesToSearch
		.map(
			(table) => `
        SELECT
            id::text,
			${table.nameColumn} AS search_name,
			${table.contentColumn} AS search_content,
			${table.contentType ? table.contentType : table.contentColumn} AS search_type,
			'${table.tableName}' AS type
        FROM "${table.tableName}"
			`,
		)
		.join(" UNION ALL ");

	if (!unionParts) {
		// Handle case where no tables are defined to search
		return {
			data: [],
			count: 0,
			success: "success",
			message: "No tables configured for search.",
		};
	}

	try {
		// --- Construct the Data Query ---
		// Use Prisma.sql template tag for better formatting and potential future composition
		const dataQuery = Prisma.sql`
            SELECT id, search_name, search_content, type, search_type
            FROM(${Prisma.raw(unionParts)}) AS combined_results
            --Apply WHERE clause again on the combined set(optional if already filtered above, but safe)
            WHERE search_name ILIKE ${searchTerm} OR search_content ILIKE ${searchTerm} 
            ORDER BY search_name ASC-- Example ordering: by name, then ID
            LIMIT ${take} OFFSET ${skip}
	`;

		// --- Construct the Count Query ---
		const countQuery = Prisma.sql`
            SELECT COUNT(*)
	FROM(${Prisma.raw(unionParts)}) AS combined_results
	--Apply WHERE clause again on the combined set for accurate count
            WHERE search_name ILIKE ${searchTerm} OR search_content ILIKE ${searchTerm}
	`;

		// --- Execute Queries ---
		const [searchResults, countResult] = await Promise.all([
			db.$queryRaw<SearchResultItem[]>(dataQuery),
			db.$queryRaw<CountResult[]>(countQuery),
		]);

		// Take maximum of 20 words from search_content for display
		searchResults.forEach((result) => {
			if (result.search_content) {
				const words = result.search_content.split(" ");
				result.search_content =
					words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");
			}
		});

		const totalCount = Number(countResult[0]?.count ?? 0); // Convert bigint count to number

		return {
			data: searchResults,
			count: totalCount,
			success: "success",
			message: "Search results fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "An error occurred while searching.", // User-friendly message
			data: [],
			count: 0,
		};
	}
}
