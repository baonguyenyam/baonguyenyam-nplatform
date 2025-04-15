import { appState } from "@/lib/appConst";

export default function Footer() {
	return (
		<footer className="mt-auto text-xs text-center py-4 bg-gray-50 text-gray-600 border-t border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
			Copyright &copy; {new Date().getFullYear()} {appState.appName}. All rights reserved.
		</footer>
	);
}
