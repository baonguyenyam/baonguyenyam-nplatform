import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PermissionChecker } from "@/lib/admin-route-protection";
import { meta } from "@/lib/appConst";
import { ACTIONS, RESOURCES } from "@/lib/permissions";

import Fetch from "./[page]/fetch";

export const metadata: Metadata = {
	...meta({
		title: "Products",
	}),
};

export default async function Index() {
	const session = await auth();

	if (!session?.user) {
		redirect("/authentication/login");
	}

	await PermissionChecker.check(RESOURCES.PRODUCTS, ACTIONS.READ);

	const breadcrumb = [
		{
			title: "Products",
			href: "/admin/products",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch title={metadata.title} breadcrumb={breadcrumb} page={1} />
		</div>
	);
}
