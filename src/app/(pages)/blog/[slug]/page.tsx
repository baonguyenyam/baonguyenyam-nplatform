import { cache } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

import DefaultLayout from "@/components/site/default-layout";
import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

// Call the API to get the data
const getItem = cache(async (slug: string) => {
	const public_APIUrl = process.env.public_APIUrl;
	const res = await fetch(`${public_APIUrl}/public/posts/${slug}`);
	return res.json();
});

// Generate metadata for the page
export async function generateMetadata({ params }: any, parent: ResolvingMetadata): Promise<Metadata> {
	const { slug } = await params;
	const data = await getItem(slug);
	const previousImages = (await parent).openGraph?.images || [];
	const metaData = data?.data;

	return {
		...meta({
			title: metaData?.title || "",
			description: metaData?.content || "",
			openGraph: {
				images: [metaData?.image || "", ...previousImages],
			},
		}),
	};
}

// Generate static params for the page
export default async function Index({ params }: any) {
	const { slug } = await params;
	const data = await getItem(slug);
	const breadcrumb = [
		{
			title: "Blogs",
			href: "/blogs",
		},
	];

	if (!data) {
		return redirect("/404");
	}

	if (data) {
		breadcrumb.push({
			title: data?.data?.title || "",
			href: `/blogs/${slug}`,
		});
	}

	return (
		<DefaultLayout>
			<Fetch
				title={data?.data?.title || ""}
				data={data?.data}
				slug={slug}
				breadcrumb={breadcrumb}
			/>
		</DefaultLayout>
	);
}
