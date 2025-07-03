import { auth } from "@/auth";
import models from "@/models";

// Delete Post
export async function DELETE(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params && role === "ADMIN") {
		const db = await models.Post.deletePost(Number(params));
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Post deleted successfully",
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

// Update Post
export async function PUT(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();
	const body = await req.json();

	if (params) {
		const db = await models.Post.updatePost(Number(params), body);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Post updated successfully",
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

// Get Post
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params) {
		const db = await models.Post.getPostById(Number(params));
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Post fetched successfully",
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
