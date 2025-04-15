import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Orders",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Orders | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Orders",
			href: "/admin/orders",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/orders/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title="Orders"
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</div>
	);
}
