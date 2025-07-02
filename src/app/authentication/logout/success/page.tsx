"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";

import { useAppDispatch } from "@/store";
import { removeActiveUser } from "@/store/authSlice";

export default function SignOutSuccessPage() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		// Clear Redux auth state
		dispatch(removeActiveUser());
		
		// Also clear NextAuth session
		signOut({ redirect: false }).then(() => {
			redirect("/");
		});
	}, [dispatch]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Signing out...</h1>
				<p className="text-gray-600">Please wait while we sign you out.</p>
			</div>
		</div>
	);
}
