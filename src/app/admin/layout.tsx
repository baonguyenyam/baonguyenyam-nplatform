import { cookies } from "next/headers";

import { AppSidebar } from "@/components/AppSidebar";
import CheckState from "@/components/site/checkState";
import Header from "@/components/site/header-admin";
import { SidebarProvider } from "@/components/ui/sidebar";

import CheckAdminState from "./checkAdminState";

export default async function AdminLayout({ children }: React.PropsWithChildren) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<main
			suppressHydrationWarning={true}
			className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
			<CheckState />
			<CheckAdminState />
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar />
				<div className="flex flex-1 flex-col bg-white z-10 dark:bg-gray-800">
					<Header />
					{children}
				</div>
			</SidebarProvider>
		</main>
	);
}
