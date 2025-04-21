"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { CircleCheck, Pencil, Plus, Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

import AppLoading from "@/components/AppLoading";
import AppTable from "@/components/AppTable";
import AppTitle from "@/components/AppTitle";
import { Button } from "@/components/ui/button";
import initSupabase from "@/lib/supabase";
import { dateFormat, pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";
import FormEdit from "./edit";

// --- Interfaces ---
interface Vendor {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	published?: boolean;
	createdAt?: string;
	// Add other vendor properties as needed
}

interface FetchResponse {
	data: Vendor[] | any; // Use Vendor[] type
	count: number | null;
}

interface DrawerState {
	mode: "create" | "edit" | null;
	data: Vendor | null;
}

export default function Fetch(props: any) {
	const type = "vendor";
	const { title, page, breadcrumb } = props;
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
			cat: search.get("cat") || "", // Keep if vendors might be categorized later
			type: type, // Ensure type is passed if needed by backend
		}),
		[pageSize, page, search, type], // Add type dependency if used in query
	);

	const fetchData = useCallback(async () => {
		// Reset loading state on fetch start if needed, though useEffect handles initial load
		// setLoading(true); // Optional: uncomment if you want loading indicator on manual refetch
		try {
			const res = await actions.getAll(query);
			// Ensure both data and count are checked
			if (res?.data) {
				setDb({ data: res.data, count: res.count });
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}, [query]);

	const deteteRecord = async (id: string) => {
		// Use window.confirm for consistency
		if (window.confirm("Are you sure you want to delete this record?")) {
			const res = await actions.deleteRecord(id);
			if (res?.success === "success") {
				fetchData();
				// Close drawer if the deleted item was being edited
				if (drawerState.mode === "edit" && drawerState.data?.id === id) {
					handleDrawerClose();
				}
			}
			// Consider adding error handling/toast notification here
		}
	};

	useEffect(() => {
		fetchData();
		// Ensure the correct table name is used for Supabase listener
		initSupabase({
			table: "Customer", // Assuming 'Customer' is the correct table for vendors
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
				className="h-8 w-8 border-gray-400 bg-gray-200 text-black hover:bg-gray-400">
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
					url={`/admin/${type}s`}
					page={page}
					pageSize={pageSize}
					// Update onChange handler to use setDrawerState
					onChange={(event: string, data: Vendor) => { // Use Vendor type
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
							header: "Name",
							accessor: "name",
							custom: (row: Vendor) => { // Use Vendor type
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
											<span className="text-sm whitespace-nowrap truncate overflow-ellipsis max-w-xs">{row.name}</span>
										</div>
										<div className="text-gray-500 text-xs">{dateFormat(row?.createdAt || "")}</div>
									</>
								);
							},
						},
						{
							header: "Email/Phone",
							accessor: "email", // Primary accessor for sorting/filtering if needed
							custom: (row: Vendor) => { // Use Vendor type
								return (
									<div className="flex flex-col text-sm"> {/* Use text-sm */}
										<span>{row?.email || "-"}</span> {/* Handle undefined */}
										<span>{row?.phone || "-"}</span> {/* Handle undefined */}
									</div>
								);
							},
						},
						{
							header: "Address",
							accessor: "address", // Primary accessor
							custom: (row: Vendor) => { // Use Vendor type
								// Combine address parts safely
								const addressParts = [row?.address, row?.city, row?.state, row?.country].filter(Boolean);
								return (
									<div className="space-x-1 text-sm"> {/* Use text-sm */}
										<span>{addressParts.length > 0 ? addressParts.join(", ") : "-"}</span>
									</div>
								);
							},
						},
						{
							header: "Edit",
							accessor: "edit", // Keep accessor if needed for table internals
							custom: (row: Vendor) => { // Use Vendor type
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
						{ value: "name", label: "Order by Name" },
						// Add other relevant order options if applicable
						// { value: "emailVerified", label: "Order by Date Verified" },
					]}
				/>
			)}
			{/* Single Drawer Component */}
			<Drawer
				title={`${drawerState.mode === "create" ? "Create" : "Edit"} ${title}`}
				placement="right"
				width={800} // Adjust width as needed
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
