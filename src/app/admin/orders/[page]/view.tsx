import { useCallback, useEffect, useMemo, useState } from "react";

import AppLoading from "@/components/AppLoading";
import { ImageList } from "@/components/fields/imagelist";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { dateFormat } from "@/lib/utils";

import * as actions from "./actions";
import OrderAttribute from "./attribute_group_view";

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
			setThumbnail(res?.data?.image);
			setLoading(false);
			console.log("res.data", res.data);
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
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-10">
					<div className="item">
						<OrderAttribute data={data} />
						{ImageList({
							role,
							data: data,
							thumbnail,
							setThumbnail,
							fetchData,
							viewOnly: true,
						})}
					</div>
					<div className=" grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-10">
						<div className="group">
							<h2 className="text-lg font-bold mb-5">Order Details</h2>
							<div className="space-y-5">
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Customer</label>
										{data?.customer && data?.customer?.map((item: any) => (
											<div key={item.id} className="flex items-center">
												{item?.name}
												{item?.email && (
													<span className="text-xs text-gray-500 ml-2">
														({item?.email})
													</span>
												)}
											</div>
										))}
										{data?.customer?.length === 0 && (
											<div className="text-xs text-gray-500">
												No customer assigned
											</div>
										)}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Date Created</label>
										{data?.date_created ? dateFormat(data?.date_created) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Date Production</label>
										{data?.date_production ? dateFormat(data?.date_production) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Date Shipped</label>
										{data?.date_shipped ? dateFormat(data?.date_shipped) : "-"}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Date Delivered</label>
										{data?.date_delivered ? dateFormat(data?.date_delivered) : "-"}
									</div>
								</div>
							</div>
						</div>
						<div className="group">
							<h2 className="text-lg font-bold mb-5">Order Info</h2>
							<div className="space-y-5">
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Category</label>
										{data?.categories && data?.categories?.map((item: any) => (
											<div key={item.id} className="flex items-center">
												{item?.title}
											</div>
										))}
									</div>
								</div>
								<div className="group">
									<div className="flex flex-col">
										<label className="text-sm font-semibold mb-2">Note</label>
										<div dangerouslySetInnerHTML={{ __html: data?.content || '-' }} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
