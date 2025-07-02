"use client";

import { useMemo } from "react";
import { Drawer } from "antd";
import { Plus } from "lucide-react";

import AppLoading from "@/components/AppLoading";
import AppTitle from "@/components/AppTitle";
import OptimizedAdminTable from "@/components/OptimizedAdminTable";
import { Button } from "@/components/ui/button";
import { useAdminTable } from "@/hooks/useAdminTable";
import { useMemoizedCallback } from "@/hooks/useMemoizedCallback";
import { dateFormat } from "@/lib/utils";

import * as actions from "./actions";
import FormEdit from "./edit";

// Define interfaces for better type safety
interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	published: boolean;
	createdAt: string;
	avatar?: string;
}

export default function OptimizedUsersFetch(props: any) {
	const { title, breadcrumb, type = "user" } = props;

	// Use the optimized admin table hook
	const {
		db,
		loading,
		drawerState,
		handleEdit,
		handleCreate,
		handleFormChange,
		handleDrawerClose,
		deleteRecord,
		actions: tableActions,
	} = useAdminTable<User>({
		apiActions: {
			getAll: actions.getAll,
			deleteRecord: actions.deleteRecord,
			deleteMultiple: actions.deleteMultipleRecords,
		},
		tableName: "User",
		title,
		breadcrumb,
	});

	// Memoized custom columns for the table
	const customColumns = useMemo(
		() => [
			{
				header: "Name",
				accessor: "name",
				custom: (row: User) => (
					<div className="flex items-center space-x-3">
						{row.avatar && (
							<img
								src={row.avatar}
								alt={row.name}
								className="w-8 h-8 rounded-full object-cover"
							/>
						)}
						<div>
							<div className="font-medium text-gray-900">{row.name}</div>
							<div className="text-sm text-gray-500">{row.email}</div>
						</div>
					</div>
				),
			},
			{
				header: "Role",
				accessor: "role",
				custom: (row: User) => (
					<span
						className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
					>
						{row.role}
					</span>
				),
			},
			{
				header: "Created",
				accessor: "createdAt",
				custom: (row: User) => (
					<span className="text-sm text-gray-500">
						{dateFormat(row.createdAt)}
					</span>
				),
			},
		],
		[],
	);

	// Memoized order options
	const orderOptions = useMemo(
		() => [
			{ value: "name", label: "Order by Name" },
			{ value: "email", label: "Order by Email" },
			{ value: "role", label: "Order by Role" },
			{ value: "createdAt", label: "Order by Date" },
		],
		[],
	);

	// Memoized filter options
	const filterOptions = useMemo(
		() => [
			{ value: "role", label: "Filter by Role" },
			{ value: "published", label: "Filter by Status" },
		],
		[],
	);

	// Memoized drawer extra content
	const renderDrawerExtra = useMemoizedCallback(() => (
		<div className="flex items-center space-x-2">
			{drawerState.mode === "edit" && drawerState.data?.id && (
				<Button
					variant="destructive"
					size="sm"
					onClick={() => deleteRecord(drawerState.data!.id)}
					className="px-2 h-8 space-x-1"
				>
					🗑️ Delete
				</Button>
			)}
			<Button
				variant="outline"
				size="icon"
				onClick={handleDrawerClose}
				className="h-8 w-8 border-gray-400 bg-gray-200 text-black hover:bg-gray-400"
			>
				✕
			</Button>
		</div>
	));

	// Memoized drawer content
	const renderDrawerContent = useMemoizedCallback(() => {
		if (!drawerState.mode) return null;
		return (
			<FormEdit
				id={drawerState.mode === "edit" ? drawerState.data?.id : undefined}
				initialData={drawerState.mode === "edit" ? drawerState.data : undefined}
				onChange={handleFormChange}
			/>
		);
	});

	return (
		<>
			<div className="flex justify-between mb-5">
				<AppTitle data={title} breadcrumb={breadcrumb} />
				<Button onClick={handleCreate}>
					<Plus className="mr-2 h-4 w-4" />
					Create {title}
				</Button>
			</div>

			{loading ? (
				<AppLoading />
			) : (
				<OptimizedAdminTable
					data={db.data}
					count={db.count}
					title={title}
					url={`/admin/${type}s`}
					actions={tableActions}
					onEdit={handleEdit}
					customColumns={customColumns}
					order={orderOptions}
					filter={filterOptions}
				/>
			)}

			<Drawer
				title={`${drawerState.mode === "edit" ? "Edit" : "Create"} ${title}`}
				placement="right"
				width={500}
				onClose={handleDrawerClose}
				open={!!drawerState.mode}
				extra={renderDrawerExtra()}
			>
				{renderDrawerContent()}
			</Drawer>
		</>
	);
}
