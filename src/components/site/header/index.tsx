import { auth } from "@/auth";

import { MainLogo } from "./main-logo";
import { MainNav } from "./main-nav";
import UserButton from "./user-button";

export default async function Header() {
	const session = await auth();
	return (
		<header className="sticky flex justify-center border-b dark:border-gray-700 bg-white dark:bg-gray-900">
			<div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6">
				<MainLogo data={session} />
				<MainNav data={session} />
				<UserButton data={session} />
			</div>
		</header>
	);
}
