import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import AppLoading from "@/components/AppLoading";
import { FieldSelect } from "@/components/fields/select";
import { FieldSelectAttribute } from "@/components/fields/selectattribute";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { enumPermission, enumPublished } from "@/lib/enum";
import { stringToKeyValue } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";

export default function FormEdit(props: any) {
	// Build the form schema using Zod
	let FormSchema = z.object({
		f_email: z.string().email({ message: "Invalid email address." }),
		f_role: z.enum(enumPermission.map((item) => item.value) as [string, ...string[]], { required_error: "Role is required" }).optional(),
		f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]], { required_error: "Published is required" }).optional(),
		f_address: z.string().optional(),
		f_city: z.string().optional(),
		f_state: z.string().optional(),
		f_country: z.string().optional(),
		f_phone: z.string().optional(),
		f_zip: z.string().optional(),
		f_firstname: z.string().optional(),
		f_lastname: z.string().optional(),
	});
	const { id, onChange } = props;
	const role = useCurrentRole();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	// Load the attribute data from the store
	const attributeData = useAppSelector((state) => state?.attributeState.data);
	const atts = useMemo(() => {
		if (attributeData) {
			return attributeData.filter((item) => item.mapto === "user");
		}
		return [];
	}, [attributeData]);

	// Dynamically add fields to the schema based on the attribute data
	atts?.forEach((item: any) => {
		item?.children?.forEach((child: any) => {
			const fieldName = `f_${stringToKeyValue(item.title)}_${item.id}_${child.id}`;
			const fieldSchema = z.string().optional();
			FormSchema = FormSchema.extend({
				[fieldName]: fieldSchema,
			}) as unknown as typeof FormSchema;
		});
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_published: "FALSE",
			f_email: "",
			f_role: "USER",
			f_address: "",
			f_city: "",
			f_state: "",
			f_country: "",
			f_phone: "",
			f_zip: "",
			f_firstname: "",
			f_lastname: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		// Build the attributes data
		// data: {
		// 	id: Number,
		// 	data: [
		// 		{
		// 			id: Number,
		// 			value: String,
		// 		},
		// 	],
		const attrs = atts.map((item: any) => {
			const fieldName = `f_${stringToKeyValue(item.title)}_${item.id}`;
			const fieldValue = item?.children?.map((child: any) => {
				const childFieldName = `${fieldName}_${child.id}`;
				return {
					id: child.id,
					value: values[childFieldName as keyof typeof values],
				};
			});
			return {
				id: item.id,
				data: fieldValue,
			};
		});
		const _body = {
			name: values.f_firstname + " " + values.f_lastname,
			email: values.f_email,
			emailVerified: new Date(),
			published: values.f_published === "TRUE" ? true : false,
			role: values.f_role,
			phone: values.f_phone,
			first_name: values.f_firstname,
			last_name: values.f_lastname,
			address: values.f_address,
			city: values.f_city,
			state: values.f_state,
			country: values.f_country,
			zip: values.f_zip,
			data: JSON.stringify(attrs),
		};
		if (data) {
			const update = await actions.updateRecord(id, _body);
			if (update?.success !== "success") {
				toast.error(update.message);
				return;
			}
			toast.success(update.message);
		} else {
			await actions
				.createRecord(_body)
				.then((res) => {
					if (res?.success !== "success") {
						toast.error(res.message);
						return;
					} else {
						// Send the email to the user
						const _data = res?.data;
						if (_data) {
							actions.sendMail(values.f_email, values.f_firstname + " " + values.f_lastname);
						}
					}
					toast.success(res.message);
				})
				.catch((err) => {
					toast.error(err.message);
				});
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
				f_role: res?.data?.role || "USER",
				f_address: res?.data?.address || "",
				f_city: res?.data?.city || "",
				f_state: res?.data?.state || "",
				f_country: res?.data?.country || "",
				f_phone: res?.data?.phone || "",
				f_zip: res?.data?.zip || "",
				f_firstname: res?.data?.first_name || "",
				f_lastname: res?.data?.last_name || "",
			});
			// Parse the data attribute
			const _attribute = res?.data?.data ? JSON.parse(res?.data?.data) : null;
			// Set the attribute data to the form
			// Loop through the attribute data and set the values to the form
			atts?.forEach((item: any) => {
				const fieldName = `f_${stringToKeyValue(item.title)}_${item.id}`;
				const fieldValue = item?.children?.map((child: any) => {
					const childFieldName = `${fieldName}_${child.id}`;
					if (child?.type === "select") {
						const childValue = (_attribute?.find((c: any) => c.id === item.id) || {})?.data?.find((v: any) => v.id === child.id)?.value;
						form.setValue(childFieldName as keyof z.infer<typeof FormSchema>, childValue || "");
					}
					if (child?.type === "checkbox") {
						const childValue = (_attribute?.find((c: any) => c.id === item.id) || {})?.data?.find((v: any) => v.id === child.id)?.value || "[]";
						form.setValue(childFieldName as keyof z.infer<typeof FormSchema>, childValue || "");
					}
					if (child?.type === "text") {
						const childValue = (_attribute?.find((c: any) => c.id === item.id) || {})?.data?.find((v: any) => v.id === child.id)?.value;
						form.setValue(childFieldName as keyof z.infer<typeof FormSchema>, childValue || "");
					}
				});
			});
			setLoading(false);
		} else {
			setData(null);
			setLoading(false);
		}
	}, [atts, form, id]);

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

						{atts?.length > 0 && (
							<Tabs
								defaultValue={atts?.[0]?.id}
								className="mb-10">
								<TabsList className="mt-5 mb-2">
									{atts?.map((item: any) => (
										<TabsTrigger
											key={item.id}
											value={item.id}>
											{item.title}
										</TabsTrigger>
									))}
								</TabsList>
								<div className="grow text-start">
									{atts?.map((item: any) => (
										<TabsContent
											key={item.id}
											value={item.id}
											className="space-y-15">
											<div className="grid grid-cols-3 gap-5">
												{item?.children?.map((child: any) => {
													const fieldName = `f_${stringToKeyValue(item.title)}_${item.id}_${child.id}`;
													return (
														<Fragment key={child.id}>
															<FormField
																control={form.control}
																name={fieldName as keyof z.infer<typeof FormSchema>}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>{child.title}</FormLabel>
																		{child?.type === "text" && (
																			<FormControl>
																				<Input {...field} />
																			</FormControl>
																		)}
																		{(child?.type === "select" || child?.type === "checkbox") && (
																			<>
																				{FieldSelectAttribute({
																					mode: id ? "edit" : "create",
																					field,
																					form,
																					type: child?.type,
																					key: "f_" + stringToKeyValue(item.title) + "_" + item.id,
																					id: child.id,
																				})}
																			</>
																		)}
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</Fragment>
													);
												})}
											</div>
										</TabsContent>
									))}
								</div>
							</Tabs>
						)}

						{role === "ADMIN" && (
							<>
								<FormField
									control={form.control}
									name="f_role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											{FieldSelect({
												field,
												data: enumPermission.map((item) => ({
													id: item.value,
													name: item.label,
												})),
											})}
											<FormDescription>This is your public display role.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						<div className="post_bottom z-10 absolute bottom-0 right-0 flex w-full items-center justify-between space-x-2 rounded-b-lg border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
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
