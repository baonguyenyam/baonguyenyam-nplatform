import { auth } from "@/auth";
import models from "@/models";

// get all Mets
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	// /[id]/meta
	const params = req.url.split("/").pop();
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

	const db = await models.AttributeMeta.getAttributeMetaById(Number(params));

	if (session) {
		return new Response(
			JSON.stringify({
				message: "Data fetched successfully",
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

// Create meta
export async function PUT(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const body = await req.json();
	const params = req.url.split("/").pop();
	const db = await models.AttributeMeta.updateAttributeMeta(
		Number(params),
		body,
	);
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
	const db = await models.AttributeMeta.deleteMulti(body);

	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "Attribute deleted successfully",
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
