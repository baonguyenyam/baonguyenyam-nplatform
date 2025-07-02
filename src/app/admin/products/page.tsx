import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { meta } from "@/lib/appConst";
import { ACTIONS, createPermissionChecker, PERMISSION_LEVELS,RESOURCES } from "@/lib/permissions";

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

	// Create permission checker with enhanced system
	const userContext = {
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
		customPermissions: session.user.permissions ? JSON.parse(typeof session.user.permissions === "string" ? session.user.permissions : JSON.stringify(session.user.permissions || [])) : undefined,
	};

	const permissionChecker = createPermissionChecker(userContext);

	// Check if user has permission to read products
	if (!permissionChecker.hasPermission(RESOURCES.PRODUCTS, ACTIONS.READ, PERMISSION_LEVELS.READ)) {
		redirect("/admin/deny");
	}

	const breadcrumb = [
		{
			title: "Products",
			href: "/admin/products",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6">
			<Fetch
				title={metadata.title}
				breadcrumb={breadcrumb}
				page={1}
			/>
		</div>
	);
}
