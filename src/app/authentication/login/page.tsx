import type { Metadata } from "next";

import { appState, meta } from "@/lib/appConst";

import { Form } from "./form";

export const metadata: Metadata = {
	...meta({
		title: "Sign In",
		description: "Sign in to your account",
		openGraph: {
			images: [`${appState.url}/imgs/opengraph/signin.jpg`],
		},
	}),
};

export default async function SignInPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Form />
			</div>
		</div>
	);
}
