"use server";

import { auth } from "@/auth";
import models from "@/models";

export async function getAll(query: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Order.getAllOrders(query);
		const dbCount = await models.Order.getOrdersCount(query);
		return {
			data: db,
			count: dbCount,
			success: "success",
			message: "Orders fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching categories",
		};
	}
}

export async function deleteRecord(id: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Order.deleteOrder(id);
		return {
			success: "success",
			data: db,
			message: "Order deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting category",
		};
	}
}

export async function createRecord(data: any, meta: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Order.createOrder(data);
		if (db && meta) {
			const dbMeta = await models.OrderMeta.createOrderMeta({
				orderId: db.id,
				data: meta.data,
			});
		}
		return {
			success: "success",
			data: db,
			message: "Order created successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error creating category",
		};
	}
}

export async function updateRecord(id: string, data: any, meta?: any) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Order.updateOrder(id, data);
		if (db && meta) {
			const dbMeta = await models.OrderMeta.createOrderMeta({
				orderId: db.id,
				data: meta.data,
			});
		}
		return {
			success: "success",
			data: db,
			message: "Order updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating category",
		};
	}
}

export async function getRecord(id: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.Order.getOrderById(id);
		return {
			success: "success",
			data: db,
			message: "Order fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching category",
		};
	}
}

// Delete Multiple Records
export async function deleteMultipleRecords(ids: string[]) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Order.deleteMulti(ids);
		return {
			success: "success",
			data: db,
			message: "Orders deleted successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error deleting categories",
		};
	}
}

// Update Multiple Records
export async function updateMultipleRecords(ids: string[], data: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	try {
		const db = await models.Order.updateMulti(ids, data);
		return {
			success: "success",
			data: db,
			message: "Orders updated successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error updating categories",
		};
	}
}

// connectUser
export async function connectUser(
	orderId: string,
	customerId: string,
	model: any,
	key: any,
) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db =
			model === "customer"
				? await models.Order.connectCustomerToOrder(orderId, customerId)
				: await models.Order.connectUserToOrder(orderId, customerId, key);
		return {
			success: "success",
			data: db,
			message: "User connected successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error connecting user",
		};
	}
}

// disconnectUser
export async function disconnectUser(
	orderId: string,
	customerId: string,
	model: any,
	key: any,
) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db =
			model === "customer"
				? await models.Order.disconnectCustomerFromOrder(orderId, customerId)
				: await models.Order.disconnectUserFromOrder(orderId, customerId, key);
		return {
			success: "success",
			data: db,
			message: "User disconnected successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error disconnecting user",
		};
	}
}

// searchAttributeMeta
export async function searchAttributeMeta(search: string, attributeId: string) {
	const session = await auth();
	const { id: userId, role } = session?.user || {};
	try {
		const db = await models.AttributeMeta.getAllAttributeMetaByKeyOrValue(
			search,
			Number(attributeId),
		);
		return {
			success: "success",
			data: db,
			message: "Attribute meta fetched successfully",
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error fetching attribute meta",
		};
	}
}
