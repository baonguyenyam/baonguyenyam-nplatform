import type { Metadata } from "next";

import DefaultLayout from "@/components/site/default-layout";
import { meta } from "@/lib/appConst";

import Fetch from "./[page]/fetch";

export const metadata: Metadata = {
	...meta({
		title: "Blogs",
	}),
};

export default async function Index() {
	const breadcrumb = [
		{
			title: "Blogs",
			href: "/blogs",
		},
	];

	return (
		<DefaultLayout>
			<Fetch
				title={metadata.title}
				breadcrumb={breadcrumb}
				page={1}
			/>
		</DefaultLayout>
	);
}
