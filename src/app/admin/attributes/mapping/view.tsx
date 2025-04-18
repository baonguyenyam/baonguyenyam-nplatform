"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Construction, Divide, Dot, Folder, List, ListCollapse, Minus, StretchHorizontal } from "lucide-react";

import AppLoading from "@/components/AppLoading";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store";

export default function View() {
	const [loading, setLoading] = useState(true);
	const attrs = useAppSelector((state) => state.attributeState.data);
	const att_users = useMemo(() => attrs?.filter((item: any) => item.mapto === "user"), [attrs]);
	const att_orders = useMemo(() => attrs?.filter((item: any) => item.mapto === "order"), [attrs]);
	const att_posts = useMemo(() => attrs?.filter((item: any) => item.mapto === "post"), [attrs]);

	console.log("att_users", att_users);

	const fetchData = useCallback(async () => {
		setLoading(false);
	}, []);

	const template = (item: any) => {
		return (
			<>
				{item && item.length > 0 ? (
					item.map((item: any) => (
						<div
							key={item.id}
							className="mb-4 text-sm gap-4">
							<div className="mb-4">
								<h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
									<Construction className="w-4 h-4" />
									<span>{item.title}</span>
								</h3>
								<div className="space-y-2">
									{item.children.map((child: any) => (
										<div
											key={child.id}>
											<div
												key={child.id}
												className="flex items-center gap-2">
												<Folder className="w-4 h-4" />
												<span>
													{child.title}
												</span>
												<Badge
													className="text-xs text-gray-500 dark:text-gray-400"
													variant="outline"
													color="primary"
												>
													{child.type}
												</Badge>
												{child.type !== 'text' && (
													<div className="flex items-center gap-1 text-xs">
														<Minus className="w-4 h-4" />
														<span>{child._count.meta}</span>
													</div>
												)}
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
				<div className="mt-5">
					<h2 className="text-2xl font-semibold mb-4">User</h2>
					<div className="grid grid-cols-2 xl:grid-cols-3 border border-gray-300 rounded-lg p-10 mb-10">{template(att_users)}</div>
					<h2 className="text-2xl font-semibold mb-4">Order</h2>
					<div className="grid grid-cols-2 xl:grid-cols-3 border border-gray-300 rounded-lg p-10 mb-10">{template(att_orders)}</div>
					<h2 className="text-2xl font-semibold mb-4">Post</h2>
					<div className="grid grid-cols-2 xl:grid-cols-3 border border-gray-300 rounded-lg p-10 mb-10">{template(att_posts)}</div>
				</div>
			)}
		</>
	);
}
