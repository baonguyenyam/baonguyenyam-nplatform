import { Fragment, useEffect, useMemo, useState } from "react";
import { Copy, Info, Plus, PlusCircle, Search, Settings, X } from "lucide-react";
import { toast } from "sonner";

import AppLoading from "@/components/AppLoading";
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
	const memoriez = useAppSelector((state) => state.attributeState.data);
	const atts = useMemo(() => {
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);

	const [open, setOpen] = useState<any>(["", null]);
	const [groupSelected, setGroupSelected] = useState<any>([]);
	const [selected, setSelected] = useState<any>([]);
	const [current, setCurrent] = useState<any>(null);
	const [search, setSearch] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	const searchAttributeMeta = async (e: any, attributeId: string) => {
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
				setLoading(false);
			}
		});
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

	const deleteCheckboxValue = async (frm: any, item: any, v: any, i: number, j: number, child: any) => {
		const getIndex = frm?.value?.findIndex((i: any) => i?.id === v?.id);
		if (getIndex !== -1) {
			const newValue = frm?.value?.filter((_: any, index: number) => index !== getIndex);
			// Remove item from selected
			const updatedChildren = child.map((child: any, i: number) => {
				if (i === j) {
					return {
						...child,
						value: newValue,
					};
				}
				return child;
			});
			setSelected((prev: any) => {
				const newSelected = [...prev];
				const index = newSelected.findIndex((i: any) => i.id === item?.id);
				if (index !== -1) {
					newSelected[index].children[i] = updatedChildren;
				}
				return newSelected;
			});
		} else {
			toast.error("Item not found");
		}
	};

	const handleUpdateInput = async (frm: any, item: any, value: any, i: number, j: number, child: any) => {
		const _item = {
			id: frm?.id,
			title: frm?.title,
			value: value,
		};
		const updatedChildren = child.map((child: any, i: number) => {
			if (i === j) {
				return {
					...child,
					value: _item,
				};
			}
			return child;
		});
		setSelected((prev: any) => {
			const newSelected = [...prev];
			const index = newSelected.findIndex((i: any) => i.id === item?.id);
			if (index !== -1) {
				newSelected[index].children[i] = updatedChildren;
			}
			return newSelected;
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
					value: "",
				};
				_data.push(_item);
			});
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
	};

	const handleDuplicateAttributeMeta = async (item: any, index: number, i: number) => {
		const children = selected[index]?.children;
		setSelected((prev: any) => {
			const newSelected = [...prev];
			const newChildren = [...children, item];
			newSelected[index].children = newChildren;
			return newSelected;
		});
	};

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
				{atts?.length > 0 && (
					<div className="ml-auto flex items-center space-x-2">
						<Info className={`w-4 h-4 text-red-500 ${selected === current ? "hidden" : ""}`} />
						<Button
							type="button"
							disabled={selected === current}
							onClick={saveAttributeMeta}>
							Save
						</Button>
					</div>
				)}
			</div>

			<div className="flex flex-col space-y-4">
				{/* Loop through selected attributes */}
				{selected?.map((item: any, index: number) => (
					<Fragment key={index}>
						<div className="flex flex-col">
							<div className="flex items-center justify-between group bg-gray-100 px-2 py-2 rounded-lg dark:bg-gray-900">
								<div className="text-lg font-bold pl-1">{item?.title}</div>
								<div className="ml-auto">
									<div className="flex items-center space-x-2">
										<DropdownMenu>
											<DropdownMenuTrigger className="cursor-pointer px-1 text-gray-500 dark:text-gray-400">
												<PlusCircle className="w-6 h-6" />
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="dark:bg-gray-800 dark:border-gray-700">
												<DropdownMenuItem
													className="cursor-pointer flex items-center space-x-2"
													onClick={() => {
														// Add new attribute
														handleAddAttributeMeta(item);
													}}>
													<Plus className="w-4 h-4" />
													<span>Add New {item?.title}</span>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer flex items-center space-x-2 text-red-600"
													onClick={() => {
														// Delete attribute
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
						{/* Loop through children */}
						<div
							id={`father_${item?.id}`}
							className="flex flex-col space-y-1 whitespace-nowrap">
							{item?.children?.map((child: any, i: number) => (
								<div
									key={i}
									className={`grid grid-cols-${child?.length} gap-5 border py-2 px-3 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-600 relative px-10`}
									style={{ gridTemplateColumns: `repeat(${child?.length}, 1fr)` }}>
									<div className="group absolute left-2 top-1/2 transform -translate-y-1/2 pl-1">
										<div
											className="flex items-center space-x-2 cursor-pointer"
											onClick={() => {
												handleDuplicateAttributeMeta(selected[index]?.children[i], index, i);
											}}>
											<Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
										</div>
									</div>

									{child?.map((frm: any, j: number) => (
										<Fragment key={j}>
											<div className="item flex items-center">
												{frm?.value && (
													<div className="item flex items-center justify-between group space-x-2">
														{/* IF Type is text field then show input */}
														{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "text" && (
															<div className="flex items-center space-x-2">
																<span>{frm?.title}</span>
																<Input
																	className="w-full px-2 py-0! h-7"
																	onBlur={(e) => {
																		const value = (e.target as HTMLInputElement)?.value;
																		handleUpdateInput(frm, item, value, i, j, child);
																	}}
																	onKeyDown={(e) => {
																		if (e.key === "Enter") {
																			const value = (e.target as HTMLInputElement)?.value;
																			handleUpdateInput(frm, item, value, i, j, child);
																		}
																	}}
																	defaultValue={frm?.value?.value}
																/>
															</div>
														)}
														{/* IF Type is not text field then show select/checkbox */}
														{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type !== "text" && (
															<div className="cursor-pointer flex items-center justify-between space-x-2 font-light">
																{/* Selectbox */}
																{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "select" && (
																	<div
																		className="flex items-center space-x-1 font-light"
																		onClick={() => {
																			setSearch([]);
																			setLoading(true);
																			searchAttributeMeta("", frm?.id);
																			setOpen(["search", [i, frm, item, child, j]]);
																		}}>
																		{checkStringIsTextOrColorHexOrURL(frm?.value?.value) === "color" && (
																			<>
																				<div
																					className="w-4 h-4 rounded-full border border-gray-300"
																					style={{ backgroundColor: frm?.value?.value }}></div>
																				<p className="text-sm text-gray-500 dark:text-white">{frm?.value?.value}</p>
																			</>
																		)}
																		{checkStringIsTextOrColorHexOrURL(frm?.value?.value) !== "color" && (
																			<>
																				<p className="text-sm text-gray-500 dark:text-white">{frm?.value?.value}</p>
																			</>
																		)}
																	</div>
																)}
																{/* Checkbox */}
																{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "checkbox" && (
																	<div className="flex flex-col space-y-1 font-light">
																		{/* Loop through checkbox values */}
																		{frm?.value.length > 0 &&
																			frm?.value?.map((v: any, k: number) => (
																				<div
																					key={k}
																					className="relative flex items-center group space-x-1">
																					<div
																						className="flex items-center space-x-1 font-light"
																						onClick={() => {
																							setSearch([]);
																							setLoading(true);
																							searchAttributeMeta("", frm?.id);
																							setOpen(["search", [i, frm, item, child, j]]);
																						}}>
																						{checkStringIsTextOrColorHexOrURL(v?.value) === "color" && (
																							<>
																								<div
																									className="w-4 h-4 rounded-full border border-gray-300"
																									style={{ backgroundColor: v?.value }}></div>
																								<p className="text-sm text-gray-500 dark:text-white">{v?.value}</p>
																							</>
																						)}
																						{checkStringIsTextOrColorHexOrURL(v?.value) !== "color" && (
																							<>
																								<p className="text-sm text-gray-500 dark:text-white">{v?.value}</p>
																							</>
																						)}
																					</div>
																					{/* Delete */}
																					<div className="del text-red-500 cursor-pointer">
																						<div
																							onClick={() => {
																								if (confirm("Are you sure you want to remove this item?")) {
																									deleteCheckboxValue(frm, item, v, i, j, child);
																								}
																							}}>
																							<X className="w-4 h-4" />
																						</div>
																					</div>
																				</div>
																			))}
																		{/* IF No value */}
																		{frm?.value?.length === 0 && (
																			<span
																				className="flex items-center space-x-2 cursor-pointer text-gray-500 dark:text-gray-400"
																				onClick={() => {
																					setSearch([]);
																					setLoading(true);
																					searchAttributeMeta("", frm?.id);
																					setOpen(["search", [i, frm, item, child, j]]);
																				}}>
																				<Search className="w-4 h-4" />
																				<span>{frm?.title}</span>
																			</span>
																		)}
																	</div>
																)}
															</div>
														)}
													</div>
												)}
												{/* IF Empty */}
												{!frm?.value && (
													<div className="flex items-center justify-between group space-x-2">
														{/* IF Type is text field then show input */}
														{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "text" && (
															<div className="flex items-center space-x-2">
																<span>{frm?.title}</span>
																<Input
																	className="w-full px-2 py-0! h-7"
																	onBlur={(e) => {
																		const value = (e.target as HTMLInputElement)?.value;
																		handleUpdateInput(frm, item, value, i, j, child);
																	}}
																	onKeyDown={(e) => {
																		if (e.key === "Enter") {
																			const value = (e.target as HTMLInputElement)?.value;
																			handleUpdateInput(frm, item, value, i, j, child);
																		}
																	}}
																/>
															</div>
														)}
														{/* IF Type is not text field then show select/checkbox */}
														{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type !== "text" && (
															<span
																className="flex items-center space-x-2 cursor-pointer text-gray-500 dark:text-gray-400"
																onClick={() => {
																	setSearch([]);
																	setLoading(true);
																	searchAttributeMeta("", frm?.id);
																	setOpen(["search", [i, frm, item, child, j]]);
																}}>
																<Search className="w-4 h-4" />
																<span>{frm?.title}</span>
															</span>
														)}
													</div>
												)}
											</div>
										</Fragment>
									))}

									<div className="group absolute top-2 right-2">
										<Button
											type="button"
											size="icon"
											variant="outline"
											className="text-sm flex flex-row items-center justify-center w-4 h-4 bg-transparent font-medium text-red-500 border-0 shadow-none dark:text-white"
											onClick={() => {
												if (confirm("Are you sure you want to remove this item?")) {
													// Find the parent item
													const parentIndex = selected.findIndex((i: any) => i.id === item?.id);
													if (parentIndex !== -1) {
														const newSelected = [...selected];
														newSelected[parentIndex].children = newSelected[parentIndex].children.filter((_: any, index: number) => index !== i);
														setSelected(newSelected);
													} else {
														toast.error("Item not found");
													}
												}
											}}>
											<X className="w-4 h-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</Fragment>
				))}
			</div>

			{atts?.length === 0 && (
				<div className="flex items-center justify-between py-2 text-gray-500">
					<p>No attributes found, please add attributes first</p>
				</div>
			)}

			{/* Group Selected */}
			<Dialog
				open={open[0] === "create-group"}
				defaultOpen={false}
				onOpenChange={(open) => setOpen([open ? "create-group" : "", null])}>
				<DialogTrigger asChild>
					<Button
						type="button"
						className="mt-5 mb-5">
						<Plus />
						Add Group
					</Button>
				</DialogTrigger>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>Add Group</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col">
						<Input
							placeholder="Group Name"
							className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const groupName = (e.target as HTMLInputElement)?.value;
									if (groupName) {
										const _item = {
											title: groupName,
											id: Date.now(),
											children: [],
										};
										setGroupSelected((prev: any) => {
											const newSelected = [...prev];
											newSelected.push(_item);
											return newSelected;
										});
										setOpen(["", null]);
									} else {
										toast.error("Group name is required");
									}
								}
							}}
						/>
					</div>
				</DialogContent>
			</Dialog>

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
				onOpenChange={(open) => {
					setSearch([]);
					setLoading(true);
					setOpen([open ? "search" : "", null]);
				}}>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>Search in {open[1] ? open[1][1]?.title : ""}</DialogTitle>
					</DialogHeader>
					<Command className="dark:bg-gray-800 dark:border-gray-700 border-0">
						<Input
							placeholder="Search..."
							className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const search = (e.target as HTMLInputElement)?.value;
									const parentId = open[1] ? open[1][1]?.id : "";
									searchAttributeMeta(search, parentId);
								}
							}}
						/>
						<CommandList>
							<CommandEmpty>No data found.</CommandEmpty>
							{loading && <AppLoading />}
							{!loading && (
								<>
									{search?.length > 0 && (
										<CommandGroup
											heading="Search Results"
											className="max-h-[300px] overflow-y-auto">
											{search?.map((item: any, index: number) => (
												<CommandItem
													key={index}
													value={item?.key}
													className="cursor-pointer"
													onSelect={() => {
														const childIndex = open[1][0];
														const frmIndex = open[1][4];
														const getFrmbyIndex = open[1][3][frmIndex];
														const _item = {
															id: item?.id,
															title: item?.key,
															value: item?.value,
														};
														// Check type
														const type = atts?.find((att: any) => att?.id === open[1][2]?.id)?.children?.find((c: any) => c?.id === getFrmbyIndex?.id)?.type;
														const updatedChildren = open[1][3]?.map((child: any, i: number) => {
															if (i === frmIndex) {
																// if type != checkbox then set value {} but if type == checkbox then set value [{}]
																if (type !== "checkbox") {
																	return {
																		...child,
																		value: _item,
																	};
																} else {
																	// If already exist then do not add
																	if (!child?.value) {
																		child.value = [];
																	}
																	const isExist = child?.value?.find((v: any) => v?.id === _item?.id);
																	if (isExist) {
																		toast.error("Already exist");
																		return child;
																	}
																	return {
																		...child,
																		value: [...child?.value, _item],
																	};
																}
															}
															return child;
														});
														setSelected((prev: any) => {
															const newSelected = [...prev];
															const index = newSelected.findIndex((i: any) => i.id === open[1][2]?.id);
															if (index !== -1) {
																newSelected[index].children[childIndex] = updatedChildren;
															}
															return newSelected;
														});
														setSearch([]);
														setOpen(["", null]);
													}}>
													{/* Show Color Picker */}
													{checkStringIsTextOrColorHexOrURL(item?.value) === "color" && (
														<div
															className="w-4 h-4 rounded-full border border-gray-300"
															style={{ backgroundColor: item?.value }}></div>
													)}
													{item?.key}
												</CommandItem>
											))}
										</CommandGroup>
									)}
								</>
							)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		</div>
	);
}
