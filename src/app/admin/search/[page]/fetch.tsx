"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import AppLoading from "@/components/AppLoading";
import AppPagination from "@/components/AppPagination";
import AppTitle from "@/components/AppTitle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";

export default function Fetch(props: any) {
	const { title, page, breadcrumb } = props;
	const router = useRouter();
	const [data, setData] = useState<any>([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const pageSize = useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const search = useSearchParams();
	const query = useMemo(
		() => ({
			take: Number(pageSize),
			skip: pageSkip(page, pageSize),
			s: search.get("s") || "",
			orderBy: search.get("orderBy") || "id",
			filterBy: search.get("filterBy") || "",
			cat: search.get("cat") || "",
		}),
		[pageSize, page, search],
	);

	const fetchData = useCallback(async () => {
		const res = await actions.getAll(query);
		if (res?.data) {
			setData(res.data);
			setCount(res.count);
			setLoading(false);
		}
	}, [query]);

	const buildLinks = (item: any) => {
		let type = item.type.toLowerCase();
		if (type === "category") {
			type = "categorie";
		} else if (type === "post") {
			type = item.search_type;
		}

		return (
			<div
				className="p-4 hover:bg-accent cursor-pointer block w-full dark:hover:bg-gray-900 cursor-pointer"
				onClick={() => {
					router.push(`/admin/${type}s?s=${item.search_name}`);
				}}>
				<div className="text-sm font-semibold">
					{item.search_name}{" "}
					<Badge
						variant="outline"
						className="dark:bg-gray-600 uppercase">
						{item.type.toLowerCase() !== "post" && (
							<>
								{item.type}
							</>
						)}
						{item.type.toLowerCase() === "post" && (
							<>
								{item.search_type}
							</>
						)}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground">{item.search_content}</p>
			</div>
		);
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			<div className="flex justify-between mb-5">
				<AppTitle
					data={title}
					breadcrumb={breadcrumb}
				/>
				<div className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="flex flex-col flex-end justify-around items-end">
						{data?.length > 0 && (
							<>
								<div className="text-sm font-medium">Item(s) Found</div>
								<div className="text-sm text-muted-foreground">{count} item(s)</div>
							</>
						)}
						{data?.length === 0 && <div className="text-sm font-medium">No Item Found</div>}
					</div>
				</div>
			</div>

			{loading && <AppLoading />}
			{!loading && (
				<>
					<div className="overflow-x-auto">
						{data?.length > 0 &&
							data.map((item: any, index: number) => (
								<div
									key={index}
									className="border-b last:border-b-0 dark:border-gray-700">
									{buildLinks(item)}
								</div>
							))}
					</div>
					<Separator className="my-4" />
					{data?.length > 0 && (
						<div className="flex justify-between items-center">
							<div className="flex justify-between items-center w-full">
								<div className="text-sm text-muted-foreground">
									Page {page} of {Math.ceil(count / pageSize)}
								</div>
								<div className="flex space-x-2">
									<AppPagination
										items={count}
										currentPage={page}
										pageSize={pageSize}
										url="/admin/search"
									/>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
