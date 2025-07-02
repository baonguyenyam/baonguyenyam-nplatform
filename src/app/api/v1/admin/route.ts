import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { currentRole } from "@/lib/auth";

// Admin-only API router
export async function GET(request: NextRequest) {
	const role = await currentRole();

	// Authorization check - admin only
	if (role !== UserRole.ADMIN) {
		return NextResponse.json(
			{ message: "Unauthorized - Admin access required" },
			{ status: 403 }
		);
	}

	const url = new URL(request.url);
	const pathname = url.pathname;

	// Extract the admin route path after /api/v1/admin/
	const adminPath = pathname.replace('/api/v1/admin/', '');
	const [resource, id, ...rest] = adminPath.split('/');

	// If no resource specified, return admin status
	if (!resource) {
		return NextResponse.json({
			message: "Admin API - Authorized",
			resources: ["users", "posts", "categories", "files", "orders", "attributes", "settings", "search", "upload"]
		});
	}

	try {
		// Route to appropriate admin handler based on the resource
		switch (resource) {
			case 'users':
				const usersModule = await import('./users/route');
				if (id) {
					// Handle specific user ID routes
					try {
						const userIdModule = await import(`./users/[id]/route`);
						return userIdModule.GET(request);
					} catch {
						return NextResponse.json({ error: 'User ID route not found' }, { status: 404 });
					}
				}
				return usersModule.GET(request, { params: {} });

			case 'posts':
				const postsModule = await import('./posts/route');
				return postsModule.GET(request, { params: {} });

			case 'categories':
				const categoriesModule = await import('./categories/route');
				if (id) {
					try {
						const categoryIdModule = await import(`./categories/[id]/route`);
						return categoryIdModule.GET(request);
					} catch {
						return NextResponse.json({ error: 'Category ID route not found' }, { status: 404 });
					}
				}
				return categoriesModule.GET(request, { params: {} });

			case 'files':
				const filesModule = await import('./files/route');
				if (id) {
					try {
						const fileIdModule = await import(`./files/[id]/route`);
						return fileIdModule.GET(request);
					} catch {
						return NextResponse.json({ error: 'File ID route not found' }, { status: 404 });
					}
				}
				return filesModule.GET(request, { params: {} });

			case 'orders':
				const ordersModule = await import('./orders/route');
				if (id) {
					try {
						const orderIdModule = await import(`./orders/[id]/route`);
						return orderIdModule.GET(request);
					} catch {
						return NextResponse.json({ error: 'Order ID route not found' }, { status: 404 });
					}
				}
				return ordersModule.GET(request, { params: {} });

			case 'attributes':
				const attributesModule = await import('./attributes/route');
				if (id) {
					try {
						const attributeIdModule = await import(`./attributes/[id]/route`);
						return attributeIdModule.GET(request);
					} catch {
						return NextResponse.json({ error: 'Attribute ID route not found' }, { status: 404 });
					}
				}
				return attributesModule.GET(request, { params: {} });

			case 'settings':
				const settingsModule = await import('./settings/route');
				return settingsModule.GET(request, { params: {} });

			case 'search':
				const searchModule = await import('./search/route');
				return searchModule.GET(request);

			case 'upload':
				try {
					const uploadModule = await import('./upload/route');
					if ('GET' in uploadModule && typeof uploadModule.GET === 'function') {
						return uploadModule.GET(request, { params: {} });
					}
				} catch {
					return NextResponse.json({ message: "Upload endpoint available via POST only" }, { status: 200 });
				}
				break;

			default:
				return NextResponse.json({ error: `Admin resource '${resource}' not found` }, { status: 404 });
		}
	} catch (error) {
		console.error('Admin API route error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}

	return NextResponse.json({ error: 'Admin endpoint not found' }, { status: 404 });
}

export async function POST(request: NextRequest) {
	const role = await currentRole();

	if (role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 403 });
	}

	const url = new URL(request.url);
	const pathname = url.pathname;
	const adminPath = pathname.replace('/api/v1/admin/', '');
	const [resource, id] = adminPath.split('/');

	try {
		switch (resource) {
			case 'users':
				const usersModule = await import('./users/route');
				return usersModule.POST(request, { params: {} });

			case 'posts':
				const postsModule = await import('./posts/route');
				return postsModule.POST(request, { params: {} });

			case 'categories':
				const categoriesModule = await import('./categories/route');
				return categoriesModule.POST(request, { params: {} });

			case 'files':
				const filesModule = await import('./files/route');
				return filesModule.POST(request, { params: {} });

			case 'orders':
				const ordersModule = await import('./orders/route');
				return ordersModule.POST(request, { params: {} });

			case 'attributes':
				const attributesModule = await import('./attributes/route');
				return attributesModule.POST(request, { params: {} });

			case 'settings':
				const settingsModule = await import('./settings/route');
				if ('POST' in settingsModule && typeof settingsModule.POST === 'function') {
					return settingsModule.POST(request, { params: {} });
				}
				return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });

			case 'upload':
				const uploadModule = await import('./upload/route');
				return uploadModule.POST(request, { params: {} });

			default:
				return NextResponse.json({ error: `Admin resource '${resource}' not found` }, { status: 404 });
		}
	} catch (error) {
		console.error('Admin API POST route error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	const role = await currentRole();

	if (role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 403 });
	}

	const url = new URL(request.url);
	const pathname = url.pathname;
	const adminPath = pathname.replace('/api/v1/admin/', '');
	const [resource, id] = adminPath.split('/');

	try {
		switch (resource) {
			case 'users':
				if (id) {
					const userIdModule = await import(`./users/[id]/route`);
					if ('PUT' in userIdModule) {
						return userIdModule.PUT(request, { params: { id } });
					}
				}
				const usersModule = await import('./users/route');
				if ('PUT' in usersModule) {
					return usersModule.PUT(request);
				}
				break;

			case 'posts':
				const postsModule = await import('./posts/route');
				if ('PUT' in postsModule) {
					return postsModule.PUT(request);
				}
				break;

			case 'categories':
				if (id) {
					const categoryIdModule = await import(`./categories/[id]/route`);
					if ('PUT' in categoryIdModule) {
						return categoryIdModule.PUT(request, { params: { id } });
					}
				}
				const categoriesModule = await import('./categories/route');
				if ('PUT' in categoriesModule) {
					return categoriesModule.PUT(request);
				}
				break;
		}
	} catch (error) {
		console.error('Admin API PUT route error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}

	return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
	const role = await currentRole();

	if (role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 403 });
	}

	const url = new URL(request.url);
	const pathname = url.pathname;
	const adminPath = pathname.replace('/api/v1/admin/', '');
	const [resource, id] = adminPath.split('/');

	try {
		switch (resource) {
			case 'users':
				if (id) {
					const userIdModule = await import(`./users/[id]/route`);
					if ('DELETE' in userIdModule) {
						return userIdModule.DELETE(request, { params: { id } });
					}
				}
				const usersModule = await import('./users/route');
				if ('DELETE' in usersModule) {
					return usersModule.DELETE(request);
				}
				break;

			case 'posts':
				const postsModule = await import('./posts/route');
				if ('DELETE' in postsModule) {
					return postsModule.DELETE(request);
				}
				break;
		}
	} catch (error) {
		console.error('Admin API DELETE route error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}

	return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
