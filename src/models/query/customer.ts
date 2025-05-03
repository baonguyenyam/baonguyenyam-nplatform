import { db } from "@/lib/db";

// Get Customer by Email
export const getCustomerByEmail = async (email: string) => {
	try {
		const customer = await db.customer.findFirst({
			where: {
				email,
			},
		});

		return customer;
	} catch (error) {
		return null;
	}
};

// Get Customer by ID
export const getCustomerById = async (id: string) => {
	try {
		const customer = await db.customer.findUnique({
			where: {
				id,
			},
		});

		return customer;
	} catch (error) {
		return null;
	}
};

// Create Customer
export const createCustomer = async (data: any) => {
	try {
		const customer = await db.customer.create({
			data,
		});
		return customer;
	} catch (error) {
		return null;
	}
};

// get all customers
export const getAllCustomers = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type, published } = query;
	try {
		const customers = await db.customer.findMany({
			take: take ? take : undefined,
			skip: skip ? skip : undefined,
			where: {
				published: published ? published : undefined,
				type: type ? type : filterBy ? filterBy : undefined,
				OR: [{ email: { contains: s, mode: "insensitive" } }, { name: { contains: s, mode: "insensitive" } }],
			},
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
				avatar: true,
				emailVerified: true,
				createdAt: true,
				address: true,
				phone: true,
				city: true,
				country: true,
				zip: true,
				company: true,
				state: true,
				published: true,
			},

			orderBy: orderBy ? { [orderBy]: "desc" } : { createdAt: "desc" },
		});
		return customers;
	} catch (error) {
		return null;
	}
};

// get all customers count
export const getCustomersCount = async (query: any) => {
	const { s, byCat, type, filterBy, published } = query;
	try {
		const count = await db.customer.count({
			where: {
				published: published ? published : undefined,
				type: type ? type : filterBy ? filterBy : undefined,
				OR: [{ email: { contains: s, mode: "insensitive" } }, { name: { contains: s, mode: "insensitive" } }],
			},
		});
		return count;
	} catch (error) {
		return null;
	}
};

// delete customer
export const deleteCustomer = async (id: string) => {
	try {
		const customer = await db.customer.delete({
			where: {
				id,
			},
		});
		return customer;
	} catch (error) {
		return null;
	}
};

// update customer
export const updateCustomer = async (id: string, data: any) => {
	try {
		const customer = await db.customer.update({
			where: {
				id,
			},
			data,
		});
		return customer;
	} catch (error) {
		return null;
	}
};

// delete multiple customers
export const deleteMulti = async (ids: string[]) => {
	try {
		const customers = await db.customer.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return customers;
	} catch (error) {
		return null;
	}
};

// Update multiple customers
export const updateMulti = async (ids: string[], data: any) => {
	try {
		const customers = await db.customer.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data,
		});
		return customers;
	} catch (error) {
		return null;
	}
};
