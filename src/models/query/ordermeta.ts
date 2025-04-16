import { db } from "@/lib/db";

// Get OrderMeta by ID
export const getOrderMetaById = async (id: number) => {
	try {
		const orderMeta = await db.orderMeta.findUnique({
			where: {
				id,
			},
		});

		return orderMeta;
	} catch (error) {
		return null;
	}
};

// Get OrderMeta by OrderID
export const getOrderMetaByOrderID = async (orderId: string) => {
	try {
		const orderMeta = await db.orderMeta.findMany({
			where: {
				orderId,
			},
		});

		return orderMeta;
	} catch (error) {
		return null;
	}
};

// Get OrderMeta by Slug
export const getOrderMetaByKey = async (key: string) => {
	try {
		const orderMeta = await db.orderMeta.findFirst({
			where: {
				key,
			},
		});

		return orderMeta;
	} catch (error) {
		return null;
	}
};

// Create OrderMeta
export const createOrderMeta = async (values: any) => {
	const { orderId, data } = values;
	const res: any = [];
	try {
		for (let i = 0; i < data.length; i++) {
			// check if the key already exists
			const orderMeta = await db.orderMeta.findFirst({
				where: {
					orderId,
					key: data[i].key,
				},
			});
			if (orderMeta) {
				// update the orderMeta
				const updatedOrderMeta = await db.orderMeta.update({
					where: {
						id: orderMeta.id,
					},
					data: {
						value: data[i].value,
					},
				});
				res.push(updatedOrderMeta);
			}
			if (!orderMeta) {
				// create the orderMeta
				const createdOrderMeta = await db.orderMeta.create({
					data: {
						orderId,
						key: data[i].key,
						value: data[i].value,
					},
				});
				res.push(createdOrderMeta);
			}
		}
		return res;
	} catch (error) {
		return null;
	}
};

// delete orderMeta
export const deleteOrderMeta = async (id: number) => {
	try {
		const orderMeta = await db.orderMeta.delete({
			where: {
				id,
			},
		});
		return orderMeta;
	} catch (error) {
		return null;
	}
};

// update orderMeta
export const updateOrderMeta = async (id: number, data: any) => {
	try {
		const orderMeta = await db.orderMeta.update({
			where: {
				id,
			},
			data,
		});
		return orderMeta;
	} catch (error) {
		return null;
	}
};
