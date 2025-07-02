import React, { memo, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Pencil, X } from "lucide-react";

import AppTable from "@/components/AppTable";
import { Button } from "@/components/ui/button";

// Generic interfaces for reusable table component
interface BaseEntity {
	id: string | number;
	published?: boolean;
	createdAt?: string;
	[key: string]: any;
}

interface OptimizedTableProps<T extends BaseEntity> {
	data: T[];
	count: number;
	title: string;
	url: string;
	actions: any;
	onEdit: (item: T) => void;
	onView?: (item: T) => void;
	customColumns?: Array<{
		header: string;
		accessor: string;
		custom?: (row: T) => React.ReactNode;
	}>;
	order?: Array<{ value: string; label: string }>;
	filter?: Array<{ value: string; label: string }>;
}

function OptimizedAdminTable<T extends BaseEntity>({ data, count, title, url, actions, onEdit, onView, customColumns = [], order = [], filter = [] }: OptimizedTableProps<T>) {
	// Memoized columns to prevent recreation on every render
	const columns = useMemo(() => {
		const baseColumns = customColumns.map((col) => ({
			header: col.header,
			accessor: col.accessor,
			custom: col.custom || ((row: T) => <span className="text-sm">{String(row[col.accessor] || "")}</span>),
		}));

		// Common columns that most tables use
		const commonColumns = [
			{
				header: "Status",
				accessor: "published",
				custom: (row: T) => (
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
					</div>
				),
			},
			{
				header: "Actions",
				accessor: "actions",
				custom: (row: T) => (
					<div className="flex space-x-1">
						{onView && (
							<Button
								variant="outline"
								size="sm"
								className="h-7 w-7 border-blue-400 text-blue-600 hover:bg-blue-50"
								onClick={() => onView(row)}>
								👁️
							</Button>
						)}
						<Button
							variant="outline"
							size="sm"
							className="h-7 w-7 border-gray-400 text-black hover:bg-gray-200"
							onClick={() => onEdit(row)}>
							<Pencil className="h-4 w-4" />
						</Button>
					</div>
				),
			},
		];

		return [...baseColumns, ...commonColumns];
	}, [customColumns, onEdit, onView]);

	const defaultOrder = useMemo(() => [{ value: "createdAt", label: "Order by Date" }, { value: "published", label: "Order by Status" }, ...order], [order]);

	const defaultFilter = useMemo(() => [{ value: "published", label: "Filter by Status" }, ...filter], [filter]);

	return (
		<AppTable
			actions={actions}
			data={data}
			count={count}
			url={url}
			columns={columns}
			order={defaultOrder}
			filter={defaultFilter}
		/>
	);
}

// Export memoized version to prevent unnecessary re-renders
export default memo(OptimizedAdminTable) as typeof OptimizedAdminTable;
