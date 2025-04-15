"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { appState, FooterItems, MenuItems } from "@/lib/appConst";
import { useAppSelector } from "@/store";

const FormSchema = z.object({
	f_s: z.string().min(2, {
		message: "Fullname must be at least 2 characters.",
	}),
});

export function AppSidebar() {
	const role = useCurrentRole();
	const _state = useAppSelector((state) => state.appState) as { title?: string };
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_s: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const search = values.f_s;
		if (search) {
			window.location.href = `/admin/search?s=${search}`;
		}
	}
	return (
		<Sidebar
			variant="sidebar"
			collapsible="icon"
			className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 h-screen border-r dark:border-gray-800">
			<SidebarHeader className="flex items-center justify-between">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/">
								<span className="text-base font-semibold">{_state?.title ?? appState?.appName}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarGroup className="py-0">
					<SidebarGroupContent className="relative">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-6">
								<FormField
									control={form.control}
									name="f_s"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<SidebarInput
													className="pl-8 dark:bg-gray-800 dark:text-gray-200"
													placeholder="Search the docs..."
													{...field}
												/>
											</FormControl>
											<Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{MenuItems.map((item) => (
								<div key={item.title}>
									{role && (item?.role ?? []).includes(role) && (
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href={item.url}>
													<item.icon />
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)}
								</div>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroupContent>
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<SidebarMenu>
						{FooterItems.map((item) => (
							<div key={item.title}>
								{role && (item?.role ?? []).includes(role) && (
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<a href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)}
							</div>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarFooter>
		</Sidebar>
	);
}
