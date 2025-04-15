import { auth } from "@/auth";
import models from "@/models";

// Delete Customer
export async function DELETE(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params && role === "ADMIN") {
		const db = await models.Customer.deleteCustomer(params);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Customer deleted successfully",
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

// Update Customer
export async function PUT(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();
	const body = await req.json();

	if (params) {
		const db = await models.Customer.updateCustomer(params, body);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Customer updated successfully",
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

// Get Customer
export async function GET(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const params = req.url.split("/").pop();

	if (params) {
		const db = await models.Customer.getCustomerById(params);
		if (session && db) {
			return new Response(
				JSON.stringify({
					message: "Customer fetched successfully",
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
