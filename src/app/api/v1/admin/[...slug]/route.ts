import { NextRequest, NextResponse } from "next/server";

import { handleAttributes } from "./handlers/attributes";
import { handleCategories } from "./handlers/categories";
import { handleFiles } from "./handlers/files";
import { handleOrders } from "./handlers/orders";
import { handlePosts } from "./handlers/posts";
import { handleSearch } from "./handlers/search";
import { handleSettings } from "./handlers/settings";
import { handleUpload } from "./handlers/upload";
// Import all your existing handlers
import { handleUsers } from "./handlers/users";

// Route mapping
const routeHandlers = {
	users: handleUsers,
	posts: handlePosts,
	categories: handleCategories,
	files: handleFiles,
	orders: handleOrders,
	attributes: handleAttributes,
	settings: handleSettings,
	search: handleSearch,
	upload: handleUpload,
};

export async function GET(
	request: NextRequest,
	{ params }: { params: { slug: string[] } },
) {
	const [resource, id, action] = params.slug;

	const handler = routeHandlers[resource as keyof typeof routeHandlers];
	if (!handler) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return handler.GET(request, { resource, id, action });
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { slug: string[] } },
) {
	const [resource, id, action] = params.slug;

	const handler = routeHandlers[resource as keyof typeof routeHandlers];
	if (!handler) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return handler.POST(request, { resource, id, action });
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { slug: string[] } },
) {
	const [resource, id, action] = params.slug;

	const handler = routeHandlers[resource as keyof typeof routeHandlers];
	if (!handler) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return handler.PUT(request, { resource, id, action });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { slug: string[] } },
) {
	const [resource, id, action] = params.slug;

	const handler = routeHandlers[resource as keyof typeof routeHandlers];
	if (!handler) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return handler.DELETE(request, { resource, id, action });
}
