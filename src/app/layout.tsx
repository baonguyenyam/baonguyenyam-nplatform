import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { appState } from "@/lib/appConst";

import StoreProvider from "./StoreProvider";

import "./globals.css";

export const metadata: Metadata = {
	title: {
		template: `%s | ${appState.appName}`,
		default: appState.appName,
	},
	description: appState.appDescription,
	// Preconnect to Google Fonts to improve font loading
	other: {
		preconnect: "https://fonts.googleapis.com",
		"preconnect-crossorigin": "https://fonts.gstatic.com",
	},
};

export default async function RootLayout({
	children,
}: React.PropsWithChildren) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html lang="en" suppressHydrationWarning={true}>
				<body suppressHydrationWarning={true}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<StoreProvider>{children}</StoreProvider>
					</ThemeProvider>
					<Toaster richColors />
				</body>
			</html>
		</SessionProvider>
	);
}
