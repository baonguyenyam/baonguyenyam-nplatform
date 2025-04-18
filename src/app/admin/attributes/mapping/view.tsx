"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AppLoading from "@/components/AppLoading";
import { useAppSelector } from "@/store";

export default function View() {
	const [loading, setLoading] = useState(true);
	const attrs = useAppSelector((state) => state.attributeState.data);
	const att_users = useMemo(() => attrs.filter((item: any) => item.mapto === "user"), [attrs]);
	const att_orders = useMemo(() => attrs.filter((item: any) => item.mapto === "order"), [attrs]);
	const att_posts = useMemo(() => attrs.filter((item: any) => item.mapto === "post"), [attrs]);

	const fetchData = useCallback(async () => {
		setLoading(false);
	}, []);

	const template = (item: any) => {
		return (
			<>
				{item.length > 0 ? (
					item.map((item: any) => (
						<div
							key={item.id}
							className="mb-4">
							<div className="border border-gray-300 rounded-lg p-4 mb-4">
								<h3 className="text-xl font-semibold mb-2">{item.title}</h3>
								{item.children.map((child: any) => (
									<div
										key={child.id}
										className="ml-4 mb-2">
										{child.title} ({child.type})
									</div>
								))}
							</div>
						</div>
					))
				) : (
					<div className="border border-gray-300 rounded-lg p-4 mb-4">
						<p>No attributes found for user.</p>
					</div>
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
				<div className="mt-5">
					<h2 className="text-2xl font-semibold mb-4">User</h2>
					{template(att_users)}
					<h2 className="text-2xl font-semibold mb-4">Order</h2>
					{template(att_orders)}
					<h2 className="text-2xl font-semibold mb-4">Post</h2>
					{template(att_posts)}
				</div>
			)}
		</>
	);
}
