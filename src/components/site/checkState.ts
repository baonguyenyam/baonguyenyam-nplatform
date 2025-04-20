"use client";

import { useCallback, useEffect, useState } from "react";

import { appState } from "@/lib/appConst";
import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";

import * as actions from "./actions";

export default function CheckState() {
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	const state = useAppSelector((state) => state.appState) as {
		pageSize?: number;
		title?: string;
		description?: string;
		image?: string;
		tax?: number;
		bill_note?: string;
		bill_company_name?: string;
		bill_company_address?: string;
		bill_company_info?: string;
		bill_company_phone?: string;
		order_permission?: string[];
	};
	const fetchData = useCallback(async () => {
		if (state?.pageSize === undefined) {
			const res = await actions.getAllSettings();
			if (res.success === "success") {
				dispatch(
					SET_APP_STATE({
						pageSize: res.data?.find((item: any) => item.key === "page")?.value ?? 10,
						title: res.data?.find((item: any) => item.key === "title")?.value ?? appState.appName,
						description: res.data?.find((item: any) => item.key === "description")?.value ?? appState.appDescription,
						image: res.data?.find((item: any) => item.key === "image")?.value ?? appState.placeholder,
						tax: res.data?.find((item: any) => item.key === "tax")?.value ?? 0,
						bill_note: res.data?.find((item: any) => item.key === "bill_note")?.value ?? "",
						bill_company_name: res.data?.find((item: any) => item.key === "bill_company_name")?.value ?? "",
						bill_company_address: res.data?.find((item: any) => item.key === "bill_company_address")?.value ?? "",
						bill_company_info: res.data?.find((item: any) => item.key === "bill_company_info")?.value ?? "",
						bill_company_phone: res.data?.find((item: any) => item.key === "bill_company_phone")?.value ?? "",
						order_permission: res.data?.find((item: any) => item.key === "order_permission")?.value
							? JSON.parse(res.data?.find((item: any) => item.key === "order_permission")?.value ?? "[]")
							: []
					}),
				);
			}
		}
	}, [dispatch, state]);
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return null;
}
