import { db } from "@/lib/db";

export const searchAll = async (query: any) => {
	const { take, skip, s, orderBy, filterBy, byCat, type } = query;
	try {
		const posts = await db.post.findMany({
			where: {
				OR: s
					? [
							{ title: { contains: s, mode: "insensitive" } },
							{ content: { contains: s, mode: "insensitive" } },
						]
					: undefined,
			},
			select: {
				id: true,
				title: true,
			},
		});
		const categories = await db.category.findMany({
			where: {
				OR: s
					? [
							{ title: { contains: s, mode: "insensitive" } },
							{ content: { contains: s, mode: "insensitive" } },
						]
					: undefined,
			},
			select: {
				id: true,
				title: true,
			},
		});
		const files = await db.file.findMany({
			where: {
				OR: s ? [{ name: { contains: s, mode: "insensitive" } }] : undefined,
			},
			select: {
				id: true,
				name: true,
			},
		});
		const users = await db.user.findMany({
			where: {
				OR: s
					? [
							{ name: { contains: s, mode: "insensitive" } },
							{ email: { contains: s, mode: "insensitive" } },
						]
					: undefined,
			},
			select: {
				id: true,
				name: true,
			},
		});

		const result_posts = posts.map((post) => ({
			id: post.id,
			title: post.title,
			type: "post",
		}));
		const result_categories = categories.map((category) => ({
			id: category.id,
			title: category.title,
			type: "category",
		}));
		const result_files = files.map((file) => ({
			id: file.id,
			title: file.name,
			type: "file",
		}));
		const result_users = users.map((user) => ({
			id: user.id,
			title: user.name,
			type: "user",
		}));

		const concatenatedResults = [
			...result_posts,
			...result_categories,
			...result_files,
			...result_users,
		];

		const sortedResults = concatenatedResults.sort((a, b) =>
			(a.title ?? "").localeCompare(b.title ?? ""),
		);
		const count =
			posts.length + categories.length + files.length + users.length;

		const returnedResults = sortedResults.slice(skip, skip + take);

		return { data: returnedResults, count };
	} catch (error) {
		return null;
	}
};
