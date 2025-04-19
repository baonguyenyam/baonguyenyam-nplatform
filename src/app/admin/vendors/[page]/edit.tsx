import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import AppLoading from "@/components/AppLoading";
import { FieldSelect } from "@/components/fields/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { enumPublished } from "@/lib/enum";

import * as actions from "./actions";

const FormSchema = z.object({
	f_email: z.string().email({ message: "Invalid email address." }),
	f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]], { required_error: "Published is required" }).optional(),
	f_address: z.string().optional(),
	f_city: z.string().optional(),
	f_state: z.string().optional(),
	f_country: z.string().optional(),
	f_phone: z.string().optional(),
	f_zip: z.string().optional(),
	f_company: z.string().optional(),
	f_firstname: z.string().optional(),
	f_lastname: z.string().optional(),
});

export default function FormEdit(props: any) {
	const type = "vendor";
	const { id, onChange } = props;
	const role = useCurrentRole();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_email: "",
			f_published: "FALSE",
			f_address: "",
			f_city: "",
			f_state: "",
			f_country: "",
			f_phone: "",
			f_zip: "",
			f_company: "",
			f_firstname: "",
			f_lastname: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const _body = {
			name: values.f_firstname + " " + values.f_lastname,
			email: values.f_email,
			phone: values.f_phone,
			emailVerified: new Date(),
			first_name: values.f_firstname,
			last_name: values.f_lastname,
			published: values.f_published === "TRUE" ? true : false,
			address: values.f_address,
			city: values.f_city,
			state: values.f_state,
			country: values.f_country,
			zip: values.f_zip,
			company: values.f_company,
			type: type,
		};
		if (data) {
			const update = await actions.updateRecord(id, _body);
			if (update?.success !== "success") {
				toast.error(update.message);
				return;
			}
			toast.success(update.message);
		} else {
			const create = await actions.createRecord(_body);
			if (create?.success !== "success") {
				toast.error(create.message);
				return;
			}
			// Send the email to the user
			await actions.sendMail(values.f_email, values.f_firstname + " " + values.f_lastname);
			toast.success(create.message);
		}
		onChange("submit", values);
	}

	const fetchData = useCallback(async () => {
		const res = await actions.getRecord(id);
		if (res?.success === "success" && res?.data) {
			setData(res.data);
			form.reset({
				f_email: res?.data?.email || "",
				f_published: res?.data?.published === true ? "TRUE" : "FALSE",
				f_address: res?.data?.address || "",
				f_city: res?.data?.city || "",
				f_state: res?.data?.state || "",
				f_country: res?.data?.country || "",
				f_phone: res?.data?.phone || "",
				f_zip: res?.data?.zip || "",
				f_company: res?.data?.company || "",
				f_firstname: res?.data?.first_name || "",
				f_lastname: res?.data?.last_name || "",
			});
			setLoading(false);
		} else {
			setData(null);
			setLoading(false);
		}
	}, [form, id]);

	useEffect(() => {
		if (id) {
			fetchData();
		} else {
			setLoading(false);
		}
	}, [fetchData, id]);

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6 pb-15">
						<div className="grid grid-cols-2 gap-5">
							<FormField
								control={form.control}
								name="f_firstname"
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
								name="f_lastname"
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
						</div>
						<FormField
							control={form.control}
							name="f_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>This is your public display email.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="f_address"
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
						<div className="grid grid-cols-3 gap-5">
							<FormField
								control={form.control}
								name="f_city"
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
								name="f_state"
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
								name="f_country"
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
						</div>
						<div className="grid grid-cols-3 gap-5">
							<FormField
								control={form.control}
								name="f_phone"
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
							<FormField
								control={form.control}
								name="f_zip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Zip</FormLabel>
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
							name="f_company"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="post_bottom z-10 absolute bottom-0 right-0 flex w-full items-center justify-between space-x-2 border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
							{role === "ADMIN" && (
								<FormField
									control={form.control}
									name="f_published"
									render={({ field }) => (
										<FormItem>
											{FieldSelect({
												field,
												data: enumPublished.map((item) => ({
													id: item.value,
													name: item.label,
												})),
											})}
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<Button
								type="submit"
								disabled={!form.formState.isDirty || form.formState.isSubmitting}>
								Save changes
							</Button>
						</div>
					</form>
				</Form>
			)}
		</>
	);
}
