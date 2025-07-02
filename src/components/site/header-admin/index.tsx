"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { appState } from "@/lib/appConst";
import { useAppSelector } from "@/store";

import UserButton from "./user-button";

export default function Header() {
	const breadcrumb = useAppSelector((state) => state?.breadcrumbState?.data);
	const _state = useAppSelector((state) => state.appState) as {
		title?: string;
	};
	const router = useRouter();

	return (
		<header className="sticky h-16 py-5 flex justify-center border-b gap-2 dark:border-b-gray-700 bg-white dark:bg-gray-800 z-10">
			<div className="mx-auto flex w-full items-center justify-between px-4">
				<SidebarTrigger />
				<Separator orientation="vertical" className="ml-3 mr-4 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem
							className="cursor-pointer hover:text-black dark:hover:text-white"
							onClick={() => router.push("/admin/")}
						>
							{_state?.title ?? appState?.appName}
						</BreadcrumbItem>
						{breadcrumb?.map((item: any, index: number) => (
							<Fragment key={index}>
								<BreadcrumbSeparator />
								<BreadcrumbItem
									className="cursor-pointer hover:text-black dark:hover:text-white"
									onClick={() => router.push(item.href)}
								>
									{item.title}
								</BreadcrumbItem>
							</Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="flex items-center space-x-4 ml-auto">
					<UserButton />
				</div>
			</div>
		</header>
	);
}
