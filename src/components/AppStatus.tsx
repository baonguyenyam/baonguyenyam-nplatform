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
	const size = props.size ? props.size : "default";

	useEffect(() => {}, []);

	return (
		<>
			<div className={cn(size === "small" ? "inline-flex flex-row items-center px-2 py-[0.15em] rounded-full border space-x-1" : "inline-flex flex-row items-center px-3 py-1 rounded-full border space-x-1", `${bgClassName} ${border}`, `${className}`)}>
				{IconComponent && <IconComponent className={size === "small" ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1"} />}
				<span className={size === "small" ? "text-xs" : "text-sm"}>{label}</span>
			</div>
		</>
	);
}
