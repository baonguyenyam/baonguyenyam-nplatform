import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signOut } from "@/auth";
import { appState, meta } from "@/lib/appConst";
import { DEFAULT_LOGOUT_REDIRECT, SIGNIN_ERROR_URL } from "@/routes";

import { Form } from "./form";

export const metadata: Metadata = {
	...meta({
		title: "Sign out",
		description: "Sign out of your account",
		openGraph: {
			images: [`${appState.url}/imgs/opengraph/signout.jpg`],
		},
	}),
};

export default function SignOutPage() {
	async function signOutFrm(formData: FormData) {
		"use server";
		try {
			await signOut({
				redirectTo: DEFAULT_LOGOUT_REDIRECT,
			});
		} catch (error) {
			if (error instanceof AuthError) {
				return redirect(`${SIGNIN_ERROR_URL}?error=WebAuthnVerificationError`);
			}
			throw error;
		}
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Form />
			</div>
		</div>
	);
}
