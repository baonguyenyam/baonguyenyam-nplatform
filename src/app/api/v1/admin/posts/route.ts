import { auth } from "@/auth";
import models from "@/models";

// get all users
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	// QUERY PARAMS
	const query = {
		s: new URL(req.url).searchParams.get("s") || "",
		skip: parseInt(new URL(req.url).searchParams.get("skip") ?? "0"),
		take: parseInt(new URL(req.url).searchParams.get("take") ?? "10"),
		orderBy: new URL(req.url).searchParams.get("orderBy") || "createdAt",
		filterBy: new URL(req.url).searchParams.get("filterBy") || "",
		byCat: new URL(req.url).searchParams.get("cat") || "all",
		type: new URL(req.url).searchParams.get("type") || null,
	};

	const count = await models.Post.getPostsCount(query);
	const db = await models.Post.getAllPosts(query);

	if (session) {
		return new Response(
			JSON.stringify({
				message: "Data fetched successfully",
				data: db,
				count: count,
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

// Create User
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	// Add the userId to the body
	body.userId = id;
	const db = await models.Post.createPost(body);

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

// DELETE Multiple Posts
export async function DELETE(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const db = await models.Post.deleteMulti(body);
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
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// UPDATE Multiple Posts
export async function PATCH(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const { ids, ...rest } = body;
	const db = await models.Post.updateMulti(ids, rest);
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
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
