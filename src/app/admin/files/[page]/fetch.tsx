"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { CircleCheck, Pencil, Plus, Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

import AppImage from "@/components/AppImage";
import AppLoading from "@/components/AppLoading";
import AppTable from "@/components/AppTable";
import AppTitle from "@/components/AppTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/upload";
import { pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";
import FormEdit from "./edit";

export default function Fetch(props: any) {
	const { title, page, breadcrumb } = props;
	const [open, setOpen] = useState<any>(["", null]);
	const [db, setDb] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [imgs, setImgs] = useState<any>([]);
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
			setDb(res);
			setLoading(false);
		}
	}, [query]);

	const deteteRecord = async (id: string) => {
		if (confirm("Are you sure you want to delete this record?")) {
			const res = await actions.deleteRecord(id);
			if (res?.success === "success") {
				fetchData();
			}
		}
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
				<Dialog
					open={open[0] === "create"}
					defaultOpen={false}
					onOpenChange={(open) => setOpen([open ? "create" : "", null])}>
					<DialogTrigger asChild>
						<Button
							type="button"
							onClick={() => setOpen(["create", null])}>
							<Plus />
							Create {title}
						</Button>
					</DialogTrigger>
					<DialogContent className="w-full sm:max-w-[800px]">
						<DialogHeader>
							<DialogTitle>Upload {title}</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="iploadfile"
									className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-600 dark:hover:border-gray-500">
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg
											className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 20 16">
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
											/>
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											<span className="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
									</div>
									<Input
										type="file"
										placeholder="Image"
										multiple
										onChange={async (e) => {
											const files = e.target.files;
											if (files) {
												for (let i = 0; i < files.length; i++) {
													const file = files[i];
													const reader = new FileReader();
													reader.onload = (e) => {
														const img = document.createElement("img");
														img.src = e.target?.result as string;
														img.className = "h-full object-cover border-2 border-gray-300 rounded-lg";
														document.getElementById("previewimg")?.appendChild(img);
													};
													reader.readAsDataURL(file);
													setImgs((prev: any) => [...prev, file]);
													await uploadFile([file]);
												}
												setOpen(["", null]);
												setImgs([]);
												fetchData();
											}
										}}
										className="hidden"
										id="iploadfile"
									/>
								</label>
							</div>
							<div
								id="previewimg"
								className="grid grid-cols-3 lg:grid-cols-4 gap-10"></div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{loading && <AppLoading />}
			{!loading && (
				<AppTable
					actions={actions}
					data={db.data}
					count={db.count}
					url={`/admin/files`}
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
							header: "Image",
							accessor: "image",
							className: "w-20",
							custom: (row: any) => {
								return (
									<AppImage
										src={row.url}
										width={100}
										height={50}
										alt={row.title}
										className="w-15 h-10 rounded object-cover border border-gray-200"
									/>
								);
							},
						},
						{
							header: "Name",
							accessor: "name",
							// custom: (row: any) => {
							// 	return <div className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">{row.name}</div>;
							// },
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
											<span className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">{row.name}</span>
										</div>
									</>
								);
							},
						},
						{
							header: "URL",
							accessor: "url",
							custom: (row: any) => {
								return (
									<div className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">
										<Input
											value={row.url}
											className="w-full"
											readOnly
											onClick={(e) => {
												e.stopPropagation();
												navigator.clipboard.writeText(row.url);
											}}
											onFocus={(e) => {
												e.stopPropagation();
												e.target.select();
											}}
										/>
									</div>
								);
							},
						},
						{
							header: "Size",
							accessor: "size",
							custom: (row: any) => {
								return <>{row.size / 1024 > 1000 ? `${(row.size / 1024 / 1024).toFixed(2)} MB` : `${(row.size / 1024).toFixed(2)} KB`}</>;
							},
						},
						{
							header: "Extension",
							accessor: "ext",
						},
						{
							header: "User",
							accessor: "user.name",
						},
						{
							header: "Edit",

							accessor: "edit",
							custom: (row: any) => {
								return (
									<Button
										size="icon"
										className="hover:bg-gray-900 bg-gray-100 text-sm inline-flex flex-row items-center w-7 h-7 justify-center text-black border border-gray-400 rounded-md hover:text-white hover:border-black"
										onClick={() => setOpen(["edit", row])}>
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
							value: "name",
							label: "Order by Name",
						},
						{
							value: "size",
							label: "Order by Size",
						},
						{
							value: "ext",
							label: "Order by Extension",
						},
					]}
				/>
			)}
			<Drawer
				maskClosable={false}
				closable={false}
				open={open[0] === "edit"}
				onClose={() => setOpen(["", null])}
				title={`Edit ${title}`}
				placement="right"
				width={800}
				destroyOnClose={true}
				extra={
					<div className="flex items-center space-x-2">
						<Button
							type="button"
							className="hover:bg-red-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-red-800 px-2 h-8 bg-red-200 font-medium hover:text-black text-black border-2 border-red-400 rounded-lg"
							onClick={() => {
								deteteRecord(open[1]?.id);
								setOpen(["", open[1]]);
							}}>
							<Trash /> Delete
						</Button>
						<Button
							type="button"
							className="hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 w-8 h-8 bg-gray-200 font-medium text-black border-2 border-gray-400 rounded-lg"
							onClick={() => setOpen(["", null])}>
							<X />
						</Button>
					</div>
				}>
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
