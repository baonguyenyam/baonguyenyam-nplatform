import { db } from "@/lib/db";

// Get Order by ID
export const getOrderById = async (id: string) => {
	try {
		const order = await db.order.findUnique({
			where: {
				id,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				user_product: {
					select: {
						id: true,
						name: true,
					},
				},
				user_delivery: {
					select: {
						id: true,
						name: true,
					},
				},
				user_manager: {
					select: {
						id: true,
						name: true,
					},
				},
				user_quality: {
					select: {
						id: true,
						name: true,
					},
				},
				user_designer: {
					select: {
						id: true,
						name: true,
					},
				},
				user_financial: {
					select: {
						id: true,
						name: true,
					},
				},
				user_technical: {
					select: {
						id: true,
						name: true,
					},
				},
				user_packaging: {
					select: {
						id: true,
						name: true,
					},
				},
				categories: {
					select: {
						id: true,
						title: true,
					},
				},
				files: {
					select: {
						id: true,
						name: true,
						url: true,
					},
				},
				meta: {
					select: {
						key: true,
						value: true,
					},
				},
				customer: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						address: true,
						city: true,
						state: true,
						zip: true,
						country: true,
					},
				},
				vendor: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						address: true,
						city: true,
						state: true,
						zip: true,
						country: true,
					},
				},
			},
		});

		return order;
	} catch (error) {
		return null;
	}
};

// Create Order
export const createOrder = async (data: any) => {
	try {
		const order = await db.order.create({
			data,
		});
		return order;
	} catch (error) {
		return null;
	}
};

// get all orders
export const getAllOrders = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, published } = query;
	try {
		const orders = await db.order.findMany({
			take: take ? take : undefined,
			skip: skip ? skip : undefined,
			where: {
				published: published ? published : undefined,
				OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
			},
			select: {
				id: true,
				createdAt: true,
				title: true,
				image: true,
				published: true,
				status: true,
				categories: {
					select: {
						id: true,
						title: true,
					},
				},
				meta: {
					select: {
						key: true,
						value: true,
					},
				},
				customer: {
					select: {
						id: true,
						name: true,
					},
				},
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				user_product: {
					select: {
						id: true,
						name: true,
					},
				},
				user_delivery: {
					select: {
						id: true,
						name: true,
					},
				},
				user_manager: {
					select: {
						id: true,
						name: true,
					},
				},
				user_quality: {
					select: {
						id: true,
						name: true,
					},
				},
				user_designer: {
					select: {
						id: true,
						name: true,
					},
				},
				user_financial: {
					select: {
						id: true,
						name: true,
					},
				},
				user_technical: {
					select: {
						id: true,
						name: true,
					},
				},
				user_packaging: {
					select: {
						id: true,
						name: true,
					},
				},
				vendor: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						address: true,
						city: true,
						state: true,
						zip: true,
						country: true,
					},
				},
				date_created: true,
				date_production: true,
				date_paid: true,
				date_shipped: true,
				date_delivered: true,
				date_completed: true,
				date_cancelled: true,
				date_refunded: true,
				date_failed: true,
				date_closed: true,
				date_approved: true,
			},

			orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
		});
		return orders;
	} catch (error) {
		return null;
	}
};

// get all orders count
export const getOrdersCount = async (query: any) => {
	const { s, byCat, filterBy, published } = query;
	try {
		const count = await db.order.count({
			where: {
				published: published ? published : undefined,
				OR: s ? [{ title: { contains: s, mode: "insensitive" } }, { content: { contains: s, mode: "insensitive" } }] : undefined,
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// delete order
export const deleteOrder = async (id: string) => {
	try {
		const order = await db.order.delete({
			where: {
				id,
			},
		});
		return order;
	} catch (error) {
		return null;
	}
};

// update order
export const updateOrder = async (id: string, data: any) => {
	try {
		const order = await db.order.update({
			where: {
				id,
			},
			data,
		});
		return order;
	} catch (error) {
		return null;
	}
};

// Disconnect customer from order
export const disconnectCustomerFromOrder = async (orderId: string, customerId: string) => {
	try {
		const order = await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				customer: {
					disconnect: {
						id: customerId,
					},
				},
			},
		});
		return order;
	} catch (error) {
		return null;
	}
};

// Connect customer to order
export const connectCustomerToOrder = async (orderId: string, customerId: string) => {
	try {
		const order = await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				customer: {
					connect: {
						id: customerId,
					},
				},
			},
		});
		return order;
	} catch (error) {
		return null;
	}
};

// Disconnect user from order
export const disconnectUserFromOrder = async (orderId: string, userId: string, table?: any) => {
	try {
		const order = await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				...(table ? { [table]: { disconnect: { id: userId } } } : {}),
			},
		});
		return order;
	} catch (error) {
		return null;
	}
};

// Connect user to order
export const connectUserToOrder = async (orderId: string, userId: string, table: any) => {
	try {
		const order = await db.order.update({
			where: {
				id: orderId,
			},
			data: {
				...(table ? { [table]: { connect: { id: userId } } } : {}),
			},
		});
		return order;
	} catch (error) {
		return null;
	}
};

// Delete multiple orders
export const deleteMulti = async (ids: string[]) => {
	try {
		const orders = await db.order.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return orders;
	} catch (error) {
		return null;
	}
};

// Update multiple orders
export const updateMulti = async (ids: string[], data: any) => {
	try {
		const orders = await db.order.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data,
		});
		return orders;
	} catch (error) {
		return null;
	}
};
