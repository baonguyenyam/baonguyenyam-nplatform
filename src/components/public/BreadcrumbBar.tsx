"use client";

import { Fragment } from "react";
import { Home } from "lucide-react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAppSelector } from "@/store";

export default function BreadcrumbBar() {
	const breadcrumb = useAppSelector((state) => state?.breadcrumbState?.data);
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					{/* <BreadcrumbLink href="/"><Home className="h-4 w-4" /></BreadcrumbLink> */}
					<BreadcrumbLink href="/">Home</BreadcrumbLink>
				</BreadcrumbItem>
				{breadcrumb?.map((item: any, index: number) => (
					<Fragment key={index}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
