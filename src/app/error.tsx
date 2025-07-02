"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const reload = () => {
		window.location.reload();
	};

	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className={`mx-auto p-10`}>
			<h1 className="mb-3 text-4xl font-bold">Error!</h1>
			<h2 className="mb-3">Something went wrong!</h2>
			<button
				onClick={() => reload()}
				className="block bg-black px-5 py-2 text-white dark:bg-white dark:text-black"
			>
				Try again
			</button>
		</div>
	);
}
