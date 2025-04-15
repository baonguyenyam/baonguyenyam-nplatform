import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SignIn({ provider, ...props }: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
	return (
		<Button
			variant="outline"
			asChild
			{...props}>
			<Link href={`/authentication/login?callbackUrl=${provider ?? "/"}`}>Sign In</Link>
		</Button>
	);
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
	return (
		<Button
			variant="outline"
			asChild
			{...props}>
			<Link href="/authentication/logout">Sign Out</Link>
		</Button>
	);
}
