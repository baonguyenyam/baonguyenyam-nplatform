import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AppTitle from "@/components/AppTitle";
import { meta } from "@/lib/appConst";
import { permissionsCheck, rolesCheck } from "@/lib/utils";

import FormEdit from "./edit";

export const metadata: Metadata = {
	...meta({
		title: "Settings",
	}),
};

export default async function Index() {
	const session = await auth();

	const _role = session?.user?.role;
	const _permissions = session?.user?.permissions;
	const _acceptRole = ["ADMIN", "MODERATOR"];
	const _acceptPermissions = "settings";

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
