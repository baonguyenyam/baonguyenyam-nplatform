import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Files",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Files | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Files",
			href: "/admin/files",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/files/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title="Files"
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</div>
	);
}
