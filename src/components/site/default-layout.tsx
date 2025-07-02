import Footer from "@/components/site/footer";
import Header from "@/components/site/header";

import CheckState from "./checkState";

export default async function DefaultLayout({
	children,
}: React.PropsWithChildren) {
	return (
		<main
			suppressHydrationWarning={true}
			className="flex min-h-screen flex-col bg-white dark:bg-gray-900"
		>
			<CheckState />
			<Header />
			{children}
			<Footer />
		</main>
	);
}
