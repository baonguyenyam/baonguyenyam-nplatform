import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Fetch from "./fetch";

export const metadata: Metadata = {
	...meta({
		title: "Access Denied",
	}),
};

export default async function Index() {
	return (
		<div className="mx-auto flex-col flex py-5 w-full px-4 sm:px-6 justify-center items-center text-center h-full">
			<Fetch title="Access Denied" />
		</div>
	);
}
