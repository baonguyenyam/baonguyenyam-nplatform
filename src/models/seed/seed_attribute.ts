import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AttributeSeed = async () => {
	// Create 10 more attribute
	const Arr = ["Screen", "Tshirt"];
	const SubCategories = ["Screen Size", "Screen Color", "Screen Type"];
	const type = ["select", "select", "checkbox", "select"];
	const Sizes = ["S", "M", "L", "XL", "XXL"];
	const tshirt = ["Color", "Size", "Company", "Number"];
	const company = ["Bella + Canvas", "Gildan", "Hanes", "Next Level", "American Apparel"];
	const Colors = [
		{
			name: "Black",
			value: "#000000",
		},
		{
			name: "White",
			value: "#FFFFFF",
		},
		{
			name: "Red",
			value: "#FF0000",
		},
		{
			name: "Green",
			value: "#00FF00",
		},
		{
			name: "Blue",
			value: "#0000FF",
		},
	];
	const UserArr = ["Interest", "Demographic"];
	const UserCategories = ["Design", "IT", "Marketing", "Sales"];
	const UserType = ["text"];
	const UserDemographic = ["Sex", "Age", "Location", "Income", "Weight", "Height"];

	Arr.forEach(async (item) => {
		// check if the attribute already exists
		const existingAttribute = await prisma.attribute.findFirst({
			where: {
				title: item,
			},
		});
		if (existingAttribute) {
			return;
		} else {
			// create the attribute
			const getID = await prisma.attribute.create({
				data: {
					title: item,
					content: faker.lorem.paragraph(),
					createdAt: new Date(),
					mapto: "order",
					published: true,
				},
			});

			if (item === "Screen") {
				// Create Sub Categories
				for (let i = 0; i < SubCategories.length; i++) {
					const SubID = await prisma.attribute.create({
						data: {
							title: SubCategories[i],
							content: faker.lorem.paragraph(),
							createdAt: new Date(),
							childrenId: getID.id,
							type: type[i],
							published: true,
						},
					});
					if (SubCategories[i] === "Screen Size") {
						for (let i = 0; i < Sizes.length; i++) {
							await prisma.attributeMeta.create({
								data: {
									attributeId: SubID.id,
									value: Sizes[i],
									key: `Size` + i,
								},
							});
						}
					}
					if (SubCategories[i] === "Screen Color") {
						for (let i = 0; i < Colors.length; i++) {
							await prisma.attributeMeta.create({
								data: {
									attributeId: SubID.id,
									value: Colors[i].value,
									key: Colors[i].name,
								},
							});
						}
					}
					if (SubCategories[i] === "Screen Type") {
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: "LCD",
								key: `LCD screen`,
							},
						});
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: "LED",
								key: `LED lighting`,
							},
						});
					}
				}
			}

			if (item === "Tshirt") {
				// Create Sub Categories
				for (let i = 0; i < tshirt.length; i++) {
					const SubID = await prisma.attribute.create({
						data: {
							title: tshirt[i],
							content: faker.lorem.paragraph(),
							createdAt: new Date(),
							childrenId: getID.id,
							type: tshirt[i] === "Number" ? "text" : "select",
							published: true,
						},
					});
					if (tshirt[i] === "Color") {
						for (let i = 0; i < Colors.length; i++) {
							await prisma.attributeMeta.create({
								data: {
									attributeId: SubID.id,
									value: Colors[i].value,
									key: Colors[i].name,
								},
							});
						}
					}
					if (tshirt[i] === "Size") {
						for (let i = 0; i < Sizes.length; i++) {
							await prisma.attributeMeta.create({
								data: {
									attributeId: SubID.id,
									value: Sizes[i],
									key: `` + i,
								},
							});
						}
					}
					if (tshirt[i] === "Company") {
						for (let i = 0; i < company.length; i++) {
							await prisma.attributeMeta.create({
								data: {
									attributeId: SubID.id,
									value: company[i],
									key: `` + i,
								},
							});
						}
					}
				}
			}

		}
	});

	UserArr.forEach(async (item) => {
		// check if the attribute already exists
		const existingAttribute = await prisma.attribute.findFirst({
			where: {
				title: item,
			},
		});
		if (existingAttribute) {
			return;
		} else {
			// create the attribute
			const getID = await prisma.attribute.create({
				data: {
					title: item,
					content: faker.lorem.paragraph(),
					createdAt: new Date(),
					mapto: "user",
					published: true,
				},
			});

			if (item === "Interest") {
				for (let i = 0; i < UserCategories.length; i++) {
					const SubID = await prisma.attribute.create({
						data: {
							title: UserCategories[i],
							content: faker.lorem.paragraph(),
							createdAt: new Date(),
							childrenId: getID.id,
							type: UserType[i] ?? "text",
							published: true,
						},
					});
					if (UserCategories[i] === "Design") {
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: "Graphic Design",
								key: `Graphic Design`,
							},
						});
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: "Web Design",
								key: `Web Design`,
							},
						});
					}
					if (UserCategories[i] === "IT") {
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: "Software Development",
								key: `Software Development`,
							},
						});
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: "Hardware Development",
								key: `Hardware Development`,
							},
						});
					}
				}
			}
			if (item === "Demographic") {
				for (let i = 0; i < UserDemographic.length; i++) {
					const SubID = await prisma.attribute.create({
						data: {
							title: UserDemographic[i],
							content: faker.lorem.paragraph(),
							childrenId: getID.id,
							type: UserType[i] ?? "text",
							published: true,
						},
					});
				}
			}
		}
	});
};
