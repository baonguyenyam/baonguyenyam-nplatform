"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import AppLoading from "@/components/AppLoading";
import { Button } from "@/components/ui/button";
import { enumOrderType } from "@/lib/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";
import { setAttribute } from "@/store/attributeSlice";

import * as actions from "./actions";
import { Switch } from "@/components/ui/switch";

export default function View() {
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	const [loading, setLoading] = useState(true);
	const attrs = useAppSelector((state) => state.attributeState.data);
	const att_orders = useMemo(() => attrs?.filter((item: any) => item.mapto === "order"), [attrs]);

	const fetchData = useCallback(async () => {
		const all = await actions.getAll({ min: true, published: true });
		if (all?.data) {
			dispatch(setAttribute(all?.data));
		}
		setLoading(false);
	}, [dispatch]);

	const template = (item: any) => {
		return (
			<>
				{item && item.length > 0 ? (
					item.map((item: any) => (
						<div
							key={item.id}
							className="mb-4 text-sm gap-4">
							<div className="mb-4">
								<h3 className="text-xl font-semibold mb-2 flex items-center gap-2 border-b pb-2 mb-5">
									<span>{item.title}</span>
								</h3>
								<div className="space-y-2">
									{item.children.map((child: any) => (
										<div key={child.id}>
											<div
												key={child.id}
												className="flex items-center gap-2">
												<Lock className="w-4 h-4" />
												<strong>{child.title}</strong>
											</div>
											<div className="ml-6 mt-2 mb-5 flex flex-wrap gap-2">
												{enumOrderType.map((type) => (
													<div
														className=""
														key={type.value}>
														<div className="flex items-center gap-2 text-sm">
															{/* <input
																type="checkbox"
																className="form-checkbox h-4 w-4 border-gray-300 rounded"
																id={`${child.id}-${type.value}`}
																name={`${child.id}-${type.value}`}
																value={type.value}
																checked={child.attributes?.includes(type.value)}
															/> */}
															<Switch
																id={`${child.id}-${type.value}`}
																name={`${child.id}-${type.value}`}
																defaultChecked={child.attributes?.includes(type.value)}
																checked={child.attributes?.includes(type.value)}
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
			</>
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
