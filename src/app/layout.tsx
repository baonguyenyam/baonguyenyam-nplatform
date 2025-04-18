import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { appState } from "@/lib/appConst";

import StoreProvider from "./StoreProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		template: `%s | ${appState.appName}`,
		default: appState.appName,
	},
	description: appState.appDescription,
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html
				lang="en"
				suppressHydrationWarning={true}>
				<body
					className={`${inter.className}`}
					suppressHydrationWarning={true}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange>
						<StoreProvider>
							{children}
						</StoreProvider>
					</ThemeProvider>
					<Toaster richColors />
				</body>
			</html>
		</SessionProvider>
	);
}
