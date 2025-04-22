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
import initSupabase from "@/lib/supabase";
import { dateFormat, pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";
import FormEdit from "./edit";

// Define interfaces for better type safety (replace 'any' with actual types if known)
interface Post {
	id: string;
	title: string;
	image?: string;
	published?: boolean;
	createdAt?: string | Date;
	slug?: string;
	user?: { name?: string };
	// Add other post properties as needed
}

interface FetchResponse {
	data: Post[] | any;
	count: number | null;
}

interface DrawerState {
	mode: "create" | "edit" | null;
	data: Post | null;
}

export default function Fetch(props: any) {
	const type = "product";
	const { title, page, breadcrumb } = props;
	const [drawerState, setDrawerState] = useState<DrawerState>({ mode: null, data: null });
	const [db, setDb] = useState<FetchResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const pageSize = useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const search = useSearchParams();
	const handleDrawerClose = () => setDrawerState({ mode: null, data: null });
	// --- Data Fetching Logic ---
	const query = useMemo(
		() => ({
			take: Number(pageSize),
			skip: pageSkip(page, pageSize),
			s: search.get("s") || "",
			orderBy: search.get("orderBy") || "id",
			filterBy: search.get("filterBy") || "",
			cat: search.get("cat") || "",
			type: type,
		}),
		[pageSize, page, search],
	);

	const fetchData = useCallback(async () => {
		try {
			const res = await actions.getAll(query);
			if (res?.data) {
				setDb({ data: res.data, count: res.count });
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}, [query]);

	const deteteRecord = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this record?")) {
			const res = await actions.deleteRecord(id);
			if (res?.success === "success") {
				fetchData();
				handleDrawerClose(); // Close drawer if open for the deleted item
			}
		}
	};

	useEffect(() => {
		fetchData();
		initSupabase({
			table: "Post",
			fetchData,
		});
	}, [fetchData]);

	const handleFormChange = (event: string) => {
		if (event === "submit") {
			handleDrawerClose();
			fetchData(); // Refetch data after successful submit
		}
	};

	const renderDrawerExtra = () => (
		<div className="flex items-center space-x-2">
			{drawerState.mode === "edit" && drawerState.data?.id && (
				<Button
					variant="destructive" // Use destructive variant
					size="sm" // Consistent size
					onClick={() => deteteRecord(drawerState.data!.id)} // Use non-null assertion as id is checked
					className="px-2 h-8 space-x-1">
					<Trash className="h-4 w-4" />
					<span>Delete</span>
				</Button>
			)}
			<Button
				variant="outline"
				size="icon"
				onClick={handleDrawerClose}
				className="h-8 w-8 border-gray-400 bg-gray-200 text-black hover:bg-gray-400 dark:text-gray-200">
				<X className="h-5 w-5" /> {/* Consistent icon size */}
			</Button>
		</div>
	);

	// --- Render Logic ---
	const renderDrawerContent = () => {
		if (!drawerState.mode) return null;
		return (
			<FormEdit
				id={drawerState.mode === "edit" ? drawerState.data?.id : undefined}
				initialData={drawerState.mode === "edit" ? drawerState.data : undefined} // Pass initial data for editing
				onChange={handleFormChange}
			/>
		);
	};

	return (
		<>
			<div className="flex justify-between mb-5">
				<AppTitle
					data={title}
					breadcrumb={breadcrumb}
				/>
				<Button onClick={() => setDrawerState({ mode: "create", data: null })}>
					<Plus />
					Create {title}
				</Button>
			</div>

			{loading && <AppLoading />}
			{!loading && (
				<AppTable
					actions={actions}
					data={db?.data || []}
					count={db?.count || 0}
					url={`/admin/${type}s`}
					page={page}
					pageSize={pageSize}
					onChange={(event: string, data: any) => {
						if (event === "edit") {
							setDrawerState({ mode: "edit", data });
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
										src={row.image}
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
											<span className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">{row.title}</span>
										</div>
										<div className="text-gray-500 text-xs">{dateFormat(row?.createdAt)}</div>
									</>
								);
							},
						},
						{
							header: "Slug",
							accessor: "slug",
						},
						{
							header: "User",
							accessor: "user.name",
							custom: (row: any) => {
								return <>{row?.user?.name}</>;
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
										onClick={() => setDrawerState({ mode: "edit", data: row })}>
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
				title={`${drawerState.mode === "create" ? "Create" : "Edit"} ${title}`}
				placement="right"
				width={1200}
				open={drawerState.mode !== null}
				closable={false}
				onClose={handleDrawerClose}
				destroyOnClose={true} // Keep this if form state needs resetting
				maskClosable={false}
				extra={renderDrawerExtra()}>
				{renderDrawerContent()}
			</Drawer>
		</>
	);
}
