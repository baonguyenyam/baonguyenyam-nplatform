import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const PostSeed = async () => {
	const upload_path = "public/uploads";

	const randomcat = ["post", "product", "media", "order", "page"];

	for (let i = 0; i < 10; i++) {
		const category = await prisma.category.create({
			data: {
				title: `Category ` + faker.lorem.words(1),
				slug: faker.lorem.slug(),
				content: faker.lorem.paragraphs(5),
				type: randomcat[Math.floor(Math.random() * randomcat.length)],
				published: true,
			},
		});
	}

	for (let i = 0; i < 10; i++) {
		// select random user
		const users = await prisma.user.findMany({
			take: 10,
		});
		const randomIndex = Math.floor(Math.random() * users.length);
		const randomUser = users[randomIndex];

		// select random category
		const categories = await prisma.category.findMany({
			take: 10,
		});
		const randomIndexCategory = Math.floor(Math.random() * categories.length);
		const category = categories[randomIndexCategory];

		const randomIMG = faker.image.urlPicsumPhotos({
			width: 800,
			height: 600,
		});

		const image = await fetch(randomIMG);
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		const fileHash = createHash("sha256").update(randomIMG).digest("hex");
		const fileType = "image/jpeg";
		const fileSize = imageBuffer.length;
		const fileMimeType = fileType || "application/octet-stream";
		await writeFile(
			path.join(process.cwd(), upload_path, fileHash + ".jpg"),
			imageBuffer,
		);

		const fileDataToSave = {
			name: fileHash,
			hash: fileHash,
			userId: randomUser.id,
			type: fileMimeType,
			size: fileSize,
			ext: "jpg",
			published: true,
			url: "/uploads/" + fileHash + ".jpg",
		};

		const img = await prisma.file.create({ data: fileDataToSave });

		await prisma.post.create({
			data: {
				title: faker.lorem.sentence(),
				slug: faker.lorem.slug(),
				content: faker.lorem.paragraphs(5),
				userId: randomUser.id,
				image: "/uploads/" + fileHash + ".jpg",
				published: true,
				categories: {
					connect: {
						id: category.id,
					},
				},
				files: {
					connect: {
						id: img.id,
					},
				},
			},
		});
	}
};
