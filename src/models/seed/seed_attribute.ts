import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AttributeSeed = async () => {
	// Create 10 more attribute
	const Arr = ["Screen", "Tshirt"];
	const SubCategories = ["Screen Size", "Screen Color", "Screen Type"];
	const SizesScreen = ["1900x1200", "2560x1600", "3840x2160", "5120x2880"];
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
	const UserArr = ["Interest", "Demographic", "Job", "Education"];
	const Job = ["Software Engineer", "Data Scientist", "Product Manager", "Designer", "Marketing"];
	const Education = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];
	const UserDemographic = ["Sex", "Age", "Location", "Income", "Weight", "Height"];
	const sex = ["Male", "Female"];

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
							type: "select",
							published: true,
						},
					});
					if (SubCategories[i] === "Screen Size") {
						for (let i = 0; i < SizesScreen.length; i++) {
							await prisma.attributeMeta.create({
								data: {
									attributeId: SubID.id,
									value: SizesScreen[i],
									key: SizesScreen[i],
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
							type: tshirt[i] === "Number" ? "text" : tshirt[i] === "Color" ? "checkbox" : "select",
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
									key: Sizes[i],
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
									key: company[i],
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
				const SubID = await prisma.attribute.create({
					data: {
						title: "Interest",
						content: faker.lorem.paragraph(),
						createdAt: new Date(),
						childrenId: getID.id,
						type: "checkbox",
						published: true,
					},
				});
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
			if (item === "Demographic") {
				for (let i = 0; i < UserDemographic.length; i++) {
					const SubID = await prisma.attribute.create({
						data: {
							title: UserDemographic[i],
							content: faker.lorem.paragraph(),
							childrenId: getID.id,
							type: UserDemographic[i] === "Sex" ? "select" : "text",
							published: true,
						},
					});
				}
				// Add Male, Female to Sex
				const SubID = await prisma.attribute.findFirst({
					where: {
						title: "Sex",
					},
				});
				if (SubID) {
					for (let i = 0; i < sex.length; i++) {
						await prisma.attributeMeta.create({
							data: {
								attributeId: SubID.id,
								value: sex[i],
								key: sex[i],
							},
						});
					}
				}
			}
			if (item === "Job") {
				const SubID = await prisma.attribute.create({
					data: {
						title: "Work",
						content: faker.lorem.paragraph(),
						childrenId: getID.id,
						type: "select",
						published: true,
					},
				});
				for (let i = 0; i < Job.length; i++) {
					await prisma.attributeMeta.create({
						data: {
							attributeId: SubID.id,
							value: Job[i],
							key: Job[i],
						},
					});
				}
			}
			if (item === "Education") {
				const SubID = await prisma.attribute.create({
					data: {
						title: "Grade",
						content: faker.lorem.paragraph(),
						childrenId: getID.id,
						type: "select",
						published: true,
					},
				});
				for (let i = 0; i < Education.length; i++) {
					await prisma.attributeMeta.create({
						data: {
							attributeId: SubID.id,
							value: Education[i],
							key: Education[i],
						},
					});
				}
			}
		}
	});

	const PostAtt = ["Author", "Source"];
	const PostAttList = ["Author List", "Copyright"];
	const PostType = ["checkbox", "text"];
	const PostAuthor = ["John Doe", "Jane Doe", "Mark Smith", "Mary Jane"];

	PostAtt.forEach(async (item) => {
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
					mapto: "post",
					published: true,
				},
			});

			// IF author => add author list then add post author to author list
			if (item === "Author") {
				const SubID = await prisma.attribute.create({
					data: {
						title: PostAttList[0],
						content: faker.lorem.paragraph(),
						childrenId: getID.id,
						type: PostType[0],
						published: true,
					},
				});
				for (let i = 0; i < PostAuthor.length; i++) {
					await prisma.attributeMeta.create({
						data: {
							attributeId: SubID.id,
							value: PostAuthor[i],
							key: PostAuthor[i],
						},
					});
				}
			}

			// IF source => add copyright
			if (item === "Source") {
				await prisma.attribute.create({
					data: {
						title: PostAttList[1],
						content: faker.lorem.paragraph(),
						childrenId: getID.id,
						type: PostType[1],
						published: true,
					},
				});
			}
		}
	});
};
