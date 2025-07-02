"use client";

import { useCallback, useEffect, useState } from "react";
import { Render } from "@measured/puck";

import AppLoading from "@/components/AppLoading";
import config from "@/components/pagebuilder/config";

export default function Fetch(props: any) {
	const { data } = props;
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		if (data) {
			setLoading(false);
		}
	}, [data]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			{loading && (
				<div className="flex h-screen w-full p-5">
					<AppLoading />
				</div>
			)}
			{!loading && <Render config={config} data={JSON.parse(data?.data)} />}
		</>
	);
}
