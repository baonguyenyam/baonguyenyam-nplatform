import type { Metadata } from "next";

import { auth } from "@/auth";
import DefaultLayout from "@/components/site/default-layout";
import { appState, meta } from "@/lib/appConst";

import HomePage from "./(pages)/homepage/page";

export const metadata: Metadata = {
	...meta({
		title: "Home",
		description: "Welcome to the NextAuth.js example app",
		openGraph: {
			images: [`${appState.url}/imgs/opengraph/home.jpg`],
		},
	}),
};

export default async function Index() {
	const session = await auth();
	return (
		<DefaultLayout>
			<HomePage state={appState} session={session} />
		</DefaultLayout>
	);
}
