import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { meta } from "@/lib/appConst";

import Fetch from "./[page]/fetch";
import { permissionsCheck, rolesCheck } from "@/lib/utils";

export const metadata: Metadata = {
	...meta({
		title: "Attributes",
	}),
};

export default async function Index() {
	const session = await auth();

	const _role = session?.user?.role;
	const _permissions = session?.user?.permissions;
	const _acceptRole = ["ADMIN", "MODERATOR"];
	const _acceptPermissions = "attributes";

	if (session?.user?.role !== "ADMIN") {
		if (_role && !rolesCheck(_role, _acceptRole)) {
			redirect("/admin/deny");
		}
		if (_permissions && !permissionsCheck(_permissions, _acceptPermissions)) {
			redirect("/admin/deny");
		}
	}

	const breadcrumb = [
		{
			title: "Attributes",
			href: "/admin/attributes",
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
