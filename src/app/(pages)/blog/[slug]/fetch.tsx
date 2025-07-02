"use client";

import { useCallback, useEffect, useState } from "react";

import AppLoading from "@/components/AppLoading";
import Blog from "@/components/public/Blog";
import BreadcrumbBar from "@/components/public/BreadcrumbBar";
import Title from "@/components/public/Title";

export default function Fetch(props: any) {
	const { title, data, breadcrumb, slug } = props;
	const [db, setDb] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		if (data) {
			setDb(data);
			setLoading(false);
		}
	}, [data]);

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
			{!loading && <Blog data={db} />}
		</>
	);
}
