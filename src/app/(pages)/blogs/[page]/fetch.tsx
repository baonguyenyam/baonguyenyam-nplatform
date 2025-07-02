"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cache } from "react";

import AppLoading from "@/components/AppLoading";
import BlogLayout from "@/components/public/BlogLayout";
import BreadcrumbBar from "@/components/public/BreadcrumbBar";
import Title from "@/components/public/Title";
import { pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

export default function Fetch(props: any) {
	const type = "post";
	const { title, page, breadcrumb } = props;
	const [db, setDb] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const pageSize =
		useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const query = useMemo(
		() => ({
			type,
			skip: pageSkip(page, Number(pageSize) + 1),
		}),
		[pageSize, page],
	);

	const fetchData = useCallback(async () => {
		const public_APIUrl = process.env.public_APIUrl;
		// get all items and leave the first one
		const getAll = cache(async () => {
			const res = await fetch(
				`${public_APIUrl}/public/posts?skip=${query.skip}&take=${Number(pageSize) + 1}`,
			).then((res) => res.json());
			return res;
		});
		const resResult = await getAll();
		if (resResult?.data) {
			setDb(resResult);
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
					<Title data={title} breadcrumb={breadcrumb} className="" />
					<BreadcrumbBar />
				</div>
			</div>
			{loading && (
				<div className="flex h-screen w-full p-5">
					<AppLoading />
				</div>
			)}
			{!loading && (
				<BlogLayout
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
