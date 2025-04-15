import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Users",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Users | Page ${pageNumber}`;

	const breadcrumb = [
		{
			title: "Users",
			href: "/admin/users",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/admin/users/${pageNumber}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title="Users"
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</div>
	);
}
