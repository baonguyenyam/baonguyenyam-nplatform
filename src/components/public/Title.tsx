"use client";
import { useEffect, useMemo } from "react";

import { useAppDispatch } from "@/store";
import { setBreadcrumb } from "@/store/breadcrumbSlice";

export default function Title(props: any) {
	const title = props?.data;
	const breadcrumb = useMemo(() => props?.breadcrumb || [], [props?.breadcrumb]);
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState

	useEffect(() => {
		if (breadcrumb?.length > 0) {
			dispatch(setBreadcrumb(breadcrumb));
		} else {
			dispatch(setBreadcrumb([]));
		}
	}, [breadcrumb, dispatch]);

	return <h1 className={`${props?.className || ""} text-3xl font-bold`}>{title}</h1>;
}
