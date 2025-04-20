"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import AppLoading from "@/components/AppLoading";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { enumOrderType } from "@/lib/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";
import { setAttribute } from "@/store/attributeSlice";

import * as actions from "./actions";

export default function View() {
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	const [loading, setLoading] = useState(true);
	const memoriezAttrs = useAppSelector((state) => state.attributeState.data);
	const att_orders = useMemo(() => memoriezAttrs?.filter((item: any) => item.mapto === "order"), [memoriezAttrs]);
	const memoriezPermission = useAppSelector((state) => (state.appState && "order_permission" in state.appState ? state.appState.order_permission : []));
	const orderPermission = useMemo(() => {
		return memoriezPermission as Array<{ id: number; permission: Array<{ key: string; checked: boolean }> }>;
	}, [memoriezPermission]);

	const fetchData = useCallback(async () => {
		const all = await actions.getAll({ min: true, published: true });
		if (all?.data) {
			dispatch(setAttribute(all?.data));
		}
		setLoading(false);
	}, [dispatch]);

	const template = (item: any) => {
		return (
			<div className="w-full overflow-auto">
				{item && item.length > 0 ? (
					item.map((item: any) => (
						<div
							key={item.id}
							className="mb-4 text-sm gap-4">
							<div className="mb-4">
								<h3 className="text-xl font-semibold mb-2 flex items-center gap-2 border-b pb-2 mb-5">
									<span>{item.title}</span>
								</h3>
								<div className="flex flex-row items-center gap-10">
									{item.children.map((child: any) => (
										<div key={child.id}>
											<div
												key={child.id}
												className="flex items-center gap-2 uppercase text-xs">
												<strong>{child.title}</strong>
											</div>
											<div className="mt-2 mb-5 flex flex-col space-y-1">
												{enumOrderType.map((type) => (
													<div
														className=""
														key={type.value}>
														<div className="flex items-center gap-2 text-xs">
															{/* <Switch
																className="mr-2"
																id={`${child.id}-${type.value}`}
																name={`${child.id}-${type.value}`}
																onCheckedChange={(checked) => {
																	///
																}}
															/> */}
															<input
																type="checkbox"
																id={`${child.id}-${type.value}`}
																name={`${child.id}-${type.value}`}
															/>
															<label htmlFor={`${child.id}-${type.value}`}>{type.label}</label>
														</div>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					))
				) : (
					<p>No attributes found for user.</p>
				)}
			</div>
		);
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<div className="flex flex-col my-10">
					{template(att_orders)}
					<div className="flex">
						<Button
							className="mt-4 px-4 py-2 inline-flex"
							onClick={async () => {
								// {
								// 	item: Number,
								// 	children: [
								// 		{
								// 			id: Number,
								// 			permission: [
								// 				stringArray
								// 			]
								// 		},
								// 	],
								// }

								// Save Data to DB
								const data = att_orders.map((item: any) => {
									return {
										id: item.id,
										title: item.title,
										children: item.children.map((child: any) => {
											return {
												id: child.id,
												permission: enumOrderType.map((type) => {
													return {
														key: type.value,
														checked: (document.getElementById(`${child.id}-${type.value}`) as HTMLInputElement)?.checked,
													};
												}),
											};
										}),
									};
								});

								const json = JSON.stringify(data);

								const _body = {
									order_permission: json,
								};

								const update = await actions.updateAllRecord(_body);
								if (update?.success !== "success") {
									toast.error(update.message);
									return;
								}
								toast.success("Order permission updated successfully");

								// Save to appState
								dispatch(SET_APP_STATE({ order_permission: data }));
							}}>
							Save Changes
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
