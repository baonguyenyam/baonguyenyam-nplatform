import type { Metadata } from "next";

import AppTitle from "@/components/AppTitle";
import { PermissionChecker } from "@/lib/admin-route-protection";
import { meta } from "@/lib/appConst";

import FormEdit from "./edit";

export const metadata: Metadata = {
	...meta({
		title: "Settings",
	}),
};

export default async function Index() {
	await PermissionChecker.check("settings", "read");

	const breadcrumb = [
		{
			title: "Settings",
			href: "/admin/settings",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6 relative h-full">
			<div className="space-y-3">
				<AppTitle
					data={metadata.title}
					breadcrumb={breadcrumb}
				/>
				<FormEdit />
			</div>
		</div>
	);
}
