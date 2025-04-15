import type { Metadata } from "next";

import DefaultLayout from "@/components/site/default-layout";
import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Blogs",
	}),
};

export default async function Index({ params }: any) {
	const { page } = await params;
	const pageNumber = Number(page);
	metadata.title = `Blogs`;

	const breadcrumb = [
		{
			title: "Blogs",
			href: "/blogs",
		},
		{
			title: `Page ${pageNumber}`,
			href: `/blogs/${pageNumber}`,
		},
	];

	return (
		<DefaultLayout>
			<Fetch
				title={metadata.title}
				breadcrumb={breadcrumb}
				page={pageNumber}
			/>
		</DefaultLayout>
	);
}
