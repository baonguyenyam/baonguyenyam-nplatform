"use client";

import AppTitle from "@/components/AppTitle";
import { appState } from "@/lib/appConst";
import { useAppSelector } from "@/store";

export default function Fetch(props: any) {
	const { title, breadcrumb } = props;
	const state = useAppSelector((state) => state.appState) as { title?: string; description?: string };

	return (
		<div className="h-full p-10 items-center justify-center flex-grow flex m-10  bg-black text-white rounded-2xl dark:bg-gray-900">
			<div className="flex flex-col text-center max-w-2xl">
				<AppTitle breadcrumb={breadcrumb} />
				<h1 className="text-3xl font-bold">{state.title ?? appState.appName}</h1>
				<p className="mt-1 text-sm">v{appState.appVersion}</p>
				<p className="mt-4 text-sm opacity-50" dangerouslySetInnerHTML={{ __html: state.description ?? appState.appDescription }}></p>
			</div>
		</div>
	);
}
