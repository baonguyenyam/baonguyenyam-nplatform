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
	let subparent = {} as any;
	let parent = [] as any;

	if (id) {
		const getAttribute = await models.Attribute.getAttributeById(Number(id));
		const getParent = await models.Attribute.getAttributeById(Number(getAttribute?.childrenId));
		if (getParent) {
			parent = getParent;
		}
		if (getAttribute) {
			metadata.title = `Attributes | ${getAttribute?.title}`;
			subparent = getAttribute;
		}
	}
	const breadcrumb = [
		{
			title: "Attributes",
			href: "/admin/attributes",
		},
		{
			title: parent?.title || "Attribute",
			href: `/admin/attributes/view/${parent?.id}`,
		},
		{
			title: subparent?.title || "Attribute",
			href: `/admin/attributes/meta/${subparent?.id}`,
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				parent={parent}
				subparent={subparent}
				breadcrumb={breadcrumb}
				id={id}
				page={1}
			/>
		</div>
	);
}
