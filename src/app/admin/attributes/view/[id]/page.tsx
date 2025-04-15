import type { Metadata } from "next";

import { meta } from "@/lib/appConst";
import models from "@/models";

import Fetch from "./[page]/fetch";

export const metadata: Metadata = {
	...meta({
		title: "Attributes",
	}),
};

export default async function Index({ params }: any) {
	const { id } = await params;
	let title = "";

	if (id) {
		const getAttribute = await models.Attribute.getAttributeById(Number(id));
		if (getAttribute) {
			metadata.title = `Attributes | ${getAttribute?.title}`;
			title = getAttribute?.title;
		}
	}

	const breadcrumb = [
		{
			title: "Attributes",
			href: "/admin/attributes",
		},
		{
			title: title || "Attribute",
			href: `/admin/attributes/view/${id}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title={title}
				breadcrumb={breadcrumb}
				id={id}
				page={1}
			/>
		</div>
	);
}
