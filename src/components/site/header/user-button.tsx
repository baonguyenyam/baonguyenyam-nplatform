"use client";

import Link from "next/link";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UserButton(props: any) {
	const { data } = props;
	return (
		<div className="flex items-center gap-2">
			{!data?.user && (
				<>
					<span className="text-sm inline-flex">Welcome, {data?.user ? data?.user?.name : "Guest"}!</span>
					<Link
						href="/authentication/login"
						className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
						Login
					</Link>
				</>
			)}
			{data?.user && (
				<DropdownMenu>
					<DropdownMenuTrigger className="text-sm inline-flex">Hello, {data?.user?.name}!</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="dark:bg-gray-800 dark:border-gray-700">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link href="/admin">Admin Dashboard</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href="/authentication/logout">Logout</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
