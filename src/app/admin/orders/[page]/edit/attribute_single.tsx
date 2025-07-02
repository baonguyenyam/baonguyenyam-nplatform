import { Fragment, useEffect, useMemo, useState } from "react";
import {
	EllipsisVertical,
	Info,
	Plus,
	PlusCircle,
	Search,
	Settings,
	X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { checkStringIsTextOrColorHexOrURL } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "../actions";

export default function OrderAttribute(props: any) {
	const { data } = props;
	const memoriez = useAppSelector((state) => state.attributeState.data);
	const atts = useMemo(() => {
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);
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
		await actions
			.updateRecord(orderId, { data: orderData })
			.then((res: any) => {
				if (res.success === "success") {
					toast.success("Order attributes updated successfully");
					setCurrent(selected);
				}
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
					<p className="text-sm text-muted-foreground">
						You can add more information about this order here.
					</p>
				</div>
				<div className="ml-auto flex items-center space-x-2">
					<Info
						className={`w-4 h-4 text-red-500 ${selected === current ? "hidden" : ""}`}
					/>
					<Button
						type="button"
						disabled={selected === current}
						onClick={saveAttributeMeta}
					>
						Save
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{selected?.map((item: any, index: number) => (
					<Fragment key={index}>
						<div key={index} className="flex flex-col mb-5">
							<div className="flex items-center justify-between group bg-gray-100 px-2 py-2 rounded-lg mb-3 dark:bg-gray-900">
								<div className="text-lg font-bold pl-1">{item?.title}</div>
								<div className="ml-auto">
									<div className="flex items-center space-x-2">
										<DropdownMenu>
											<DropdownMenuTrigger className="cursor-pointer px-1 text-gray-500 dark:text-gray-400">
												<PlusCircle className="w-6 h-6" />
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="dark:bg-gray-800 dark:border-gray-700"
											>
												<DropdownMenuItem
													className="cursor-pointer flex items-center space-x-2"
													onClick={() => {
														setOpen(["child", item]);
													}}
												>
													<Plus className="w-4 h-4" />
													<span>Add New Child</span>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer flex items-center space-x-2 text-red-600"
													onClick={() => {
														if (
															confirm(
																"Are you sure you want to remove this item?",
															)
														) {
															setSelected((prev: any) =>
																prev.filter((i: any) => i !== item),
															);
															// onChange(selected.filter((i: any) => i !== item));
														}
													}}
												>
													<X className="w-4 h-4" />
													<span>Remove</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</div>
							{item?.children?.length > 0 && (
								<div
									id={`chilrend ${index}`}
									className="flex flex-col space-y-3"
								>
									{item?.children?.map((child: any, index: number) => (
										<div key={index} className="flex flex-col">
											<div className="item flex items-center justify-between group leading-relaxed">
												<div className="flex items-center justify-between space-x-2 font-semibold text-md uppercase">
													{child.title}
												</div>
												<div className="group">
													<DropdownMenu>
														<DropdownMenuTrigger className="shadow-xs hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 w-7 h-7 bg-gray-200 font-medium text-black border-2 border-gray-400 rounded-lg">
															<Plus className="w-4 h-4" />
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="dark:bg-gray-800 dark:border-gray-700"
														>
															<DropdownMenuItem
																className="cursor-pointer flex items-center space-x-2"
																onClick={() => {
																	setSearch([]);
																	setOpen(["search", [item, child]]);
																}}
															>
																<Search className="w-4 h-4" />
																<span>Search</span>
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="cursor-pointer flex items-center space-x-2 text-red-600"
																onClick={() => {
																	if (
																		confirm(
																			"Are you sure you want to remove this item?",
																		)
																	) {
																		setSelected((prev: any) =>
																			prev.map((i: any) => {
																				if (i.id === item?.id) {
																					return {
																						...i,
																						children: i.children.filter(
																							(j: any) => j !== child,
																						),
																					};
																				}
																				return i;
																			}),
																		);
																	}
																}}
															>
																<X className="w-4 h-4" />
																<span>Remove</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>
											{child?.meta && child?.meta?.length > 0 && (
												<div className="flex flex-col pt-3 pb-5 space-y-2">
													{child?.meta?.map((meta: any, index: number) => (
														<div
															key={index}
															className="flex flex-col border py-2 px-3 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-600"
														>
															<div className="item flex items-center justify-between group space-x-2">
																<div className="flex items-center justify-between space-x-2 font-light">
																	<span>{meta.key}</span>
																	<span> - </span>
																	<div className="flex items-center space-x-1 font-light">
																		{checkStringIsTextOrColorHexOrURL(
																			meta.value,
																		) === "color" && (
																			<>
																				<div
																					className="w-6 h-6 rounded-full border border-gray-300"
																					style={{
																						backgroundColor: meta.value,
																					}}
																				></div>
																				<p className="text-sm text-gray-500 dark:text-white">
																					{meta.value}
																				</p>
																			</>
																		)}
																		{checkStringIsTextOrColorHexOrURL(
																			meta.value,
																		) !== "color" && (
																			<>
																				<p className="text-sm text-gray-500 dark:text-white">
																					{meta.value}
																				</p>
																			</>
																		)}
																	</div>
																</div>
																<div className="group ml-auto">
																	<Button
																		type="button"
																		size="icon"
																		variant="outline"
																		className="text-sm flex flex-row items-center justify-center w-4 h-4 bg-transparent font-medium text-red-500 border-0 shadow-none dark:text-white"
																		onClick={() => {
																			if (
																				confirm(
																					"Are you sure you want to remove this item?",
																				)
																			) {
																				setSelected((prev: any) =>
																					prev.map((i: any) => {
																						if (i.id === item?.id) {
																							return {
																								...i,
																								children: i.children.map(
																									(j: any) => {
																										if (j.id === child.id) {
																											return {
																												...j,
																												meta: j.meta.filter(
																													(k: any) =>
																														k !== meta,
																												),
																											};
																										}
																										return j;
																									},
																								),
																							};
																						}
																						return i;
																					}),
																				);
																			}
																		}}
																	>
																		<X className="w-4 h-4" />
																	</Button>
																</div>
															</div>
														</div>
													))}
													{child?.meta?.length === 0 && (
														<div className="flex items-center justify-between py-2 text-gray-500">
															<p>No attributes found</p>
														</div>
													)}
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</Fragment>
				))}
			</div>

			<Dialog
				open={open[0] === "create"}
				defaultOpen={false}
				onOpenChange={(open) => setOpen([open ? "create" : "", null])}
			>
				<DialogTrigger asChild>
					{selected?.length < atts?.length && (
						<Button type="button" className="mt-5 mb-5">
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
								className={`flex items-center justify-between py-2 hover:text-black text-gray-500 dark:hover:text-white`}
							>
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
									disabled={selected?.find((i: any) => i.id === item?.id)}
								>
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
				open={open[0] === "child"}
				defaultOpen={false}
				onOpenChange={(open) => setOpen([open ? "child" : "", null])}
			>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>List of {open[1]?.title}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col">
						{atts
							?.find((item: any) => item?.id === open[1]?.id)
							?.children?.map((item: any, index: number) => (
								<div
									key={index}
									className="flex items-center justify-between py-2 hover:text-black text-gray-500 dark:hover:text-white"
								>
									<p>{item?.title}</p>
									<Button
										type="button"
										className="text-sm bg-black text-white hover:bg-gray-900 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white"
										onClick={() => {
											setSelected((prev: any) => {
												const newSelected = [...prev];
												const parent = newSelected.find(
													(i: any) => i.id === open[1]?.id,
												);
												if (parent?.children?.includes(item)) {
													return newSelected.map((i: any) => {
														if (i.id === open[1]?.id) {
															return {
																...i,
																children: i.children.filter(
																	(j: any) => j !== item,
																),
															};
														}
														return i;
													});
												} else {
													const _item = {
														title: item?.title,
														id: item?.id,
													};
													return newSelected.map((i: any) => {
														if (i.id === open[1]?.id) {
															return {
																...i,
																children: [...(i.children || []), _item],
															};
														}
														return i;
													});
												}
											});
										}}
										disabled={selected
											?.find((i: any) => i.id === open[1]?.id)
											?.children?.find((j: any) => j.id === item?.id)}
									>
										Select
									</Button>
								</div>
							))}
						{atts?.find((item: any) => item?.id === open[1]?.id)?.children
							?.length === 0 && (
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
				onOpenChange={(open) => setOpen([open ? "search" : "", null])}
			>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>
							Search in {open[1] ? open[1][1]?.title : ""}
						</DialogTitle>
					</DialogHeader>
					<Command className="dark:bg-gray-800 dark:border-gray-700 border-0">
						<Input
							placeholder="Search..."
							className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
							onBlur={(e) => {
								const search = (e.target as HTMLInputElement)?.value;
								const parentId = open[1] ? open[1][1]?.id : "";
								searchAttributeMeta(search, parentId);
							}}
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
							{search?.length > 0 && (
								<CommandGroup>
									{search?.map((item: any, index: number) => (
										<CommandItem
											key={index}
											value={item?.key}
											className="cursor-pointer"
											onSelect={() => {
												// [
												// 	{
												// 		"title": String,
												// 		"id": Number,
												// 		"children": [
												// 			{
												// 				"title": String,
												// 				"id": Number,
												// 				"meta": [{
												// 					"key": String,
												// 					"value": String
												// 				}]
												// 			}
												// 		]
												// 	}
												// ]
												// Now add the selected item to the meta of the children of the parent
												setSelected((prev: any) => {
													const rootId = open[1] ? open[1][0]?.id : "";
													// Find Root
													const root = prev.find((i: any) => i.id === rootId);
													const child = root?.children?.find(
														(j: any) => j.id === open[1][1]?.id,
													);
													if (child) {
														const metaExists = child.meta?.find(
															(k: any) => k.key === item?.key,
														);
														if (metaExists) {
															return prev;
														}
														return prev.map((i: any) => {
															if (i.id === rootId) {
																return {
																	...i,
																	children: i.children.map((j: any) => {
																		if (j.id === open[1][1]?.id) {
																			return {
																				...j,
																				meta: [
																					...(j.meta || []),
																					{
																						key: item?.key,
																						value: item?.value,
																					},
																				],
																			};
																		}
																		return j;
																	}),
																};
															}
															return i;
														});
													} else {
														const _item = {
															title: open[1][1]?.title,
															id: open[1][1]?.id,
															meta: [
																{
																	key: item?.key,
																	value: item?.value,
																},
															],
														};
														return prev.map((i: any) => {
															if (i.id === rootId) {
																return {
																	...i,
																	children: [...(i.children || []), _item],
																};
															}
															return i;
														});
													}
												});
											}}
										>
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
