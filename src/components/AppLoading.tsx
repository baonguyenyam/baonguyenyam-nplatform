import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
	return (
		<div className="w-full flex flex-col space-y-3 my-3">
			<Skeleton className="h-4 w-1/2 dark:bg-slate-700" />
			<Skeleton className="h-4 w-full dark:bg-slate-700" />
			<Skeleton className="h-4 w-1/3 dark:bg-slate-700" />
		</div>
	);
}
