"use client";

import AppTitle from "@/components/AppTitle";

export default function Fetch(props: any) {
	const { title } = props;

	return (
		<>
			<div className="space-y-3">
				<AppTitle data={title} />
				<p className="text-sm text-gray-500">
					You do not have permission to access this page.
				</p>
				<p className="text-sm text-gray-500">
					Please contact your administrator if you believe this is an error.
				</p>
				<p className="text-sm text-gray-500">
					If you are an administrator, please check your permissions.
				</p>
			</div>
		</>
	);
}
