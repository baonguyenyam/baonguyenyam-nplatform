import { auth } from "@/auth";
import models from "@/models";

// Delete User
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params && role === "ADMIN") {
		const db = await models.User.deleteUser(params);
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
	}
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// Update User
export async function PUT(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();
	const body = await req.json();

	if (params) {
		const db = await models.User.updateUser(params, body);
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
	}
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// Get User
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params) {
		const db = await models.User.getUserById(params);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "User fetched successfully",
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
	}
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
