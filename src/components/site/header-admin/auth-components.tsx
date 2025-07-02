import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SignIn({
	provider,
	...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
	const router = useRouter();
	return (
		<Button variant="outline" asChild {...props}>
			<span
				className="cursor-pointer"
				onClick={() =>
					router.push(`/authentication/login?callbackUrl=${provider ?? "/"}`)
				}
			>
				Sign In
			</span>
		</Button>
	);
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
	const router = useRouter();
	return (
		<Button variant="outline" asChild {...props}>
			<span
				className="cursor-pointer"
				onClick={() => router.push("/authentication/logout")}
			>
				Sign Out
			</span>
		</Button>
	);
}
