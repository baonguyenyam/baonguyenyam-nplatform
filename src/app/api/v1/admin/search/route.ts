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

	const db = await models.Search.searchAll(query);

	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "Data fetched successfully",
				data: db.data,
				count: db.count,
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

	if (!db) {
		return new Response(JSON.stringify({ message: "No data found" }), { status: 404, headers: { "content-type": "application/json" } });
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
