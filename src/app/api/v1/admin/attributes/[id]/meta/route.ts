import { auth } from "@/auth";
import models from "@/models";

// get all Meta
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const currentUser = session;
	const { id, role } = session?.user || {};
	const params = req.url.split("/").slice(-2, -1)[0];
	// QUERY PARAMS
	const query = {
		s: new URL(req.url).searchParams.get("s") || "",
		skip: parseInt(new URL(req.url).searchParams.get("skip") ?? "0"),
		take: parseInt(new URL(req.url).searchParams.get("take") ?? "10"),
		orderBy: new URL(req.url).searchParams.get("orderBy") || "createdAt",
		filterBy: new URL(req.url).searchParams.get("filterBy") || "",
		byCat: new URL(req.url).searchParams.get("cat") || "all",
		parent: new URL(req.url).searchParams.get("parent") || null,
		type: new URL(req.url).searchParams.get("type") || null,
	};

	try {
		const count =
			await models.AttributeMeta.getAllAttributeByParentIDCount(query);
		const db = await models.AttributeMeta.getAllAttributeByParentID(query);

		if (currentUser) {
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
	} catch (error) {
		return Response.json({ message: error }, { status: 500 });
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// Create meta
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const currentUser = session;
	const { id, role } = session?.user || {};
	const body = await req.json();
	const params = req.url.split("/").slice(-2, -1)[0];
	body.attributeId = Number(params);

	try {
		const db = await models.AttributeMeta.createAttributeMeta(body);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Meta created successfully",
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
	} catch (error) {
		return Response.json({ message: error }, { status: 500 });
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}

// Delete meta
export async function DELETE(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const currentUser = session;
	const { id, role } = session?.user || {};
	const params = req.url.split("/").slice(-2, -1)[0];
	try {
		const db = await models.AttributeMeta.deleteAttributeMeta(Number(params));
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Meta deleted successfully",
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
	} catch (error) {
		return Response.json({ message: error }, { status: 500 });
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
