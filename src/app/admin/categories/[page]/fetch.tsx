"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { CircleCheck, Pencil, Plus, Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

import AppLoading from "@/components/AppLoading";
import AppTable from "@/components/AppTable";
import AppTitle from "@/components/AppTitle";
import { Button } from "@/components/ui/button";
import { enumType } from "@/lib/enum"; // Keep enumType
import initSupabase from "@/lib/supabase";
import { dateFormat, pageSkip } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { deleteCategory, setCategory } from "@/store/categoriesSlice"; // Adjust import based on your store structure

import * as actions from "./actions";
import FormEdit from "./edit";

// --- Interfaces ---
interface Category {
	id: string;
	title: string;
	slug?: string;
	type?: string; // Assuming type is a string identifier
	published?: boolean;
	createdAt?: string;
	// Add other category properties as needed
}

interface FetchResponse {
	data: Category[] | any; // Use Category[] type
	count: number | null;
}

interface DrawerState {
	mode: "create" | "edit" | null;
	data: Category | null;
}

export default function Fetch(props: any) {
	const type = "category"; // Define type for consistency if needed
	const { title, page, breadcrumb } = props;
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	// Use a structured state for the drawer
	const [drawerState, setDrawerState] = useState<DrawerState>({ mode: null, data: null });
	// Use the FetchResponse interface for db state
	const [db, setDb] = useState<FetchResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const pageSize = useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const search = useSearchParams();

	// Consistent drawer close handler
	const handleDrawerClose = () => setDrawerState({ mode: null, data: null });

	// --- Data Fetching Logic ---
	const query = useMemo(
		() => ({
			take: Number(pageSize),
			skip: pageSkip(page, pageSize),
			s: search.get("s") || "",
			orderBy: search.get("orderBy") || "id",
			filterBy: search.get("filterBy") || "",
			cat: search.get("cat") || "", // Keep if categories might be filtered by parent category
			// type: type, // Add if backend expects a type filter for categories
		}),
		[pageSize, page, search], // Removed 'type' dependency unless used in query
	);

	const fetchData = useCallback(async () => {
		// setLoading(true); // Optional: uncomment if you want loading indicator on manual refetch
		try {
			// Fetch paginated data for the table
			const all = await actions.getAll({ min: true, published: true });
			const res = await actions.getAll(query);
			// Ensure both data and count are checked
			if (res?.data && typeof res?.count === "number") {
				setDb({ data: res.data, count: res.count });
			}
			if (all?.data) {
				dispatch(setCategory(all?.data)); // Uncomment if you need to set all categories in Redux
			}
			// Note: Removed the separate 'all' fetch and Redux dispatch for categories
			// to align with the customer pattern. Data consistency relies on refetch/Supabase.
		} catch (error) {
			console.error("Error fetching categories:", error);
		} finally {
			setLoading(false);
		}
	}, [dispatch, query]);

	const deteteRecord = async (id: string) => {
		// Use window.confirm for consistency
		if (window.confirm("Are you sure you want to delete this record?")) {
			const res = await actions.deleteRecord(id);
			if (res?.success === "success") {
				dispatch(deleteCategory(id)); // Dispatch delete action
				fetchData(); // Refetch data after successful delete
				// Close drawer if the deleted item was being edited
				if (drawerState.mode === "edit" && drawerState.data?.id === id) {
					handleDrawerClose();
				}
				// Note: Removed Redux dispatch for delete
			}
			// Consider adding error handling/toast notification here
		}
	};

	useEffect(() => {
		fetchData();
		// Ensure the correct table name is used for Supabase listener
		initSupabase({
			table: "Category", // Correct table name
			fetchData,
		});
	}, [fetchData]); // Keep dependency array minimal

	// Handle form changes (e.g., successful submit)
	const handleFormChange = (event: string) => {
		if (event === "submit") {
			handleDrawerClose();
			fetchData(); // Refetch data after successful submit
		}
	};

	// --- Render Logic ---

	// Consistent drawer extra content rendering
	const renderDrawerExtra = () => (
		<div className="flex items-center space-x-2">
			{drawerState.mode === "edit" && drawerState.data?.id && (
				<Button
					variant="destructive"
					size="sm"
					onClick={() => deteteRecord(drawerState.data!.id)} // Use non-null assertion
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
				<X className="h-5 w-5" />
			</Button>
		</div>
	);

	// Consistent drawer content rendering
	const renderDrawerContent = () => {
		if (!drawerState.mode) return null;
		return (
			<FormEdit
				// Pass id only in edit mode
				id={drawerState.mode === "edit" ? drawerState.data?.id : undefined}
				// Pass initial data only in edit mode
				initialData={drawerState.mode === "edit" ? drawerState.data : undefined}
				onChange={handleFormChange} // Use the consistent handler
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
				{/* Update button onClick to use setDrawerState */}
				<Button onClick={() => setDrawerState({ mode: "create", data: null })}>
					<Plus className="mr-2 h-4 w-4" /> {/* Add margin for icon */}
					Create {title}
				</Button>
			</div>

			{loading && <AppLoading />}
			{!loading && (
				<AppTable
					actions={actions}
					// Use optional chaining and provide default empty array/zero count
					data={db?.data || []}
					count={db?.count || 0}
					url={`/admin/categories`} // Correct URL
					page={page}
					pageSize={pageSize}
					// Update onChange handler to use setDrawerState
					onChange={(event: string, data: Category) => {
						// Use Category type
						if (event === "edit") {
							setDrawerState({ mode: "edit", data });
						}
						if (event === "delete") {
							// Delete is handled by the button in the drawer now,
							// but keep refetch if AppTable has its own delete mechanism
							fetchData();
						}
					}}
					columns={[
						{
							header: "Title",
							accessor: "title",
							custom: (row: Category) => {
								// Use Category type
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
											{/* Use text-sm for consistency */}
											<span className="text-sm whitespace-nowrap truncate overflow-ellipsis max-w-xs">{row.title}</span>
										</div>
										<div className="text-gray-500 text-xs">{dateFormat(row?.createdAt || "")}</div>
									</>
								);
							},
						},
						{
							header: "Slug",
							accessor: "slug",
							custom: (row: Category) => <span className="text-sm">{row.slug || "-"}</span>, // Use text-sm
						},
						{
							header: "Type",
							accessor: "type",
							custom: (row: Category) => {
								// Use Category type
								const typeInfo = enumType.find((item: any) => item.value === row.type);
								return <span className={`text-sm`}>{typeInfo?.label || row.type || "-"}</span>; // Display label or value
							},
						},
						{
							header: "Edit",
							accessor: "edit", // Keep accessor if needed for table internals
							custom: (row: Category) => {
								// Use Category type
								return (
									<Button
										variant="outline" // Use standard variants
										size="icon"
										className="h-7 w-7 border-gray-400 text-black hover:bg-gray-200" // Simplified styling
										onClick={() => setDrawerState({ mode: "edit", data: row })}>
										<Pencil className="h-4 w-4" /> {/* Consistent icon size */}
									</Button>
								);
							},
						},
					]}
					order={[
						{ value: "createdAt", label: "Order by Date" },
						{ value: "title", label: "Order by Title" },
						{ value: "type", label: "Order by Type" },
					]}
					filter={enumType.map((item) => ({ value: item.value, label: item.label }))} // Ensure filter uses value/label format
				/>
			)}
			{/* Single Drawer Component */}
			<Drawer
				title={`${drawerState.mode === "create" ? "Create" : "Edit"} ${title}`}
				placement="right"
				width={1200} // Adjust width as needed
				open={drawerState.mode !== null}
				closable={false} // Use extra for close button
				onClose={handleDrawerClose}
				destroyOnClose={true} // Reset form state on close
				maskClosable={false}
				extra={renderDrawerExtra()} // Use the render function for extra content
			>
				{renderDrawerContent()} {/* Use the render function for content */}
			</Drawer>
		</>
	);
}
