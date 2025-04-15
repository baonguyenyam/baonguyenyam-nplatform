import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

import DefaultLayout from "@/components/site/default-layout";
import { meta } from "@/lib/appConst";

import * as actions from "./actions";
import Fetch from "./fetch";

export async function generateMetadata({ params }: any, parent: ResolvingMetadata): Promise<Metadata> {
	const { slug } = await params;
	const data = await actions.getRecord(slug);
	const previousImages = (await parent).openGraph?.images || [];
	const metaData = data?.data;

	return {
		...meta({
			title: metaData?.title || "",
			description: metaData?.content || "",
			openGraph: {
				images: [metaData?.image || "", ...previousImages],
			},
		}),
	};
}

export default async function Index({ params }: any) {
	const { slug } = await params;
	const data = await actions.getRecord(slug);

	const breadcrumb = [
		{
			title: "Blogs",
			href: "/blogs",
		},
	];

	if (!data) {
		return redirect("/404");
	}

	if (data) {
		breadcrumb.push({
			title: data?.data?.title || "",
			href: `/blogs/${slug}`,
		});
	}

	return (
		<DefaultLayout>
			<Fetch
				title={data?.data?.title || ""}
				data={data?.data}
				slug={slug}
				breadcrumb={breadcrumb}
			/>
		</DefaultLayout>
	);
}
