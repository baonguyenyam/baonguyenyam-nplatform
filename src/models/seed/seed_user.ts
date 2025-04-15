import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserSeed = async () => {
	const user = await prisma.user.findFirst({
		where: {
			email: "baonguyenyam@gmail.com",
		},
	});
	if (!user) {
		await prisma.user.create({
			data: {
				email: "baonguyenyam@gmail.com",
				name: `Nguyen Pham`,
				phone: "682 203 1334",
				first_name: "Nguyen",
				emailVerified: new Date(),
				last_name: "Pham",
				address: "2900 Questa St",
				city: "Fort Worth",
				state: "TX",
				zip: "76119",
				country: "United States",
				avatar: "https://gravatar.com/avatar/c117ad54bfae426e74c0b69f49b213156477c0f43eb73e063758c35b991075a4",
				role: "ADMIN",
				published: true,
			},
		});
		await prisma.user.create({
			data: {
				email: "demo@gmail.com",
				name: `Demo Admin`,
				phone: "123 456 789",
				first_name: "Demo",
				emailVerified: new Date(),
				last_name: "Admin",
				address: faker.location.streetAddress(),
				city: faker.location.city(),
				state: faker.location.state({ abbreviated: true }),
				zip: faker.location.zipCode(),
				country: faker.location.country(),
				avatar: faker.image.avatar(),
				role: "ADMIN",
				published: true,
			},
		});
	}
	// Create 10 more users
	for (let i = 0; i < 10; i++) {
		await prisma.user.create({
			data: {
				email: faker.internet.email().toLowerCase(),
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
				role: "USER",
				published: false,
			},
		});
	}
};
