import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Vendors",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Vendors | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Vendors",
			href: "/admin/vendors",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/vendors/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title="Vendors"
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</div>
	);
}
