import { auth } from "@/auth";
import { authError, createPagination,parsePaginationParams, parseQueryParams, successResponse } from "@/lib/api-helpers";
import models from "@/models";

// get all users
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return authError();
	}

	try {
		const url = new URL(req.url);
		const searchParams = url.searchParams;
		
		// Parse pagination and query parameters
		const pagination = parsePaginationParams(searchParams);
		const queryParams = parseQueryParams(searchParams);

		// Combine parameters
		const query = {
			...queryParams,
			...pagination,
		};

		// Fetch data and count in parallel for better performance
		const [db, count] = await Promise.all([
			models.User.getAllUsers(query),
			models.User.getUsersCount(query),
		]);

		if (!db) {
			throw new Error('Failed to fetch users');
		}

		// Create pagination info
		const paginationInfo = createPagination(count || 0, pagination.page, pagination.limit);

		return successResponse(
			db,
			'Users fetched successfully',
			count,
			paginationInfo
		);

	} catch (error) {
		return successResponse(null, 'Error fetching users', 0);
	}
}

// Create User
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const db = await models.User.createUser(body);

	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "User created successfully",
				data: db,
				success: "success",
			}),
			{
				status: 200,
				headers: {
					"content-type": "application/json",
				},
			},
		);
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// DELETE Multiple
export async function DELETE(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const db = await models.User.deleteMulti(body);

	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "User deleted successfully",
				data: db,
				success: "success",
			}),
			{
				status: 200,
				headers: {
					"content-type": "application/json",
				},
			},
		);
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// UPDATE Multiple
export async function PATCH(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const { ids, ...rest } = body;
	const db = await models.User.updateMulti(ids, rest);
	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "User updated successfully",
				data: db,
				success: "success",
			}),
			{
				status: 200,
				headers: {
					"content-type": "application/json",
				},
			},
		);
	}
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
