"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import { Drawer, Upload } from "antd"; // Keep Upload from antd if preferred for multi-upload UI
import { CircleCheck, Inbox, Pencil, Plus, Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"; // Add toast for upload feedback

import AppImage from "@/components/AppImage";
import AppLoading from "@/components/AppLoading";
import AppTable from "@/components/AppTable";
import AppTitle from "@/components/AppTitle";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"; // Keep Dialog for upload
import { Input } from "@/components/ui/input"; // Keep Input for URL display
import initSupabase from "@/lib/supabase";
import { uploadFile } from "@/lib/upload"; // Keep uploadFile utility
import { dateFormat, formatBytes, pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";
import FormEdit from "./edit";

// --- Interfaces ---
interface FileData {
	id: string;
	name: string;
	url: string;
	size: number;
	ext: string;
	published?: boolean;
	createdAt?: string;
	title?: string; // Add title if editable
	alt?: string; // Add alt if editable
	user?: { name?: string }; // Optional user relation
	// Add other file properties as needed
}

interface FetchResponse {
	data: FileData[] | any; // Use FileData[] type
	count: number | null;
}

// Separate state for the edit drawer
interface DrawerState {
	isOpen: boolean;
	data: FileData | null;
}

// State for the upload dialog
interface UploadDialogState {
	isOpen: boolean;
	fileList: UploadFile[]; // Use Ant Design's UploadFile type
}

export default function Fetch(props: any) {
	const type = "file"; // Define type for consistency if needed
	const { title, page, breadcrumb } = props;

	// State for edit drawer
	const [drawerState, setDrawerState] = useState<DrawerState>({
		isOpen: false,
		data: null,
	});
	// State for upload dialog
	const [uploadDialogState, setUploadDialogState] = useState<UploadDialogState>(
		{ isOpen: false, fileList: [] },
	);
	// Use the FetchResponse interface for db state
	const [db, setDb] = useState<FetchResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const pageSize =
		useAppSelector((state) => (state.appState as any)?.pageSize) || 10;
	const search = useSearchParams();

	// Consistent drawer close handler
	const handleDrawerClose = () => setDrawerState({ isOpen: false, data: null });
	// Upload dialog close handler
	const handleUploadDialogClose = () =>
		setUploadDialogState({ isOpen: false, fileList: [] });

	// --- Data Fetching Logic ---
	const query = useMemo(
		() => ({
			take: Number(pageSize),
			skip: pageSkip(page, pageSize),
			s: search.get("s") || "",
			orderBy: search.get("orderBy") || "createdAt", // Default order
			filterBy: search.get("filterBy") || "",
			// cat: search.get("cat") || "", // Categories might not apply to files
		}),
		[pageSize, page, search],
	);

	const fetchData = useCallback(async () => {
		// setLoading(true); // Optional: uncomment if you want loading indicator on manual refetch
		try {
			const res = await actions.getAll(query);
			// Ensure both data and count are checked
			if (res?.data && typeof res?.count === "number") {
				setDb({ data: res.data, count: res.count });
			} else {
				// Handle cases where data might be missing or count is null
				setDb({ data: res?.data || [], count: res?.count || 0 });
				console.warn("Fetched data or count might be missing:", res);
			}
		} catch (error) {
			console.error("Error fetching files:", error);
			setDb({ data: [], count: 0 }); // Set empty state on error
		} finally {
			setLoading(false);
		}
	}, [query]);

	const deteteRecord = async (id: string) => {
		// Use window.confirm for consistency
		if (
			window.confirm(
				"Are you sure you want to delete this record? This action cannot be undone.",
			)
		) {
			const res = await actions.deleteRecord(id); // Assuming deleteRecord also handles storage deletion
			if (res?.success === "success") {
				toast.success("File deleted successfully.");
				fetchData(); // Refetch data after successful delete
				// Close drawer if the deleted item was being edited
				if (drawerState.isOpen && drawerState.data?.id === id) {
					handleDrawerClose();
				}
			} else {
				toast.error(res?.message || "Failed to delete file.");
			}
		}
	};

	useEffect(() => {
		fetchData();
		// Ensure the correct table name is used for Supabase listener
		initSupabase({
			table: "File", // Correct table name for files
			fetchData,
		});
	}, [fetchData]); // Keep dependency array minimal

	// Handle form changes (e.g., successful submit from edit drawer)
	const handleFormChange = (event: string) => {
		if (event === "submit") {
			handleDrawerClose();
			fetchData(); // Refetch data after successful submit
		}
	};

	// --- Upload Logic ---
	const uploadProps: UploadProps = {
		name: "file",
		multiple: true,
		listType: "picture",
		fileList: uploadDialogState.fileList,
		// Use customRequest to handle the upload via your utility
		customRequest: async ({ file, onSuccess, onError }) => {
			try {
				// Ensure file is of type File
				if (!(file instanceof File)) {
					throw new Error("Invalid file type provided to upload.");
				}
				const result = await uploadFile([file]); // Use your uploadFile utility
				if (result?.success && result?.data && result.data.length > 0) {
					if (onSuccess) onSuccess(result.data[0], new XMLHttpRequest()); // Pass result data to onSuccess
					toast.success(`"${file.name}" uploaded successfully.`);
					fetchData(); // Refresh the table data
				} else {
					throw new Error(result?.message || "Upload failed");
				}
			} catch (error: any) {
				console.error("Upload error:", error);
				toast.error(`"${(file as File).name}" upload failed: ${error.message}`);
				if (onError) onError(error);
			}
		},
		onChange(info) {
			setUploadDialogState((prev) => ({ ...prev, fileList: info.fileList }));
			// Optional: Handle status changes if needed, though customRequest handles success/error
			// if (info.file.status === 'done') { ... }
			// if (info.file.status === 'error') { ... }
		},
		onRemove(file) {
			// Optional: If you need to delete already uploaded files from this interface
			// This might be complex if the file is already in Supabase storage
			// Consider if removal should only happen before upload or trigger a delete action
			console.log("Remove file:", file.name);
			// Default behavior removes from list; add delete logic if needed
			// await actions.deleteRecord(file.uid); // Example: Requires mapping uid to your record ID
		},
	};

	// --- Render Logic ---

	// Consistent drawer extra content rendering (for edit drawer)
	const renderDrawerExtra = () => (
		<div className="flex items-center space-x-2">
			{drawerState.isOpen && drawerState.data?.id && (
				<Button
					variant="destructive"
					size="sm"
					onClick={() => deteteRecord(drawerState.data!.id)} // Use non-null assertion
					className="px-2 h-8 space-x-1"
				>
					<Trash className="h-4 w-4" />
					<span>Delete</span>
				</Button>
			)}
			<Button
				variant="outline"
				size="icon"
				onClick={handleDrawerClose}
				className="h-8 w-8 border-gray-400 bg-gray-200 text-black hover:bg-gray-400 dark:text-gray-200"
			>
				<X className="h-5 w-5" />
			</Button>
		</div>
	);

	// Consistent drawer content rendering (for edit drawer)
	const renderDrawerContent = () => {
		if (!drawerState.isOpen || !drawerState.data) return null;
		return (
			<FormEdit
				id={drawerState.data.id}
				initialData={drawerState.data}
				onChange={handleFormChange} // Use the consistent handler
			/>
		);
	};

	return (
		<>
			<div className="flex justify-between mb-5">
				<AppTitle data={title} breadcrumb={breadcrumb} />
				{/* Keep Dialog for Uploading */}
				<Dialog
					open={uploadDialogState.isOpen}
					onOpenChange={(open) =>
						setUploadDialogState((prev) => ({
							...prev,
							isOpen: open,
							fileList: open ? [] : prev.fileList,
						}))
					}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Upload {title}
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Upload {title}</DialogTitle>
						</DialogHeader>
						<div className="overflow-auto py-2" id="upload">
							<Upload.Dragger {...uploadProps} style={{ maxHeight: "150px" }}>
								<p className="ant-upload-drag-icon">
									<Inbox className="mx-auto h-12 w-12 text-gray-400" />
								</p>
								<p className="ant-upload-text">
									Click or drag file to this area to upload
								</p>
								<p className="ant-upload-hint">
									Support for single or bulk upload.
								</p>
							</Upload.Dragger>
						</div>
						{/* Optional: Add a button to close dialog after uploads if needed */}
						{/* <DialogFooter>
							<Button variant="outline" onClick={handleUploadDialogClose}>Done</Button>
						</DialogFooter> */}
					</DialogContent>
				</Dialog>
			</div>

			{loading && <AppLoading />}
			{!loading && (
				<AppTable
					actions={actions}
					// Use optional chaining and provide default empty array/zero count
					data={db?.data || []}
					count={db?.count || 0}
					url={`/admin/files`} // Correct URL
					page={page}
					pageSize={pageSize}
					// Update onChange handler to use setDrawerState for editing
					onChange={(event: string, data: FileData) => {
						// Use FileData type
						if (event === "edit") {
							setDrawerState({ isOpen: true, data });
						}
						fetchData(); // Refetch data after delete
						// Delete is handled by the button in the drawer now
					}}
					columns={[
						{
							header: "Image",
							accessor: "url", // Sort/filter by URL if needed
							className: "w-20",
							custom: (row: FileData) => {
								// Use FileData type
								return (
									<AppImage
										src={row.url}
										width={60} // Adjust size
										height={40} // Adjust size
										alt={row.alt || row.name} // Use alt text if available
										className="h-10 w-auto max-w-[60px] rounded object-cover border border-gray-200"
									/>
								);
							},
						},
						{
							header: "Name",
							accessor: "name",
							custom: (row: FileData) => {
								// Use FileData type
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
											<span className="text-sm whitespace-nowrap truncate overflow-ellipsis max-w-[200px]">
												{row.name}
											</span>
										</div>
										<div className="text-gray-500 text-xs">
											{dateFormat(row?.createdAt || "")}
										</div>
									</>
								);
							},
						},
						{
							header: "URL",
							accessor: "url",
							custom: (row: FileData) => {
								// Use FileData type
								return (
									<div className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">
										<Input
											value={row.url}
											className="h-7 px-2 py-1 text-xs" // Smaller input
											readOnly
											onClick={(e) => {
												navigator.clipboard.writeText(row.url);
												toast.info("URL copied to clipboard");
												e.currentTarget.select(); // Select text on click
											}}
										/>
									</div>
								);
							},
						},
						{
							header: "Size",
							accessor: "size",
							custom: (row: FileData) => {
								// Use FileData type
								return <span className="text-sm">{formatBytes(row.size)}</span>; // Use utility
							},
						},
						{
							header: "Extension",
							accessor: "ext",
							custom: (row: FileData) => (
								<span className="text-sm">{row.ext}</span>
							),
						},
						{
							header: "User",
							accessor: "user.name", // Access nested property for sorting/filtering
							custom: (row: FileData) => (
								<span className="text-sm">{row.user?.name || "-"}</span>
							),
						},
						{
							header: "Edit",
							accessor: "edit", // Keep accessor if needed for table internals
							custom: (row: FileData) => {
								// Use FileData type
								return (
									<Button
										variant="outline" // Use standard variants
										size="icon"
										className="h-7 w-7 border-gray-400 text-black hover:bg-gray-200" // Simplified styling
										onClick={() => setDrawerState({ isOpen: true, data: row })}
									>
										<Pencil className="h-4 w-4" /> {/* Consistent icon size */}
									</Button>
								);
							},
						},
					]}
					order={[
						{ value: "createdAt", label: "Order by Date" },
						{ value: "name", label: "Order by Name" },
						{ value: "size", label: "Order by Size" },
						{ value: "ext", label: "Order by Extension" },
						{ value: "user.name", label: "Order by User" },
					]}
					// filter={...} // Add filters if needed (e.g., by extension, user)
				/>
			)}
			{/* Single Drawer Component for Editing */}
			<Drawer
				title={`Edit ${title}`}
				placement="right"
				width={1200} // Adjust width as needed for file metadata
				open={drawerState.isOpen}
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
