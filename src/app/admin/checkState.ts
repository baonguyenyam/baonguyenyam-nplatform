"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { appState } from "@/lib/appConst";
import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";
import { setAttribute } from "@/store/attributeSlice";
import { setCategory } from "@/store/categoriesSlice";

import * as actions from "./actions";

export default function CheckState() {
	const dispatch = useAppDispatch();
	const router = useRouter();
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
	};
	const atts = useAppSelector((state) => state?.attributeState.data);
	const categories = useAppSelector((state) => state?.categoriesState.data);
	const fetchData = useCallback(async () => {
		if (state?.pageSize === undefined) {
			const res = await actions.getAllSettings();
			if (res.success === "success") {
				console.log("res", res.data);
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
					}),
				);
			}
		}
		if (atts?.length == 0) {
			const _attribute = await actions.getAllAttributes();
			if (_attribute.success === "success") {
				dispatch(setAttribute(_attribute.data));
			}
		}
		if (categories?.length == 0) {
			const _categories = await actions.getAllCategories();
			if (_categories.success === "success") {
				dispatch(setCategory(_categories.data));
			}
		}
	}, [atts?.length, categories?.length, dispatch, state]);
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return null;
}
