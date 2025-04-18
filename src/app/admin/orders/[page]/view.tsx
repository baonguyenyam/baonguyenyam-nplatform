import { useCallback, useEffect, useMemo, useState } from "react";

import AppLoading from "@/components/AppLoading";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useAppSelector } from "@/store";

import * as actions from "./actions";
import OrderAttribute from "./attribute_group_view";

export default function FormView(props: any) {
	const { id, onChange } = props;
	const memoriez = useAppSelector((state) => state.categoriesState.data);
	const categories = useMemo(() => {
		return memoriez.filter((item: any) => item.type === "order");
	}, [memoriez]);
	const [users, setUsers] = useState<any>([]);
	const [customers, setCustomers] = useState<any>([]);
	const [vendors, setVendors] = useState<any>([]);
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
					<div className="item"><OrderAttribute data={data} /></div>
					<div className="item">ádsadá</div>
				</div>
			)}
		</>
	);
}
