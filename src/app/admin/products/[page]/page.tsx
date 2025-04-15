import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Products",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Products | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Products",
			href: "/admin/products",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/products/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title="Products"
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</div>
	);
}
