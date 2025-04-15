"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

import { useAppDispatch } from "@/store";
import { REMOVE_ACTIVE_USER } from "@/store/authSlice";

export default function SignOutSuccessPage() {
	const dispatch = useAppDispatch();
	dispatch(REMOVE_ACTIVE_USER());

	useEffect(() => {
		dispatch(REMOVE_ACTIVE_USER());
		redirect("/");
	}, [dispatch]);
}
