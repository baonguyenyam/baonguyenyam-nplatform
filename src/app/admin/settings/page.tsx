import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AppTitle from "@/components/AppTitle";
import { meta } from "@/lib/appConst";

import FormEdit from "./edit";

export const metadata: Metadata = {
	...meta({
		title: "Settings",
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
			title: "Settings",
			href: "/admin/settings",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
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
