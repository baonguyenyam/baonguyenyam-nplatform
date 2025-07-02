import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Posts",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Posts | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Posts",
			href: "/admin/posts",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/posts/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch title="Posts" breadcrumb={breadcrumb} page={pageNumber} />
		</div>
	);
}
