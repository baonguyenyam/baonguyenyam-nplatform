import { auth } from "@/auth";
import models from "@/models";

// get all Files
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

	const count = await models.File.getFilesCount(query);
	const db = await models.File.getAllFiles(query);

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

// Create Files
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const db = await models.File.createFile(body);

	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "File created successfully",
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
	const db = await models.File.deleteMulti(body);

	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "Files deleted successfully",
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
