import { NextRequest, NextResponse } from "next/server";

// This is a consolidated API router that handles all admin and public routes
// to reduce the number of serverless functions on Vercel

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Route to appropriate handler based on the path
	if (pathname.includes("/admin/users")) {
		// Dynamically import and call users handler
		try {
			const { GET: usersGET } = await import("./admin/users/route");
			return usersGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Users endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/posts")) {
		try {
			const { GET: postsGET } = await import("./admin/posts/route");
			return postsGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Posts endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/categories")) {
		try {
			const { GET: categoriesGET } = await import("./admin/categories/route");
			return categoriesGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Categories endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/files")) {
		try {
			const { GET: filesGET } = await import("./admin/files/route");
			return filesGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Files endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/orders")) {
		try {
			const { GET: ordersGET } = await import("./admin/orders/route");
			return ordersGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Orders endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/attributes")) {
		try {
			const { GET: attributesGET } = await import("./admin/attributes/route");
			return attributesGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Attributes endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/settings")) {
		try {
			const { GET: settingsGET } = await import("./admin/settings/route");
			return settingsGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Settings endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/search")) {
		try {
			const { GET: searchGET } = await import("./admin/search/route");
			return searchGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Search endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/upload")) {
		try {
			const { GET: uploadGET } = await import("./admin/upload/route");
			return uploadGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Upload endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/public/pages")) {
		try {
			const { GET: pagesGET } = await import("./public/pages/[id]/route");
			return pagesGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Pages endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/public/posts")) {
		try {
			const { GET: postsGET } = await import("./public/posts/route");
			return postsGET(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Public posts endpoint not found" },
				{ status: 404 },
			);
		}
	}

	return NextResponse.json(
		{ error: "API endpoint not found" },
		{ status: 404 },
	);
}

export async function POST(request: NextRequest) {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Route POST requests to appropriate handlers
	if (pathname.includes("/admin/users")) {
		try {
			const { POST: usersPOST } = await import("./admin/users/route");
			return usersPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Users endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/posts")) {
		try {
			const { POST: postsPOST } = await import("./admin/posts/route");
			return postsPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Posts endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/categories")) {
		try {
			const { POST: categoriesPOST } = await import("./admin/categories/route");
			return categoriesPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Categories endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/files")) {
		try {
			const { POST: filesPOST } = await import("./admin/files/route");
			return filesPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Files endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/orders")) {
		try {
			const { POST: ordersPOST } = await import("./admin/orders/route");
			return ordersPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Orders endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/attributes")) {
		try {
			const { POST: attributesPOST } = await import("./admin/attributes/route");
			return attributesPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Attributes endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/settings")) {
		try {
			const { POST: settingsPOST } = await import("./admin/settings/route");
			return settingsPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Settings endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/upload")) {
		try {
			const { POST: uploadPOST } = await import("./admin/upload/route");
			return uploadPOST(request);
		} catch (error) {
			return NextResponse.json(
				{ error: "Upload endpoint not found" },
				{ status: 404 },
			);
		}
	}

	return NextResponse.json(
		{ error: "API endpoint not found" },
		{ status: 404 },
	);
}

export async function PUT(request: NextRequest) {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Route PUT requests to appropriate handlers
	if (pathname.includes("/admin/users")) {
		try {
			const { PUT: usersPUT } = await import("./admin/users/route");
			return usersPUT
				? usersPUT(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Users endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/posts")) {
		try {
			const { PUT: postsPUT } = await import("./admin/posts/route");
			return postsPUT
				? postsPUT(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Posts endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/categories")) {
		try {
			const { PUT: categoriesPUT } = await import("./admin/categories/route");
			return categoriesPUT
				? categoriesPUT(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Categories endpoint not found" },
				{ status: 404 },
			);
		}
	}

	// Add other PUT handlers as needed

	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Route DELETE requests to appropriate handlers
	if (pathname.includes("/admin/users")) {
		try {
			const { DELETE: usersDELETE } = await import("./admin/users/route");
			return usersDELETE
				? usersDELETE(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Users endpoint not found" },
				{ status: 404 },
			);
		}
	}

	if (pathname.includes("/admin/posts")) {
		try {
			const { DELETE: postsDELETE } = await import("./admin/posts/route");
			return postsDELETE
				? postsDELETE(request)
				: NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Posts endpoint not found" },
				{ status: 404 },
			);
		}
	}

	// Add other DELETE handlers as needed

	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
