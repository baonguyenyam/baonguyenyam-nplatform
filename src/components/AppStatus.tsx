"use client";

import { useEffect } from "react";

import { enumOrderStatus } from "@/lib/enum";
import { cn } from "@/lib/utils";

export default function AppStatus(props: any) {

	const { data } = props;
	const status = enumOrderStatus.find((item) => item.value === data);

	const label = status?.label ? status.label : "Unknown";
	const className = status?.className ? status.className : "text-gray-700";
	const bgClassName = status?.bgClassName ? status.bgClassName : "bg-gray-100";
	const border = status?.borderClassName ? status.borderClassName : "border-gray-700";
	const IconComponent = status?.icon ? status.icon : null;

	useEffect(() => {
	}, []);

	return (
		<>
			<div className={cn(
				"inline-flex flex-row items-center px-3 py-1 rounded-full border space-x-1",
				`${bgClassName} ${border}`,
				`${className}`,
			)}>
				{IconComponent && (
					<IconComponent className="w-4 h-4 mr-1" />
				)}
				<span className={`text-sm`}>{label}</span>
			</div>
		</>
	);
}