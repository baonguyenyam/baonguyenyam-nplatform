import { auth } from "@/auth";
import models from "@/models";

// Delete File
export async function DELETE(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params && role === "ADMIN") {
		const db = await models.File.deleteFile(Number(params));
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "File deleted successfully",
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

// Update File
export async function PUT(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();
	const body = await req.json();

	if (params) {
		const db = await models.File.updateFile(Number(params), body);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "File updated successfully",
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

// Get File
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params) {
		const db = await models.File.getFileById(Number(params));
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "File updated successfully",
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
