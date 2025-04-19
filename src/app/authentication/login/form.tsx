import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT, SIGNIN_ERROR_URL } from "@/routes";

export async function Form({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const query = await headers();
	const { callbackUrl } = { callbackUrl: query.get("x-callbackUrl") ?? "/" };

	async function singInGitHubForm(formData: FormData) {
		"use server";
		try {
			(await signIn("github", {
				redirectTo: DEFAULT_LOGIN_REDIRECT + "?callbackUrl=" + formData.get("callbackUrl"),
			})) as { user?: { name?: string } };
		} catch (error) {
			if (error instanceof AuthError) {
				return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
			}
			throw error;
		}
	}

	async function singInGoogleForm(formData: FormData) {
		"use server";
		try {
			(await signIn("google", {
				redirectTo: DEFAULT_LOGIN_REDIRECT + "?callbackUrl=" + formData.get("callbackUrl"),
			})) as { user?: { name?: string } };
		} catch (error) {
			if (error instanceof AuthError) {
				return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
			}
			throw error;
		}
	}

	async function singInCredentialsForm(formData: FormData) {
		"use server";
		try {
			(await signIn("credentials", {
				email: formData.get("email"),
				password: formData.get("password"),
				redirectTo: DEFAULT_LOGIN_REDIRECT + "?callbackUrl=" + formData.get("callbackUrl"),
			})) as { user?: { name?: string } };
		} catch (error) {
			if (error instanceof AuthError) {
				return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
			}
			throw error;
		}
	}

	return (
		<div
			className={cn("flex flex-col gap-6", className)}
			{...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>Login with your account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<div className="flex flex-col gap-4">
							{/* Credentials */}
							<form action={singInCredentialsForm}>
								<input
									type="hidden"
									name="callbackUrl"
									value={callbackUrl}
								/>
								<div className="space-y-4 mb-10">
									<div className="flex flex-col gap-2">
										<Input
											id="email"
											name="email"
											type="email"
											placeholder="Enter your email"
											className="w-full"
											required
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Input
											id="password"
											name="password"
											type="password"
											placeholder="Enter your password"
											className="w-full"
											required
										/>
									</div>
									<div className="flex items-center justify-between">
										<Button
											type="submit"
											variant="outline"
											className="w-full">
											Sign in
										</Button>
									</div>
								</div>
							</form>
							<form action={singInGitHubForm}>
								<input
									type="hidden"
									name="callbackUrl"
									value={callbackUrl}
								/>
								<Button
									type="submit"
									variant="outline"
									className="w-full">
									Sign in with GitHub
								</Button>
							</form>
							<form action={singInGoogleForm}>
								<input
									type="hidden"
									name="callbackUrl"
									value={callbackUrl}
								/>
								<Button
									type="submit"
									variant="outline"
									className="w-full">
									Sign in with Google
								</Button>
							</form>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
				By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/policy">Privacy Policy</Link>.
			</div>
		</div>
	);
}
