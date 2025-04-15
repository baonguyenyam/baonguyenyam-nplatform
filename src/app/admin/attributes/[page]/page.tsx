import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Attributes",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Attributes | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Attributes",
			href: "/admin/attributes",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/attributes/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title="Attributes"
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</div>
	);
}
