import { db } from "@/lib/db";

// Get PostMeta by ID
export const getPostMetaById = async (id: number) => {
	try {
		const postMeta = await db.postMeta.findUnique({
			where: {
				id,
			},
		});

		return postMeta;
	} catch (error) {
		return null;
	}
};

// Get PostMeta by PostID
export const getPostMetaByPostID = async (postId: number) => {
	try {
		const postMeta = await db.postMeta.findMany({
			where: {
				postId,
			},
		});

		return postMeta;
	} catch (error) {
		return null;
	}
};

// Get PostMeta by Slug
export const getPostMetaByKey = async (key: string) => {
	try {
		const postMeta = await db.postMeta.findFirst({
			where: {
				key,
			},
		});

		return postMeta;
	} catch (error) {
		return null;
	}
};

// Create PostMeta
export const createPostMeta = async (values: any) => {
	const { postId, data } = values;
	const res: any = [];
	try {
		for (let i = 0; i < data.length; i++) {
			// check if the key already exists
			const postMeta = await db.postMeta.findFirst({
				where: {
					postId,
					key: data[i].key,
				},
			});
			if (postMeta) {
				// update the postMeta
				const updatedPostMeta = await db.postMeta.update({
					where: {
						id: postMeta.id,
					},
					data: {
						value: data[i].value,
					},
				});
				res.push(updatedPostMeta);
			}
			if (!postMeta) {
				// create the postMeta
				const createdPostMeta = await db.postMeta.create({
					data: {
						postId,
						key: data[i].key,
						value: data[i].value,
					},
				});
				res.push(createdPostMeta);
			}
		}
		return res;
	} catch (error) {
		return null;
	}
};

// delete postMeta
export const deletePostMeta = async (id: number) => {
	try {
		const postMeta = await db.postMeta.delete({
			where: {
				id,
			},
		});
		return postMeta;
	} catch (error) {
		return null;
	}
};

// update postMeta
export const updatePostMeta = async (id: number, data: any) => {
	try {
		const postMeta = await db.postMeta.update({
			where: {
				id,
			},
			data,
		});
		return postMeta;
	} catch (error) {
		return null;
	}
};
