import models from "@/models";

// get all posts
export async function GET(req: Request) {
	// QUERY PARAMS
	const query = {
		s: new URL(req.url).searchParams.get("s") || "",
		skip: parseInt(new URL(req.url).searchParams.get("skip") ?? "0"),
		take: parseInt(new URL(req.url).searchParams.get("take") ?? "10"),
		orderBy: new URL(req.url).searchParams.get("orderBy") || "createdAt",
		filterBy: new URL(req.url).searchParams.get("filterBy") || "",
		byCat: new URL(req.url).searchParams.get("cat") || "all",
		type: "post",
		published: true,
	};

	const count = await models.Post.getPostsCount(query);
	const db = await models.Post.getAllPosts(query);

	return new Response(
		JSON.stringify({
			message: "Data fetched successfully",
			data: db,
			count: count,
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
