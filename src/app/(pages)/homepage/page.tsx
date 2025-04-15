import { ArrowRight, BarChart3, Calendar, CheckSquare, Clock, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage(props: any) {
	const { state, session } = props;
	return (
		<>
			{/* <div className="h-full p-10 items-center justify-center flex-grow flex m-10 bg-gray-900 rounded-lg text-white">
				<div className="flex flex-col items-center justify-center text-center max-w-2xl">
					<h1 className="text-3xl font-bold">{state.appName}</h1>
					<p className="mt-1 text-sm">v{state.appVersion}</p>
					<p className="mt-4 text-sm opacity-50">{state.appDescription}</p>
				</div>
			</div> */}
			<section className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-gray-800">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{state.appName}</h1>
							<p className="max-w-[600px] text-muted-foreground md:text-xl">{state.appDescription}</p>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								{!session?.user && (
									<Link href="/authentication/login">
										<Button
											variant="outline"
											size="lg">
											Login
										</Button>
									</Link>
								)}
								{session?.user && (
									<Link href="/admin">
										<Button size="lg">
											Dashboard
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</Link>
								)}
							</div>
						</div>
						<div className="flex justify-center">
							<div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-background p-4 shadow-lg dark:bg-gray-800">
								<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
								<div className="relative z-10 h-full rounded-lg border bg-background p-4 overflow-hidden dark:bg-gray-800 dark:border-gray-500">
									<div className="flex items-center justify-between border-b pb-2 dark:border-gray-500">
										<div className="text-sm font-medium">{state.appName}</div>
										<div className="flex items-center gap-1">
											<div className="h-2 w-2 rounded-full bg-red-500" />
											<div className="h-2 w-2 rounded-full bg-yellow-500" />
											<div className="h-2 w-2 rounded-full bg-green-500" />
										</div>
									</div>
									<div className="mt-4 grid gap-2">
										<div className="h-2 w-3/4 rounded bg-muted dark:bg-gray-900" />
										<div className="h-2 w-1/2 rounded bg-muted dark:bg-gray-900" />
										<div className="mt-2 grid grid-cols-2 gap-2">
											<div className="h-20 rounded bg-muted dark:bg-gray-900" />
											<div className="h-20 rounded bg-muted dark:bg-gray-900" />
										</div>
										<div className="mt-2 h-32 rounded bg-muted dark:bg-gray-900" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="w-full py-12 md:py-24 lg:py-32 dark:bg-gray-900 dark:text-white">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
							<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum tenetur, voluptatem earum cum adipisci ut in ea animi quibusdam. Quis sunt facilis fugit, labore ipsam quas repellat dicta vel numquam.</p>
						</div>
					</div>
					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
						<Card className="dark:bg-gray-800 dark:border-0">
							<CardHeader className="flex flex-row gap-4 items-start">
								<CheckSquare className="h-8 w-12 text-primary" />
								<CardTitle>Lorem ipsum, dolor sit amet consectetur adipisi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium amet quidem maxime, iure consequatur tenetur, a impedit dolorum mag</CardDescription>
							</CardContent>
						</Card>
						<Card className="dark:bg-gray-800 dark:border-0">
							<CardHeader className="flex flex-row gap-4 items-start">
								<Users className="h-8 w-12 text-primary" />
								<CardTitle>Lorem ipsum, dolor sit amet consectetur adipisi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium amet quidem maxime, iure consequatur tenetur, a impedit dolorum mag</CardDescription>
							</CardContent>
						</Card>
						<Card className="dark:bg-gray-800 dark:border-0">
							<CardHeader className="flex flex-row gap-4 items-start">
								<Calendar className="h-8 w-12 text-primary" />
								<CardTitle>Lorem ipsum, dolor sit amet consectetur adipisi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium amet quidem maxime, iure consequatur tenetur, a impedit dolorum mag</CardDescription>
							</CardContent>
						</Card>
						<Card className="dark:bg-gray-800 dark:border-0">
							<CardHeader className="flex flex-row gap-4 items-start">
								<BarChart3 className="h-8 w-12 text-primary" />
								<CardTitle>Lorem ipsum, dolor sit amet consectetur adipisi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium amet quidem maxime, iure consequatur tenetur, a impedit dolorum mag</CardDescription>
							</CardContent>
						</Card>
						<Card className="dark:bg-gray-800 dark:border-0">
							<CardHeader className="flex flex-row gap-4 items-start">
								<Clock className="h-8 w-12 text-primary" />
								<CardTitle>Lorem ipsum, dolor sit amet consectetur adipisi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium amet quidem maxime, iure consequatur tenetur, a impedit dolorum mag</CardDescription>
							</CardContent>
						</Card>
						<Card className="dark:bg-gray-800 dark:border-0">
							<CardHeader className="flex flex-row gap-4 items-start">
								<ArrowRight className="h-8 w-12 text-primary" />
								<CardTitle>Lorem ipsum, dolor sit amet consectetur adipisi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium amet quidem maxime, iure consequatur tenetur, a impedit dolorum mag</CardDescription>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</>
	);
}
