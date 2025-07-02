import type { Metadata } from "next";

import { PermissionChecker } from "@/lib/admin-route-protection";
import { meta } from "@/lib/appConst";
import { ACTIONS, RESOURCES } from "@/lib/permissions";

import Fetch from "./[page]/fetch";

export const metadata: Metadata = {
	...meta({
		title: "Pages",
	}),
};

export default async function Index() {
	await PermissionChecker.check(RESOURCES.PAGES, ACTIONS.READ);

	const breadcrumb = [
		{
			title: "Pages",
			href: "/admin/pages",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch title={metadata.title} breadcrumb={breadcrumb} page={1} />
		</div>
	);
}
