"use client";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function MainNav(props: any) {
	const { data } = props;
	return (
		<div className="flex items-center gap-4">
			<NavigationMenu>
				<NavigationMenuList className="flex gap-4">
					<NavigationMenuItem>
						<NavigationMenuList className="gap-10">
							<NavigationMenuItem>
								<NavigationMenuLink
									href="/blogs"
									className={cn(
										"relative group inline-flex h-9 w-max items-center justify-center px-0.5 py-2 text-sm font-medium",
										"before:absolute before:bottom-0 before:inset-x-0 before:h-[2px] before:bg-primary before:scale-x-0 before:transition-transform",
										"hover:before:scale-x-100 hover:text-accent-foreground",
										"focus:before:scale-x-100 focus:text-accent-foreground focus:outline-none",
										"disabled:pointer-events-none disabled:opacity-50",
										"data-[active]:before:scale-x-100 data-[state=open]:before:scale-x-100",
										"hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
									)}
								>
									Blogs
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
