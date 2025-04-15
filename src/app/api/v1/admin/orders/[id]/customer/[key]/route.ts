import { auth } from "@/auth";
import models from "@/models";

// Disconect the customer
export async function PUT(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const customerId = req.url.split("/").pop();
	const orderId = req.url.split("/").slice(-3)[0];

	// Disconnect the customer from the order
	if (!orderId || !customerId) {
		return Response.json({ message: "Invalid order or customer ID" }, { status: 400 });
	}

	const db = await models.Order.disconnectCustomerFromOrder(orderId, customerId);
	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "Customer disconnected successfully",
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

// Connect the customer
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const customerId = req.url.split("/").pop();
	const orderId = req.url.split("/").slice(-3)[0];

	// Connect the customer to the order
	if (!orderId || !customerId) {
		return Response.json({ message: "Invalid order or customer ID" }, { status: 400 });
	}

	const db = await models.Order.connectCustomerToOrder(orderId, customerId);
	if (session && db) {
		return new Response(
			JSON.stringify({
				message: "Customer connected successfully",
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
