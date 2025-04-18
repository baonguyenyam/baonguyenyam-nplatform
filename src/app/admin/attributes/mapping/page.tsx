import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AppTitle from "@/components/AppTitle";
import { meta } from "@/lib/appConst";

import View from "./view";

export const metadata: Metadata = {
	...meta({
		title: "Mapping",
	}),
};

export default async function Index() {
	const session = await auth();
	const acceptRole = ["ADMIN", "MODERATOR"];
	const checkRole = session?.user?.role;

	if (checkRole && !acceptRole.includes(checkRole)) {
		redirect("/admin/deny");
	}

	const breadcrumb = [
		{
			title: "Attributes",
			href: "/admin/attributes",
		},
		{
			title: "Mapping",
			href: "/admin/attributes/mapping",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6 relative h-full">
			<div className="space-y-3">
				<AppTitle
					data={metadata.title}
					breadcrumb={breadcrumb}
				/>
				<View />
			</div>
		</div>
	);
}
