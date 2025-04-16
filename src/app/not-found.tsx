import type { Metadata } from "next";
import Link from "next/link";

import { appState } from "@/lib/appConst";

export const metadata: Metadata = {
	title: {
		template: "%s | Page Not Found",
		default: "Page Not Found",
	},
	description: "The page you are looking for does not exist.",
};

export default async function Index() {
	return (
		<div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900 bg-gray-100">
			<div className="flex justify-center min-w-full max-w-[500px] flex-col items-center gap-4 p-4">
				<div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-background p-4 shadow-lg dark:bg-gray-800">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
					<div className="relative z-10 h-full rounded-lg border bg-background p-4 overflow-hidden dark:bg-gray-800 dark:border-gray-500">
						<div className="flex items-center justify-between border-b pb-2 dark:border-gray-500">
							<div className="text-sm font-medium">{appState.appName}</div>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-red-500" />
								<div className="h-2 w-2 rounded-full bg-yellow-500" />
								<div className="h-2 w-2 rounded-full bg-green-500" />
							</div>
						</div>
						<div className="mt-4 grid gap-2">
							<div className="h-2 w-3/4 rounded bg-muted dark:bg-gray-900" />
							<div className="h-2 w-1/2 rounded bg-muted dark:bg-gray-900" />
							<div className="mt-2 grid grid-cols-2 gap-2">
								<div className="h-20 rounded bg-muted dark:bg-gray-900" />
								<div className="h-20 rounded bg-muted dark:bg-gray-900" />
							</div>
							<div className="mt-2 h-32 rounded bg-muted dark:bg-gray-900" />
						</div>
					</div>
				</div>
			</div>
			<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
			<p className="mt-4 text-lg">The page you are looking for does not exist.</p>
			<Link
				href="/"
				className="mt-6 text-black underline dark:text-white">
				Go back to Home
			</Link>
		</div>
	);
}
