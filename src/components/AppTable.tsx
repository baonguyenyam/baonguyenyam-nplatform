import { useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	Check,
	ChevronDown,
	ChevronsUpDown,
	InboxIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import AppPagination from "@/components/AppPagination";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn, pageSkip } from "@/lib/utils";

export default function AppTable(props: any) {
	const { order, filter } = props;
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [open, setOpen] = useState(false);
	const [openorder, setOpenOrder] = useState(false);
	const [value, setValue] = useState("");
	const {
		data,
		columns,
		count,
		page,
		pageSize,
		url,
		onChange,
		multipleDisable,
		actions,
	} = props;
	const searchVal = useSearchParams();
	const query = {
		take: Number(pageSize),
		skip: pageSkip(page, pageSize),
		s: searchVal.get("s") || "",
		orderBy: searchVal.get("orderBy") || "id",
		filterBy: searchVal.get("filterBy") || "",
		cat: searchVal.get("cat") || "",
	};

	const checlAll: ColumnDef<any> = {
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	};

	const TableColumns = columns.map((column: any) => {
		return {
			...column,
			id: column.accessor,
			accessorKey: column.accessor,
			meta: {
				className: column.className,
			},
			cell: (info: any) => {
				return (
					<div
						className={`whitespace-nowrap truncate overflow-ellipsis max-w-xs ${column?.className || ""}`}
					>
						{info?.column?.columnDef?.custom
							? info?.column?.columnDef?.custom(info.row.original)
							: info.getValue()}
					</div>
				);
			},
			Header: ({ column }: any) => (
				<div className="font-bold" onClick={column.getToggleSortingHandler()}>
					{column.render("Header")}
					{{
						asc: <ArrowUpDown className="ml-auto" />,
						desc: <ArrowUpDown className="ml-auto" />,
					}[column.getIsSorted() as string] ?? null}
				</div>
			),
			enableSorting: column.accessor === "edit" ? false : true,
			enableHiding:
				column.accessor === "edit" ||
				column.accessor === "name" ||
				column.accessor === "title"
					? false
					: true,
		};
	});

	const table = useReactTable({
		data,
		columns: [checlAll, ...TableColumns],
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		initialState: {
			pagination: {
				pageSize: pageSize,
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const search = (e: any) => {
		e.preventDefault();
		const search = e.target[0].value;
		if (search) {
			window.location.href = `${url}?s=${search}`;
		}
	};

	const doFilterBy = (filter: string) => {
		if (filter) {
			window.location.href = `${url}?s=${query.s}&orderBy=${query.orderBy}&filterBy=${filter}&cat=${query.cat}&skip=${query.skip}&take=${query.take}`;
		}
	};

	const doOrderBy = (order: string) => {
		if (order) {
			window.location.href = `${url}?s=${query.s}&orderBy=${order}&filterBy=${query.filterBy}&cat=${query.cat}&skip=${query.skip}&take=${query.take}`;
		}
	};

	const deleteSelected = async (rowSelection: any) => {
		if (confirm("Are you sure you want to delete this record?")) {
			const arrayID: string[] = [];
			Object.keys(rowSelection).forEach((key) => {
				const row = table.getRowModel().rowsById[key];
				if (row) {
					const originalRow = row.original as { id: string };
					arrayID.push(originalRow.id);
				}
			});
			const res = await actions.deleteMultipleRecords(arrayID);
			if (res.success === "success") {
				toast.success(res.message);
				setRowSelection({});
				onChange("delete", res.data);
			} else {
				toast.error(res.message);
			}
		}
	};

	const publishSelected = async (rowSelection: any, all: boolean = false) => {
		if (confirm("Are you sure you want to unpublish this record?")) {
			const arrayID: string[] = [];
			Object.keys(rowSelection).forEach((key) => {
				const row = table.getRowModel().rowsById[key];
				if (row) {
					const originalRow = row.original as { id: string };
					arrayID.push(originalRow.id);
				}
			});

			let _body = {};

			if (all) {
				_body = {
					published: true,
				};
			} else {
				_body = {
					published: false,
				};
			}

			const res = await actions.updateMultipleRecords(arrayID, _body);
			if (res.success === "success") {
				toast.success(res.message);
				setRowSelection({});
				onChange("delete", res.data);
			} else {
				toast.error(res.message);
			}
		}
	};

	return (
		<>
			<Card className="w-full dark:bg-gray-900 dark:border-gray-700">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="flex flex-col">
						{data.length > 0 && (
							<>
								<CardTitle className="text-sm font-medium">
									Item(s) Found
								</CardTitle>
								<CardDescription className="text-sm text-muted-foreground">
									{count} item(s)
								</CardDescription>
							</>
						)}
						{data.length === 0 && (
							<CardTitle className="text-sm font-medium">
								No Item Found
							</CardTitle>
						)}
					</div>
					<div className="flex flex-row items-center space-x-2">
						{rowSelection && Object.keys(rowSelection).length > 0 && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="ml-auto">
										Columns <ChevronDown />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="dark:bg-gray-800 dark:border-gray-700"
								>
									<DropdownMenuItem
										className="capitalize"
										onClick={() => {
											deleteSelected(rowSelection);
										}}
										disabled={Object.keys(rowSelection).length === 0}
									>
										Delete selected
									</DropdownMenuItem>
									{multipleDisable &&
									multipleDisable?.includes("unpublish") ? null : (
										<DropdownMenuItem
											className="capitalize"
											onClick={() => {
												publishSelected(rowSelection);
											}}
											disabled={Object.keys(rowSelection).length === 0}
										>
											Unpublish
										</DropdownMenuItem>
									)}
									{multipleDisable &&
									multipleDisable?.includes("publish") ? null : (
										<DropdownMenuItem
											className="capitalize"
											onClick={() => {
												publishSelected(rowSelection, true);
											}}
											disabled={Object.keys(rowSelection).length === 0}
										>
											Publish
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						<form onSubmit={search}>
							<Input
								type="text"
								placeholder="Search"
								defaultValue={query.s}
								className="w-[200px] dark:bg-gray-800 dark:text-gray-200"
							/>
						</form>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="ml-auto dark:bg-gray-800 dark:text-gray-200"
								>
									Columns <ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="dark:bg-gray-800 dark:border-gray-700"
							>
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className="justify-between ml-auto dark:bg-gray-800 dark:text-gray-200"
								>
									{query.orderBy && query.orderBy
										? order.find((order: any) => order.value === query.orderBy)
												?.label
											? order.find(
													(order: any) => order.value === query.orderBy,
												)?.label
											: "Select Order"
										: "Select Order"}
									<ChevronsUpDown className="opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-[200px] p-0 dark:bg-gray-800 dark:border-gray-700"
								align="end"
							>
								<Command className="dark:bg-gray-800 dark:border-gray-700">
									<CommandList>
										<CommandGroup>
											{order.map((order: any) => (
												<CommandItem
													key={order.value}
													value={order.value}
													onSelect={(currentValue: any) => {
														setValue(currentValue);
														doOrderBy(currentValue);
														setOpen(false);
													}}
												>
													{order.label}
													<Check
														className={cn(
															"ml-auto",
															value === order.value
																? "opacity-100"
																: "opacity-0",
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{filter && filter?.length > 0 && (
							<Popover open={openorder} onOpenChange={setOpenOrder}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="justify-between"
									>
										{query.filterBy && query.filterBy
											? filter.find(
													(filter: any) => filter.value === query.filterBy,
												)?.label
												? filter.find(
														(filter: any) => filter.value === query.filterBy,
													)?.label
												: "Select One"
											: "Select One"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-[200px] p-0 dark:bg-gray-800 dark:border-gray-700"
									align="end"
								>
									<Command className="dark:bg-gray-800 dark:border-gray-700">
										<CommandList>
											<CommandGroup>
												{filter.map((filter: any) => (
													<CommandItem
														key={filter.value}
														value={filter.value}
														onSelect={(currentValue: any) => {
															setValue(currentValue);
															doFilterBy(currentValue);
															setOpenOrder(false);
														}}
													>
														{filter.label}
														<Check
															className={cn(
																"ml-auto",
																value === filter.value
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						{data.length > 0 && (
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow
										key={headerGroup.id}
										className="h-8 dark:border-gray-600"
									>
										{headerGroup.headers.map((header, index) => (
											<TableHead
												key={index}
												className={cn(
													"px-2 first:w-7 last:w-15 last:text-right bg-gray-50 dark:bg-gray-800 dark:text-gray-200",
													(header.column.columnDef.meta as any)?.className,
												)}
											>
												{header.isPlaceholder ? null : (
													<div
														className={`${header.column.getCanSort() ? "flex items-center justify-between cursor-pointer" : ""}`}
														onClick={header.column.getToggleSortingHandler()}
													>
														<span className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
														</span>
														{header.column.getCanSort() && (
															<div className="text-sm ml-auto">
																{{
																	asc: <ArrowUpDown className="w-5 h-5" />,
																	desc: <ArrowUpDown className="w-5 h-5" />,
																}[header.column.getIsSorted() as string] ??
																	null}
															</div>
														)}
													</div>
												)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
						)}
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className={cn(
										"h-8 hover:bg-muted dark:hover:bg-gray-800 dark:border-gray-800",
										row.getIsSelected() &&
											"bg-muted dark:bg-gray-800 dark:border-gray-900",
									)}
								>
									{row.getVisibleCells().map((cell, index) => (
										<TableCell
											key={index}
											className={cn(
												"px-2 first:w-7 last:w-15 last:text-right",
												(cell.column.columnDef.meta as any)?.className,
											)}
										>
											<div className="whitespace-nowrap truncate overflow-ellipsis max-w-xs">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</div>
										</TableCell>
									))}
								</TableRow>
							))}
							{data.length === 0 && (
								<TableRow className="bg-transparent!">
									<TableCell colSpan={columns.length} className="p-0!">
										<div className="flex flex-col items-center justify-center h-[50vh] gap-6 bg-gray-50 rounded-2xl dark:bg-gray-800">
											<div className="flex items-center justify-center w-20 h-20 bg-gray-900 text-white rounded-full">
												<InboxIcon className="w-10 h-10 text-white" />
											</div>
											<div className="space-y-2 text-center">
												<h2 className="text-2xl font-bold tracking-tight">
													No data to display
												</h2>
												<p className="text-gray-500">
													It looks like there's no data available yet. Try
													adding some new items.
												</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
				{Math.ceil(count / pageSize) > 1 && (
					<CardFooter className="flex justify-between items-center">
						<div className="flex justify-between items-center w-full">
							<div className="text-sm text-muted-foreground">
								Page {page} of {Math.ceil(count / pageSize)}
							</div>
							<div className="flex space-x-2">
								<AppPagination
									items={count}
									currentPage={page}
									pageSize={pageSize}
									url={url}
								/>
							</div>
						</div>
					</CardFooter>
				)}
			</Card>
		</>
	);
}
