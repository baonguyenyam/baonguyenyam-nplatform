// Standard API response interface
interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	count?: number;
	pagination?: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	error?: string;
}

// Success response helper
export function successResponse<T>(
	data: T,
	message: string = "Success",
	count?: number,
	pagination?: any,
): Response {
	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
	};

	if (count !== undefined) {
		response.count = count;
	}

	if (pagination) {
		response.pagination = pagination;
	}

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
		},
	});
}

// Error response helper
export function errorResponse(
	message: string = "An error occurred",
	status: number = 500,
	error?: string,
): Response {
	return new Response(
		JSON.stringify({
			success: false,
			message,
			error,
		}),
		{
			status,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}

// Authentication error
export function authError(): Response {
	return errorResponse("Not authenticated", 401);
}

// Authorization error
export function authorizationError(): Response {
	return errorResponse("Not authorized", 403);
}

// Validation error
export function validationError(message: string): Response {
	return errorResponse(message, 400);
}

// Not found error
export function notFoundError(resource: string = "Resource"): Response {
	return errorResponse(`${resource} not found`, 404);
}

// Parse pagination parameters
export function parsePaginationParams(searchParams: URLSearchParams) {
	const page = parseInt(searchParams.get("page") ?? "1");
	const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100); // Max 100 items per page
	const skip = (page - 1) * limit;

	return {
		page,
		limit,
		skip,
		take: limit,
	};
}

// Parse query parameters
export function parseQueryParams(searchParams: URLSearchParams) {
	return {
		s: searchParams.get("s") || "",
		orderBy: searchParams.get("orderBy") || "createdAt",
		filterBy: searchParams.get("filterBy") || "",
		byCat: searchParams.get("cat") || "all",
		type: searchParams.get("type") || null,
		published: searchParams.get("published")
			? searchParams.get("published") === "true"
			: undefined,
		min: searchParams.get("min") === "true",
	};
}

// Create pagination object
export function createPagination(total: number, page: number, limit: number) {
	return {
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
}

// Enhanced response with caching headers
export function cachedSuccessResponse<T>(
	data: T,
	message: string = "Success",
	count?: number,
	pagination?: any,
	cacheMaxAge: number = 300, // 5 minutes default
): Response {
	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
	};

	if (count !== undefined) {
		response.count = count;
	}

	if (pagination) {
		response.pagination = pagination;
	}

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=600`,
			ETag: `"${Buffer.from(JSON.stringify(data)).toString("base64")}"`,
			Vary: "Accept-Encoding",
		},
	});
}

// Response with compression hints
export function compressedResponse<T>(
	data: T,
	message: string = "Success",
): Response {
	const jsonString = JSON.stringify({
		success: true,
		message,
		data,
	});

	return new Response(jsonString, {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
			"Content-Length": Buffer.byteLength(jsonString, "utf8").toString(),
			Vary: "Accept-Encoding",
		},
	});
}

// Streaming response for large datasets
export function streamingResponse<T>(
	dataGenerator: AsyncGenerator<T, void, unknown>,
	message: string = "Success",
): Response {
	const stream = new ReadableStream({
		async start(controller) {
			controller.enqueue(
				new TextEncoder().encode(
					`{"success":true,"message":"${message}","data":[`,
				),
			);

			let first = true;
			for await (const item of dataGenerator) {
				if (!first) {
					controller.enqueue(new TextEncoder().encode(","));
				}
				controller.enqueue(new TextEncoder().encode(JSON.stringify(item)));
				first = false;
			}

			controller.enqueue(new TextEncoder().encode("]}"));
			controller.close();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "application/json",
			"Transfer-Encoding": "chunked",
		},
	});
}

// Enhanced response with streaming for large datasets
export async function streamingSuccessResponse<T>(
	dataStream: AsyncGenerator<T[], void, unknown>,
	message: string = "Success",
): Promise<Response> {
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		async start(controller) {
			try {
				controller.enqueue(
					encoder.encode(`{"success":true,"message":"${message}","data":[`),
				);

				let isFirst = true;
				for await (const batch of dataStream) {
					for (const item of batch) {
						if (!isFirst) {
							controller.enqueue(encoder.encode(","));
						}
						controller.enqueue(encoder.encode(JSON.stringify(item)));
						isFirst = false;
					}
				}

				controller.enqueue(encoder.encode('],"streaming":true}'));
				controller.close();
			} catch (error) {
				controller.error(error);
			}
		},
	});

	return new Response(stream, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Transfer-Encoding": "chunked",
			"Cache-Control": "no-cache",
		},
	});
}

// Response with better compression hints
export function optimizedSuccessResponse<T>(
	data: T,
	message: string = "Success",
	count?: number,
	pagination?: any,
	cacheSeconds: number = 300,
): Response {
	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
	};

	if (count !== undefined) {
		response.count = count;
	}

	if (pagination) {
		response.pagination = pagination;
	}

	const jsonString = JSON.stringify(response);
	const etag = `"${Buffer.from(jsonString).toString("base64").slice(0, 16)}"`;

	return new Response(jsonString, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=600`,
			ETag: etag,
			Vary: "Accept-Encoding",
			"X-Content-Type-Options": "nosniff",
			"Content-Encoding": "gzip", // Hint for compression
		},
	});
}

// Enhanced batch processing for large operations
export async function batchProcessResponse<T>(
	items: T[],
	processor: (batch: T[]) => Promise<any>,
	batchSize: number = 50,
	message: string = "Batch processing completed",
): Promise<Response> {
	const results = [];
	const batches = [];

	for (let i = 0; i < items.length; i += batchSize) {
		batches.push(items.slice(i, i + batchSize));
	}

	// Process batches in parallel (but limit concurrency)
	const concurrencyLimit = 3;
	for (let i = 0; i < batches.length; i += concurrencyLimit) {
		const batchPromises = batches
			.slice(i, i + concurrencyLimit)
			.map((batch) => processor(batch));

		const batchResults = await Promise.all(batchPromises);
		results.push(...batchResults);
	}

	return optimizedSuccessResponse(results, message, results.length);
}

// Parse advanced query parameters with validation
export function parseAdvancedQueryParams(searchParams: URLSearchParams) {
	const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
	const limit = Math.min(
		Math.max(1, parseInt(searchParams.get("limit") ?? "20")),
		100,
	);
	const skip = (page - 1) * limit;

	const orderBy = searchParams.get("orderBy") || "createdAt";
	const orderDirection = searchParams.get("order") === "asc" ? "asc" : "desc";

	// Parse filters
	const filters: Record<string, any> = {};
	for (const [key, value] of searchParams.entries()) {
		if (key.startsWith("filter_") && value) {
			const filterKey = key.replace("filter_", "");
			// Handle different filter types
			if (value === "true" || value === "false") {
				filters[filterKey] = value === "true";
			} else if (!isNaN(Number(value))) {
				filters[filterKey] = Number(value);
			} else {
				filters[filterKey] = value;
			}
		}
	}

	return {
		pagination: { page, limit, skip, take: limit },
		search: searchParams.get("s") || "",
		orderBy: { [orderBy]: orderDirection },
		filters,
		published: searchParams.get("published")
			? searchParams.get("published") === "true"
			: undefined,
		min: searchParams.get("min") === "true",
	};
}
