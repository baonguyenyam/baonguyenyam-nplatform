import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Search",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Search | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Search",
			href: "/admin/search",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/search/${pageNumber}`,
		},
	];
	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch title="Search" breadcrumb={breadcrumb} page={pageNumber} />
		</div>
	);
}
