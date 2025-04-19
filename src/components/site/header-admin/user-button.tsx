"use client";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { appState } from "@/lib/appConst";

import { SignIn, SignOut } from "./auth-components";

export default function UserButton() {
	const { data: session } = useSession();
	const data = session?.user;
	const { setTheme } = useTheme();
	const router = useRouter();

	if (!session?.user) return <SignIn />;
	return (
		<div className="flex items-center gap-6">
			<div className="flex items-center gap-2">
				<span className="hidden text-sm sm:inline-flex">{data?.name}</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-8 w-8 rounded-full">
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={data?.image ?? appState?.placeholder}
									alt={data?.name ?? ""}
								/>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="dark:bg-gray-800 dark:border-gray-700"
						forceMount>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">{data?.name}</p>
								<p className="text-muted-foreground text-xs leading-none">{data?.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuLabel>
							<Button
								variant="outline"
								asChild>
								<span
									onClick={() => router.push("/admin/account")}
									className="flex w-full cursor-pointer">
									My Account
								</span>
							</Button>
						</DropdownMenuLabel>
						<DropdownMenuLabel>
							<SignOut className="w-full" />
						</DropdownMenuLabel>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
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
