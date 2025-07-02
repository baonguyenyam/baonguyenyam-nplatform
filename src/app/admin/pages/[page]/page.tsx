import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Page",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Page | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Page",
			href: "/admin/pages",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/pages/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch title="Page" breadcrumb={breadcrumb} page={pageNumber} />
		</div>
	);
}
