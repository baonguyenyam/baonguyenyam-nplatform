"use client";

import { useCallback, useEffect, useState } from "react";

import { useAppSelector } from "@/store";
import { useAppDispatch } from "@/store";
import { setAttribute } from "@/store/attributeSlice";
import { setCategory } from "@/store/categoriesSlice";

import * as actions from "./actions";

export default function CheckAdminState() {
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	const memoriezAtts = useAppSelector((state) => state.attributeState.data);
	const memoriezCategories = useAppSelector((state) => state.categoriesState.data);

	const fetchData = useCallback(async () => {
		if (!memoriezAtts || !Array.isArray(memoriezAtts) || memoriezAtts.length === 0) {
			const _attribute = await actions.getAllAttributes();
			if (_attribute.success === "success") {
				dispatch(setAttribute(_attribute.data));
			}
		}
		if (!memoriezCategories || !Array.isArray(memoriezCategories) || memoriezCategories.length === 0) {
			const _categories = await actions.getAllCategories();
			if (_categories.success === "success") {
				dispatch(setCategory(_categories.data));
			}
		}
	}, [dispatch, memoriezAtts, memoriezCategories]);
	useEffect(() => {
		fetchData();
		console.log("CheckState Init");
	}, [fetchData]);

	return null;
}
