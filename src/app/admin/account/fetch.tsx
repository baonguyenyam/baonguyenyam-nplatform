"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import AppLoading from "@/components/AppLoading";
import AppTitle from "@/components/AppTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import * as actions from "./actions";

const FormSchema = z.object({
	first_name: z
		.string()
		.min(2, { message: "First name must be at least 2 characters." }),
	last_name: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters." }),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	zip: z.string().optional(),
	phone: z.string().optional(),
	username: z.string().optional(),
});

export default function Fetch(props: any) {
	const { breadcrumb, email } = props;
	const [db, setDb] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			address: "",
			city: "",
			state: "",
			country: "",
			zip: "",
			phone: "",
			username: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		// Check checkId
		const checkId = await actions.checkId(values.username || "");
		if (checkId?.success !== "success") {
			toast.error(checkId.message);
			return;
		} else {
			const _body = {
				first_name: values.first_name,
				last_name: values.last_name,
				address: values.address,
				city: values.city,
				state: values.state,
				country: values.country,
				zip: values.zip,
				phone: values.phone,
				id: values.username,
			};
			const update = await actions.updateRecord(_body);
			if (update?.success !== "success") {
				toast.error(update.message);
				return;
			}
			toast.success(update.message);
		}
	}

	const fetchData = useCallback(async () => {
		const res = await actions.getAll(email);
		if (res?.data) {
			setDb(res.data);
			form.reset({
				first_name: res?.data?.first_name || "",
				last_name: res?.data?.last_name || "",
				address: res?.data?.address || "",
				city: res?.data?.city || "",
				state: res?.data?.state || "",
				country: res?.data?.country || "",
				zip: res?.data?.zip || "",
				phone: res?.data?.phone || "",
				username: res?.data?.id || "",
			});
			setLoading(false);
		}
	}, [form, email]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<>
					<div className="shadow-lg w-full max-w-xl mx-auto space-y-8 p-6 bg-white/50 dark:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 rounded-lg">
						<div className="flex items-center justify-center flex-col gap-3">
							<Avatar className="mt-10 h-24 w-24 rounded-full border-2 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
								<AvatarImage
									src={db?.avatar}
									className="rounded-full object-cover"
								/>
								<AvatarFallback className="bg-zinc-100">
									{db?.first_name?.charAt(0).toUpperCase()}
									{db?.last_name?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="mb-10 flex flex-col justify-between items-center gap-1">
								<AppTitle data={db?.name} breadcrumb={breadcrumb} />
								<p className="text-sm text-zinc-500 dark:text-zinc-400">
									{db?.email}
								</p>
								{/* <p className="text-xs text-zinc-500 dark:text-zinc-400">ID: {db?.id}</p> */}
							</div>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-6"
							>
								<div className="grid grid-cols-2 gap-10">
									<FormField
										control={form.control}
										name="first_name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="last_name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="col-span-2">
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Address</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>City</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="state"
										render={({ field }) => (
											<FormItem>
												<FormLabel>State</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="country"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="zip"
										render={({ field }) => (
											<FormItem>
												<FormLabel>ZIP</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex justify-end gap-4">
									<Button type="submit">Save Changes</Button>
								</div>
							</form>
						</Form>
					</div>
				</>
			)}
		</>
	);
}
