import { Fragment, useEffect, useState } from "react";
import { EllipsisVertical, Info, Plus, PlusCircle, Search, Settings, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { checkStringIsTextOrColorHexOrURL } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";

export default function OrderAttribute(props: any) {
	const { data } = props;
	const atts = useAppSelector((state) => state.attributeState.data).filter((item) => item?.mapto === "order");
	const [open, setOpen] = useState<any>(["", null]);
	const [selected, setSelected] = useState<any>([]);
	const [current, setCurrent] = useState<any>(null);
	const [search, setSearch] = useState<any>([]);

	const searchAttributeMeta = async (e: any, attributeId: string) => {
		if (e.length > 1) {
			await actions.searchAttributeMeta(e, attributeId).then((res: any) => {
				if (res.success === "success") {
					// data: [
					// 	{
					// 		"id": Number,
					// 		"key": String,
					// 		"value": String,
					// 	}
					// ]
					setSearch(res.data);
				}
			});
		}
	};

	const saveAttributeMeta = async () => {
		const orderId = data?.id;
		const orderData = JSON.stringify(selected);
		await actions.updateRecord(orderId, { data: orderData }).then((res: any) => {
			if (res.success === "success") {
				toast.success("Order attributes updated successfully");
				setCurrent(selected);
			}
		});
	};

	const handleAddAttributeMeta = async (item: any) => {
		const children = atts?.find((att: any) => att?.id === item?.id)?.children;
		if (children.length > 0) {
			const _data: any = [];
			children?.forEach((child: any) => {
				const _item = {
					title: child?.title,
					id: child?.id,
					value: ''
				}
				_data.push(_item);
			})
			const existingItem = selected.find((i: any) => i.id === item?.id);
			if (existingItem) {
				if (existingItem.children) {
					const newChildren = [...existingItem.children, ...[_data]];
					setSelected((prev: any) => {
						const newSelected = [...prev];
						const index = newSelected.findIndex((i: any) => i.id === item?.id);
						if (index !== -1) {
							newSelected[index].children = newChildren;
						}
						return newSelected;
					});
				} else {
					existingItem.children = [_data];
					setSelected((prev: any) => {
						const newSelected = [...prev];
						const index = newSelected.findIndex((i: any) => i.id === item?.id);
						if (index !== -1) {
							newSelected[index] = existingItem;
						}
						return newSelected;
					});
				}
			}

		} else {
			toast.error("No children found");
		}
	}

	useEffect(() => {
		if (data?.data) {
			const dataParsed = JSON.parse(data?.data);
			setSelected(dataParsed);
			setCurrent(dataParsed);
		}
	}, [data?.data]);

	return (
		<div className="block w-full">
			<div className="flex items-center justify-between mb-5">
				<div className="l">
					<h3 className="font-semibold mb-0">Additional Information</h3>
					<p className="text-sm text-muted-foreground">You can add more information about this order here.</p>
				</div>
				<div className="ml-auto flex items-center space-x-2">
					<Info className={`w-4 h-4 text-red-500 ${selected === current ? "hidden" : ""}`} />
					<Button
						type="button"
						disabled={selected === current}
						onClick={saveAttributeMeta}>
						Save
					</Button>
				</div>
			</div>

			<div className="flex flex-col space-y-4">
				{selected?.map((item: any, index: number) => (
					<Fragment key={index}>
						<div
							className="flex flex-col">
							<div className="flex items-center justify-between group bg-gray-100 px-2 py-2 rounded-lg dark:bg-gray-900">
								<div className="text-lg font-bold pl-1">{item?.title}</div>
								<div className="ml-auto">
									<div className="flex items-center space-x-2">
										<DropdownMenu>
											<DropdownMenuTrigger className="cursor-pointer px-1 text-gray-500 dark:text-gray-400">
												<PlusCircle className="w-6 h-6" />
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
												<DropdownMenuItem
													className="cursor-pointer flex items-center space-x-2"
													onClick={() => {
														handleAddAttributeMeta(item)
													}}>
													<Plus className="w-4 h-4" />
													<span>Add New {item?.title}</span>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer flex items-center space-x-2 text-red-600"
													onClick={() => {
														if (confirm("Are you sure you want to remove this item?")) {
															setSelected((prev: any) => prev.filter((i: any) => i !== item));
														}
													}}>
													<X className="w-4 h-4" />
													<span>Remove</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</div>
						</div>
						<div id={`father_${item?.id}`} className="flex flex-col space-y-1">
							{item?.children?.map((child: any, i: number) => (
								<div
									key={i}
									className={`grid grid-cols-${child?.length} gap-5`}>
									{child?.map((frm: any, j: number) => (
										<Fragment key={j}>
											<div className="item">
												<label htmlFor={frm?.id}>{frm?.title}</label>
												<Button
													id={frm?.id}
													className="w-full"
													type="button"
													onClick={() => {
														setOpen(["search", [j, frm, item, child]]);
													}}
												>Select</Button>
											</div>
										</Fragment>
									))}
								</div>
							))}
						</div>
					</Fragment>
				))}
			</div>

			<Dialog
				open={open[0] === "create"}
				defaultOpen={false}
				onOpenChange={(open) => setOpen([open ? "create" : "", null])}>
				<DialogTrigger asChild>
					{selected?.length < atts?.length && (
						<Button
							type="button"
							className="mt-5 mb-5">
							<Plus />
							Add Attribute
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>List of Attributes</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col">
						{atts?.map((item: any, index: number) => (
							<div
								key={index}
								className={`flex items-center justify-between py-2 hover:text-black text-gray-500 dark:hover:text-white`}>
								<p>{item?.title}</p>
								<Button
									type="button"
									className="text-sm bg-black text-white hover:bg-gray-900 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white"
									onClick={() => {
										setSelected((prev: any) => {
											const newSelected = [...prev];
											if (newSelected.includes(item)) {
												return newSelected.filter((i: any) => i !== item);
											} else {
												const _item = {
													title: item?.title,
													id: item?.id,
												};
												return [...newSelected, _item];
											}
										});
									}}
									disabled={selected?.find((i: any) => i.id === item?.id)}>
									Select
								</Button>
							</div>
						))}
						{atts?.length === 0 && (
							<div className="flex items-center justify-between py-2 text-gray-500">
								<p>No attributes found</p>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>


			<Dialog
				open={open[0] === "search"}
				defaultOpen={false}
				onOpenChange={(open) => setOpen([open ? "search" : "", null])}>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>Search in {open[1] ? open[1][1]?.title : ''}</DialogTitle>
					</DialogHeader>
					<Command className="dark:bg-gray-800 dark:border-gray-700 border-0">
						<Input
							placeholder="Search..."
							className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
							onBlur={(e) => {
								const search = (e.target as HTMLInputElement)?.value;
								const parentId = open[1] ? open[1][1]?.id : '';
								searchAttributeMeta(search, parentId);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const search = (e.target as HTMLInputElement)?.value;
									const parentId = open[1] ? open[1][1]?.id : '';
									searchAttributeMeta(search, parentId);
								}
							}}
						/>
						<CommandList>
							<CommandEmpty>No data found.</CommandEmpty>
							{search?.length > 0 && (
								<CommandGroup>
									{search?.map((item: any, index: number) => (
										<CommandItem
											key={index}
											value={item?.key}
											className="cursor-pointer"
											onSelect={() => {
												// selectd = [
												//  {
												// 		id: Number,
												// 		title: String,
												// 		children: [
												// 			[
												// 				{
												// 					id: Number,
												// 					title: String,
												// 					value: Object,
												// 				}
												// 			]
												// 		]
												// ]

												const frm = open[1][3][open[1][0]]; // {title: 'Color', id: 21, value: ''}
												const _item = {
													id: item?.id,
													title: item?.key,
													value: item?.value,
												};
												frm.value = _item;
												// Find the selected item in the selected array
												const selectedItem = selected.find((i: any) => i.id === open[1][2]?.id);
												if (selectedItem) {
													// Update the selected item with the new value and keep other children intact
													const updatedChildren = selectedItem.children.map((child: any) => {
														if (child[open[1][0]]) {
															return child.map((i: any) => {
																if (i.id === open[1][1]?.id) {
																	return { ...i, value: _item };
																}
																return i;
															});
														}
														return child;
													});
													setSelected((prev: any) => {
														const newSelected = [...prev];
														const index = newSelected.findIndex((i: any) => i.id === selectedItem.id);
														if (index !== -1) {
															newSelected[index].children = updatedChildren;
														}
														return newSelected;
													})
												}
												console.log("selected", selected);
											}}>
											{item?.key}
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>

		</div>
	);
}
