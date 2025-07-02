import { NextRequest, NextResponse } from "next/server";

// Import your existing route handlers
// We'll need to modify these to export the handler functions directly

// Admin routes
async function handleAdminUsers(
	request: NextRequest,
	params: { method: string; id?: string },
) {
	const { default: usersHandler } = await import("../admin/users/route");

	switch (params.method) {
		case "GET":
			return usersHandler.GET(request);
		case "POST":
			return usersHandler.POST(request);
		case "PUT":
			return usersHandler.PUT
				? usersHandler.PUT(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		case "DELETE":
			return usersHandler.DELETE
				? usersHandler.DELETE(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		default:
			return NextResponse.json(
				{ error: "Method not allowed" },
				{ status: 405 },
			);
	}
}

async function handleAdminPosts(
	request: NextRequest,
	params: { method: string; id?: string },
) {
	const { default: postsHandler } = await import("../admin/posts/route");

	switch (params.method) {
		case "GET":
			return postsHandler.GET(request);
		case "POST":
			return postsHandler.POST(request);
		case "PUT":
			return postsHandler.PUT
				? postsHandler.PUT(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		case "DELETE":
			return postsHandler.DELETE
				? postsHandler.DELETE(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		default:
			return NextResponse.json(
				{ error: "Method not allowed" },
				{ status: 405 },
			);
	}
}

async function handleAdminCategories(
	request: NextRequest,
	params: { method: string; id?: string },
) {
	const { default: categoriesHandler } = await import(
		"../admin/categories/route"
	);

	switch (params.method) {
		case "GET":
			return categoriesHandler.GET(request);
		case "POST":
			return categoriesHandler.POST(request);
		case "PUT":
			return categoriesHandler.PUT
				? categoriesHandler.PUT(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		case "DELETE":
			return categoriesHandler.DELETE
				? categoriesHandler.DELETE(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		default:
			return NextResponse.json(
				{ error: "Method not allowed" },
				{ status: 405 },
			);
	}
}

// Add similar handlers for other resources...

const adminRoutes: Record<string, Function> = {
	users: handleAdminUsers,
	posts: handleAdminPosts,
	categories: handleAdminCategories,
	// Add other admin routes here
};

// Main router function
async function routeRequest(request: NextRequest) {
	const url = new URL(request.url);
	const pathSegments = url.pathname.split("/").filter(Boolean);

	// Remove 'api', 'v1' from path
	const [, , scope, resource, id] = pathSegments;

	if (scope === "admin") {
		const handler = adminRoutes[resource];
		if (handler) {
			return handler(request, { method: request.method, id });
		}
	}

	// Handle public routes
	if (scope === "public") {
		// Add public route handling here
	}

	return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(request: NextRequest) {
	return routeRequest(request);
}

export async function POST(request: NextRequest) {
	return routeRequest(request);
}

export async function PUT(request: NextRequest) {
	return routeRequest(request);
}

export async function DELETE(request: NextRequest) {
	return routeRequest(request);
}

export async function PATCH(request: NextRequest) {
	return routeRequest(request);
}
