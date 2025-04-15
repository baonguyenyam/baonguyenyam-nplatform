"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { appState } from "@/lib/appConst";

export function MainLogo(props: any) {
	const { data } = props;
	return (
		<div className="flex items-center gap-4">
			<NavigationMenu>
				<NavigationMenuList className="flex gap-4">
					<NavigationMenuItem className="font-semibold">{appState.appName}</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
