import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "My Account",
	}),
};

export default async function Index() {
	const session = await auth();
	const acceptRole = ["USER", "ADMIN", "MODERATOR"];
	const checkRole = session?.user?.role;

	if (checkRole && !acceptRole.includes(checkRole)) {
		redirect("/admin/deny");
	}

	const breadcrumb = [
		{
			title: "My Account",
			href: "/admin/account",
		},
	];

	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6 justify-center items-center flex-grow">
			<Fetch
				breadcrumb={breadcrumb}
				email={session?.user?.email}
			/>
		</div>
	);
}
