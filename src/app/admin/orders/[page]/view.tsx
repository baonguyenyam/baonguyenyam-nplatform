import { Fragment, useCallback, useEffect, useState } from "react";

import AppLoading from "@/components/AppLoading";
import { ImageList } from "@/components/fields/imagelist";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { checkAllObjectEmpty, convertStringToJson, dateFormat, removeUnderscoreAndDash } from "@/lib/utils";

import AttributeDetail from "./view/attribute_detail";
import AttributeMisc from "./view/attribute_misc";
import AttributeRoot from "./view/attribute_root";
import AttributeTab from "./view/attribute_tab";
import * as actions from "./actions";

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
						<AttributeRoot data={data} />
						<AttributeTab data={data} />
						<AttributeMisc data={data} />
					</div>
					<div className="w-full xl:w-1/2 grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-10">
						<AttributeDetail data={data} />
					</div>
				</div>
			)}
		</>
	);
}
