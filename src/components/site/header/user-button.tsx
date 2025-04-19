"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UserButton(props: any) {
	const { data } = props;
	const { setTheme } = useTheme();

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
			<Button
				variant="outline"
				onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
				className="relative h-8 w-8 p-0 dark:bg-gray-900 dark:border-gray-700"
				size="icon">
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		</div>
	);
}
