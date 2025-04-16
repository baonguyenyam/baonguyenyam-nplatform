import models from "@/models";

// Get Post
export async function GET(req: Request) {

	const params = req.url.split("/").pop();

	if (params) {
		const db = await models.Post.getPostBySlug(params);
		if (db) {
			return new Response(
				JSON.stringify({
					message: "Post fetched successfully",
					data: db,
					success: "success",
				}),
				{
					status: 200,
					headers: {
						"content-type": "application/json",
					},
				},
			);
		}
	}
	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
