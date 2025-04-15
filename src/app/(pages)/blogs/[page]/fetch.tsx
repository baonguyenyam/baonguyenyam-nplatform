"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AppLoading from "@/components/AppLoading";
import BlogLayout from "@/components/public/BlogLayout";
import BreadcrumbBar from "@/components/public/BreadcrumbBar";
import Title from "@/components/public/Title";
import { pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";

export default function Fetch(props: any) {
	const type = "post";
	const { title, page, breadcrumb } = props;
	const [db, setDb] = useState<any>([]);
	const [first, setFirst] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const pageSize = useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const query = useMemo(
		() => ({
			type,
			skip: pageSkip(page, pageSize) + 1,
		}),
		[pageSize, page],
	);

	const fetchData = useCallback(async () => {
		// get the first item
		const getFirst = await actions.getAll({ skip: query.skip - 1, take: 1, type, published: true });
		// get all items and leave the first one
		const res = await actions.getAll({ skip: query.skip, take: Number(pageSize), type, published: true });
		if (getFirst?.data) {
			setFirst(getFirst);
		}
		if (res?.data) {
			setDb(res);
			setLoading(false);
		}
	}, [pageSize, query.skip]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			<div className="mx-auto p-5 dark:bg-gray-800 dark:text-white w-full">
				<div className="my-5 flex flex-col justify-between items-center space-y-1">
					<Title
						data={title}
						breadcrumb={breadcrumb}
						className=""
					/>
					<BreadcrumbBar />
				</div>
			</div>
			<div className="px-5">{loading && <AppLoading />}</div>
			{!loading && (
				<BlogLayout
					first={first.data}
					data={db.data}
					count={db.count}
					url={`/blogs`}
					page={page}
					pageSize={pageSize}
				/>
			)}
		</>
	);
}
