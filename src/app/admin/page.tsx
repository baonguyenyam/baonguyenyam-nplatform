import type { Metadata } from "next";

import { meta } from "@/lib/appConst";

import Dashboard from "./dashboard/page";

export const metadata: Metadata = {
	...meta({
		title: "Dashboard",
	}),
};

export default async function Index() {
	return <Dashboard />;
}
