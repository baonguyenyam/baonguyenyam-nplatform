import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CustomerSeed = async () => {
	const customer = await prisma.customer.findFirst({
		where: {
			email: "baonguyenyam@gmail.com",
		},
	});
	// Create 10 more customers
	for (let i = 0; i < 10; i++) {
		await prisma.customer.create({
			data: {
				email: faker.internet.email(),
				name: faker.person.fullName(),
				phone: faker.phone.number(),
				first_name: faker.person.firstName(),
				emailVerified: new Date(),
				last_name: faker.person.lastName(),
				address: faker.location.streetAddress(),
				city: faker.location.city(),
				state: faker.location.state({ abbreviated: true }),
				zip: faker.location.zipCode(),
				country: faker.location.country(),
				avatar: faker.image.avatar(),
				published: true,
			},
		});
	}
	for (let i = 0; i < 10; i++) {
		await prisma.customer.create({
			data: {
				email: faker.internet.email(),
				name: faker.person.fullName(),
				phone: faker.phone.number(),
				first_name: faker.person.firstName(),
				emailVerified: new Date(),
				last_name: faker.person.lastName(),
				address: faker.location.streetAddress(),
				city: faker.location.city(),
				state: faker.location.state({ abbreviated: true }),
				zip: faker.location.zipCode(),
				country: faker.location.country(),
				avatar: faker.image.avatar(),
				type: "vendor",
				published: true,
			},
		});
	}
};
