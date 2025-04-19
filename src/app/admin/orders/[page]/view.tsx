import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import AppLoading from "@/components/AppLoading";
import { ImageList } from "@/components/fields/imagelist";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { checkAllObjectEmpty, checkIsStringOrJson, convertStringToJson, dateFormat, removeUnderscoreAndDash } from "@/lib/utils";

import * as actions from "./actions";
import OrderAttributeView from "./attribute_group_view";

export default function FormView(props: any) {
	const { id, onChange } = props;
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any>(null);
	const [thumbnail, setThumbnail] = useState<any>(null);
	const role = useCurrentRole();

	const fetchData = useCallback(async () => {
		const res = await actions.getRecord(id);
		if (res?.success === "success" && res?.data) {
			setData(res.data);
			console.log("res.data", res.data);
			setThumbnail(res?.data?.image);
			setLoading(false);
		} else {
			setData(null);
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (id) {
			fetchData();
		} else {
			setLoading(false);
		}
	}, [fetchData, id]);

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<div className="flex flex-col gap-4 xl:flex-row xl:gap-10">
					<div className="w-full xl:w-1/2">
						<OrderAttributeView data={data} />
						<h2 className="text-lg font-bold mb-5">Mics</h2>
						{/* data?meta */}
						<div className="space-y-5 grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-10">
							{data?.meta &&
								data?.meta?.length > 0 &&
								data?.meta?.map((item: any, index: number) => (
									<Fragment key={index}>
										{!checkAllObjectEmpty(data?.meta, 'value') && (
											<div className="flex flex-col">
												{item?.key === "order_attributes" && item?.value?.length > 0 && (
													<>
														{convertStringToJson(item?.value)?.map((item: any, index: number) => (
															<Fragment key={index}>
																<label className="text-xs font-semibold mb-2 uppercase text-gray-500">{removeUnderscoreAndDash(item?.key, "order")}</label>
																<div
																	key={index}
																	className="flex flex-col">
																	{item?.value}
																</div>
															</Fragment>
														))}
													</>
												)}
												{item?.key !== "order_attributes" && item?.value?.length > 0 && (
													<>
														<label className="text-xs font-semibold mb-2 uppercase text-gray-500">{removeUnderscoreAndDash(item?.key, "order")}</label>
														<div className="flex flex-col">{item?.value}</div>
													</>
												)}
											</div>
										)}
									</Fragment>
								))}
							{/* All value in meta is empty  */}
						</div>
						{checkAllObjectEmpty(data?.meta, 'value') && (
							<div className="flex p-3 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 mb-10">
								<p>No meta data available for this order.</p>
							</div>
						)}
					</div>
					<div className="w-full xl:w-1/2 grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-10">
						<div className="group">
							<h2 className="text-lg font-bold mb-5">Order Details</h2>
							<div className="space-y-5">
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Customer</label>
										<div className="space-y-3">
											{data?.customer &&
												data?.customer?.map((item: any) => (
													<div
														key={item.id}
														className="flex flex-col">
														{item?.name}
														{item?.email && <span className="text-xs text-gray-500">({item?.email})</span>}
													</div>
												))}
										</div>
										{data?.customer?.length === 0 && <div className="text-xs text-gray-500">No customer assigned</div>}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Vendor</label>
										<div className="space-y-3">
											{data?.vendor &&
												data?.vendor?.map((item: any) => (
													<div
														key={item.id}
														className="flex flex-col">
														{item?.name}
														{item?.email && <span className="text-xs text-gray-500">({item?.email})</span>}
													</div>
												))}
										</div>
										{data?.vendor?.length === 0 && <div className="text-xs text-gray-500">No vendor assigned</div>}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Category</label>
										{data?.categories &&
											data?.categories?.map((item: any) => (
												<div
													key={item.id}
													className="flex flex-col">
													{item?.title}
												</div>
											))}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Note</label>
										<div dangerouslySetInnerHTML={{ __html: data?.content || "-" }} />
									</div>
								</div>
							</div>
						</div>
						<div className="group">
							<h2 className="text-lg font-bold mb-5">Order Info</h2>
							<div className="space-y-5">
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Date Created</label>
										{data?.date_created ? dateFormat(data?.date_created) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Date Production</label>
										{data?.date_production ? dateFormat(data?.date_production) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Date Completed</label>
										{data?.date_completed ? dateFormat(data?.date_completed) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Date Returned</label>
										{data?.date_returned ? dateFormat(data?.date_returned) : "-"}
									</div>
								</div>
							</div>
							<h2 className="text-lg font-bold mb-5 mt-10">Shipping Info</h2>
							<div className="space-y-5">
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Date Shipped</label>
										{data?.date_shipped ? dateFormat(data?.date_shipped) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-xs font-semibold mb-2 uppercase text-gray-500">Date Delivered</label>
										{data?.date_delivered ? dateFormat(data?.date_delivered) : "-"}
									</div>
								</div>
							</div>
						</div>

						<div className="user col-span-2">
							<h2 className="text-lg font-bold mb-5">Users</h2>
							<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-10">
								<div className="group">
									<p className="text-xs font-semibold mb-2 uppercase text-gray-500">Manager</p>
									<div className="flex flex-col">
										<div className="space-y-0">
											{data?.user_manager &&
												data?.user_manager?.map((item: any) => (
													<div
														key={item.id}
														className="flex flex-col">
														{item?.name}
														{item?.email && <span className="text-xs text-gray-500">({item?.email})</span>}
													</div>
												))}
										</div>
										{data?.user_manager?.length === 0 && <div className="text-xs text-gray-500">No manager assigned</div>}
									</div>
								</div>
								<div className="group">
									<p className="text-xs font-semibold mb-2 uppercase text-gray-500">Product</p>
									<div className="flex flex-col">
										<div className="space-y-0">
											{data?.user_product &&
												data?.user_product?.map((item: any) => (
													<div
														key={item.id}
														className="flex flex-col">
														{item?.name}
														{item?.email && <span className="text-xs text-gray-500">({item?.email})</span>}
													</div>
												))}
										</div>
										{data?.user_product?.length === 0 && <div className="text-xs text-gray-500">No product assigned</div>}
									</div>
								</div>
								<div className="group">
									<p className="text-xs font-semibold mb-2 uppercase text-gray-500">Shipping</p>
									<div className="flex flex-col">
										<div className="space-y-0">
											{data?.user_shipping &&
												data?.user_shipping?.map((item: any) => (
													<div
														key={item.id}
														className="flex flex-col">
														{item?.name}
														{item?.email && <span className="text-xs text-gray-500">({item?.email})</span>}
													</div>
												))}
										</div>
										{data?.user_shipping?.length === 0 && <div className="text-xs text-gray-500">No shipping assigned</div>}
									</div>
								</div>
								<div className="group">
									<p className="text-xs font-semibold mb-2 uppercase text-gray-500">Creator</p>
									<div className="flex flex-col">
										<div className="space-y-0">
											{data?.user &&
												data?.user?.map((item: any) => (
													<div
														key={item.id}
														className="flex flex-col">
														{item?.name}
														{item?.email && <span className="text-xs text-gray-500">({item?.email})</span>}
													</div>
												))}
										</div>
										{data?.user?.length === 0 && <div className="text-xs text-gray-500">No user assigned</div>}
									</div>
								</div>
							</div>
						</div>

						<div className="medias col-span-2">
							<h2 className="text-lg font-bold mb-5">Images</h2>
							{ImageList({
								role,
								data: data,
								thumbnail,
								setThumbnail,
								fetchData,
								viewOnly: true,
							})}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
