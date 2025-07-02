"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { CircleCheck, Pencil, Plus, Trash, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import AppLoading from "@/components/AppLoading";
import AppTable from "@/components/AppTable";
import AppTitle from "@/components/AppTitle";
import { Button } from "@/components/ui/button";
import initSupabase from "@/lib/supabase";
import { pageSkip } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { deleteAttribute, setAttribute } from "@/store/attributeSlice";

import * as actions from "./actions";
import FormEdit from "./edit";

export default function Fetch(props: any) {
	const { title, page, breadcrumb } = props;
	const router = useRouter();
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	const [open, setOpen] = useState<any>(["", null]);
	const [db, setDb] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const pageSize =
		useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const search = useSearchParams();
	const query = useMemo(
		() => ({
			take: Number(pageSize),
			skip: pageSkip(page, pageSize),
			s: search.get("s") || "",
			orderBy: search.get("orderBy") || "id",
			filterBy: search.get("filterBy") || "",
			cat: search.get("cat") || "",
			parent: search.get("parent") || "",
		}),
		[pageSize, page, search],
	);

	const fetchData = useCallback(async () => {
		const all = await actions.getAll({ min: true, published: true });
		const res = await actions.getAll(query);
		if (res?.data) {
			setDb(res);
			setLoading(false);
		}
		if (all?.data) {
			dispatch(setAttribute(all?.data));
		}
	}, [dispatch, query]);

	const deteteRecord = async (id: string) => {
		if (confirm("Are you sure you want to delete this record?")) {
			const res = await actions.deleteRecord(id);
			if (res?.success === "success") {
				dispatch(deleteAttribute(id));
				fetchData();
			}
		}
	};

	useEffect(() => {
		fetchData();
		initSupabase({
			table: "Attribute",
			fetchData,
		});
	}, [fetchData]);

	return (
		<>
			<div className="flex justify-between mb-5">
				<AppTitle data={title} breadcrumb={breadcrumb} />
				<Button onClick={() => setOpen(["create", null])}>
					<Plus />
					Create {title}
				</Button>
			</div>

			{loading && <AppLoading />}
			{!loading && (
				<AppTable
					actions={actions}
					data={db.data}
					count={db.count}
					url={`/admin/attributes`}
					page={page}
					pageSize={pageSize}
					onChange={(event: string, data: any) => {
						if (event === "edit") {
							setOpen([event, data]);
						}
						if (event === "delete") {
							fetchData();
						}
					}}
					columns={[
						{
							header: "Title",
							accessor: "title",
							custom: (row: any) => {
								return (
									<>
										<div className="flex items-center space-x-1">
											{row.published ? (
												<span className="text-green-800 font-semibold">
													<CircleCheck className="w-4 h-4" />
												</span>
											) : (
												<span className="text-red-800 font-semibold">
													<X className="w-4 h-4" />
												</span>
											)}
											<span
												className="whitespace-nowrap truncate overflow-ellipsis max-w-xs cursor-pointer underline"
												onClick={() =>
													router.push(`/admin/attributes/view/${row.id}`)
												}
											>
												{row.title}
											</span>
										</div>
									</>
								);
							},
						},
						{
							header: "Map to",
							accessor: "mapto",
							custom: (row: any) => {
								return (
									<div className="flex items-center space-x-2">
										<span className="text-sm uppercase font-semibold">
											{row?.mapto}
										</span>
									</div>
								);
							},
						},
						{
							header: "Order",
							accessor: "order",
							custom: (row: any) => {
								return (
									<div className="flex items-center space-x-2">
										<span className="text-sm">{row?.order}</span>
									</div>
								);
							},
						},
						{
							header: "Childrens",
							accessor: "childrens",
							custom: (row: any) => {
								return (
									<div className="flex items-center space-x-2">
										<span className="text-sm">{row?._count?.children}</span>
									</div>
								);
							},
						},
						{
							header: "Edit",
							accessor: "edit",
							custom: (row: any) => {
								return (
									<Button
										size="icon"
										className="hover:bg-gray-900 bg-gray-100 text-sm inline-flex flex-row items-center w-7 h-7 justify-center text-black border border-gray-400 rounded-md hover:text-white hover:border-black"
										onClick={() => setOpen(["edit", row])}
									>
										<Pencil />
									</Button>
								);
							},
						},
					]}
					order={[
						{
							value: "createdAt",
							label: "Order by Date",
						},
						{
							value: "title",
							label: "Order by Title",
						},
					]}
				/>
			)}
			<Drawer
				title={`Create ${title}`}
				placement="right"
				closable={false}
				onClose={() => setOpen(["", null])}
				open={open[0] === "create"}
				destroyOnClose={true}
				width={1200}
				maskClosable={false}
				extra={
					<Button
						type="button"
						onClick={() => setOpen(["", null])}
						className="hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 w-8 h-8 bg-gray-200 font-medium text-black border-2 border-gray-400 rounded-lg"
					>
						<X />
					</Button>
				}
			>
				<FormEdit
					onChange={(event: string, data: any) => {
						if (event === "submit") {
							setOpen(["", null]);
							fetchData();
						}
					}}
				/>
			</Drawer>
			<Drawer
				maskClosable={false}
				closable={false}
				open={open[0] === "edit"}
				onClose={() => setOpen(["", null])}
				title={`Edit ${title}`}
				placement="right"
				width={1200}
				destroyOnClose={true}
				extra={
					<div className="flex items-center space-x-2">
						<Button
							type="button"
							className="hover:bg-red-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-red-800 px-2 h-8 bg-red-200 font-medium hover:text-black text-black border-2 border-red-400 rounded-lg"
							onClick={() => {
								deteteRecord(open[1]?.id);
								setOpen(["", open[1]]);
							}}
						>
							<Trash /> Delete
						</Button>
						<Button
							type="button"
							className="hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 w-8 h-8 bg-gray-200 font-medium text-black border-2 border-gray-400 rounded-lg"
							onClick={() => setOpen(["", null])}
						>
							<X />
						</Button>
					</div>
				}
			>
				<FormEdit
					id={open[1]?.id}
					onChange={(event: string, data: any) => {
						if (event === "submit") {
							setOpen(["", null]);
							fetchData();
						}
					}}
				/>
			</Drawer>
		</>
	);
}
