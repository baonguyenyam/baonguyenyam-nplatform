import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";

import ClientExample from "./client-example";

export default async function ClientPage() {
	const session = await auth();
	if (session?.user) {
		// TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
		// filter out sensitive data before passing to client.
		session.user = session.user as any;
	}

	return (
		<SessionProvider
			basePath={"/auth"}
			session={session}>
			<ClientExample />
		</SessionProvider>
	);
}
