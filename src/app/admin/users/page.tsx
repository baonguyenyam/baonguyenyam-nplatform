import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PermissionChecker } from "@/lib/admin-route-protection";
import { meta } from "@/lib/appConst";
import { ACTIONS, RESOURCES } from "@/lib/permissions";

import Fetch from "./[page]/fetch";

export const metadata: Metadata = {
	...meta({
		title: "Users",
	}),
};

export default async function Index() {
	const session = await auth();

	if (!session?.user) {
		redirect("/authentication/login");
	}

	await PermissionChecker.check(RESOURCES.USERS, ACTIONS.READ);

	const breadcrumb = [
		{
			title: "Users",
			href: "/admin/users",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch title={metadata.title} breadcrumb={breadcrumb} page={1} />
		</div>
	);
}
