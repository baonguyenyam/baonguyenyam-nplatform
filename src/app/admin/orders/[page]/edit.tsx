import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import * as customer_actions from "@/app/admin/customers/[page]/actions";
import * as user_actions from "@/app/admin/users/[page]/actions";
import * as vendor_actions from "@/app/admin/vendors/[page]/actions";
import { AppEditor } from "@/components/AppEditor";
import AppLoading from "@/components/AppLoading";
import { Attribute } from "@/components/fields/attribute";
import { FieldCheckbox } from "@/components/fields/checkbox";
import { FieldDate } from "@/components/fields/date";
import { ImageList } from "@/components/fields/imagelist";
import { FieldInput } from "@/components/fields/input";
import { FieldSelect } from "@/components/fields/select";
import { FieldUpload } from "@/components/fields/upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/SettingTab";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { appState } from "@/lib/appConst";
import { enumOrderStatus, enumPublished } from "@/lib/enum";
import { autoOderDate } from "@/lib/utils";
import { useAppSelector } from "@/store";

import OrderAttributeGroup from "./edit/attribute_group";
import OrderAttributeMain from "./edit/attribute_main";
import { ConnectUser } from "./edit/connect";
import * as actions from "./actions";

const FormSchema = z.object({
	f_title: z.string().min(2, { message: "Fullname must be at least 2 characters." }),
	f_content: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_published: z.enum(enumPublished.map((item: any) => item.value) as [string, ...string[]], { required_error: "Published is required" }).optional(),
	f_status: z.enum(enumOrderStatus.map((item: any) => item.value) as [string, ...string[]], { required_error: "Status is required" }).optional(),
	f_categories: z
		.array(z.number())
		.refine((data) => data.length > 0 && data[0] !== 0, { message: "Please select at least one category" })
		.optional(),
	f_price: z.string().optional(),
	f_sale_price: z.string().optional(),
	f_import_price: z.string().optional(),
	f_attributes: z.array(z.object({ title: z.string(), value: z.string() })).optional(),
	f_date_created: z
		.date()
		.optional()
		.transform((e) => (e === undefined ? undefined : e)),
	f_date_production: z
		.date()
		.optional()
		.transform((e) => (e === undefined ? undefined : e)),
	f_date_shipped: z
		.date()
		.optional()
		.transform((e) => (e === undefined ? undefined : e)),
	f_date_delivered: z
		.date()
		.optional()
		.transform((e) => (e === undefined ? undefined : e)),
	f_date_completed: z
		.date()
		.optional()
		.transform((e) => (e === undefined ? undefined : e)),
	f_date_refunded: z
		.date()
		.optional()
		.transform((e) => (e === undefined ? undefined : e)),
	f_customer: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_user: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_user_product: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_user_manager: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_user_shipping: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_vendor: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_file: z
		.any()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
});

export default function FormEdit(props: any) {
	const { id, onChange } = props;
	const memoriez = useAppSelector((state) => state.categoriesState.data);
	const categories = useMemo(() => {
		return memoriez.filter((item: any) => item.type === "order");
	}, [memoriez]);
	const [users, setUsers] = useState<any>([]);
	const [customers, setCustomers] = useState<any>([]);
	const [vendors, setVendors] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any>(null);
	const [thumbnail, setThumbnail] = useState<any>(null);
	const [imgs, setImgs] = useState<any>([]);
	const role = useCurrentRole();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_title: autoOderDate(),
			f_published: "FALSE",
			f_categories: [],
			f_attributes: [],
			f_status: "pending",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		// Update or create order
		const _body = {
			title: values.f_title,
			content: values.f_content,
			published: values.f_published === "TRUE" ? true : false,
			image: !id ? thumbnail : undefined,
			categories: {
				connect: values.f_categories?.map((category: any) => {
					return { id: category };
				}),
			},
			files: {
				connect: imgs ? imgs.map((item: any) => ({ id: item?.data[0]?.id })) : undefined,
			},
			status: values.f_status,
			date_created: values.f_date_created,
			date_production: values.f_date_production,
			date_shipped: values.f_date_shipped,
			date_delivered: values.f_date_delivered,
			date_completed: values.f_date_completed,
			date_refunded: values.f_date_refunded,
			customer: {
				connect: !id ? (values.f_customer ? [{ id: values.f_customer }] : undefined) : undefined,
			},
			user: {
				connect: !id ? (values.f_user ? [{ id: values.f_user }] : undefined) : undefined,
			},
			user_product: {
				connect: !id ? (values.f_user_product ? [{ id: values.f_user_product }] : undefined) : undefined,
			},
			user_manager: {
				connect: !id ? (values.f_user_manager ? [{ id: values.f_user_manager }] : undefined) : undefined,
			},
			user_shipping: {
				connect: !id ? (values.f_user_shipping ? [{ id: values.f_user_shipping }] : undefined) : undefined,
			},
			vendor: {
				connect: !id ? (values.f_vendor ? [{ id: values.f_vendor }] : undefined) : undefined,
			},
		};
		const _attributes = values.f_attributes?.map((item: any) => {
			return {
				key: item.title,
				value: item.value,
			};
		});
		const _meta = {
			data: [
				{
					key: "order_price",
					value: values.f_price,
				},
				{
					key: "order_sale_price",
					value: values.f_sale_price,
				},
				{
					key: "order_import_price",
					value: values.f_import_price,
				},
				{
					key: "order_attributes",
					value: JSON.stringify(_attributes),
				},
			],
		};

		const res = data ? await actions.updateRecord(id, _body, _meta) : await actions.createRecord(_body, _meta);
		if (res.success !== "success") {
			toast.error(res.message);
			return;
		}
		toast.success(res.message);
		// IF Enabled auto close after submit
		onChange("submit", values);
	}

	async function changeFeature(e: any) {
		if (id) {
			const res = await actions.updateRecord(id, { image: e }, {});
			if (res.success !== "success") {
				toast.error(res.message);
				return;
			}
			toast.success(res.message);
			setThumbnail(e);
		}
	}

	const fetchData = useCallback(async () => {
		const res = await actions.getRecord(id);
		if (res?.success === "success" && res?.data) {
			setData(res.data);
			form.reset({
				f_title: res?.data?.title || "",
				f_content: res?.data?.content || "",
				f_published: res?.data?.published === true ? "TRUE" : "FALSE",
				f_status: res?.data?.status || "pending",
				f_categories: res?.data?.categories?.map((item: any) => item.id) || [],
				f_price: res?.data?.meta?.find((item: any) => item.key === "order_price")?.value || "",
				f_sale_price: res?.data?.meta?.find((item: any) => item.key === "order_sale_price")?.value || "",
				f_import_price: res?.data?.meta?.find((item: any) => item.key === "order_import_price")?.value || "",
				f_attributes:
					JSON.parse(res?.data?.meta?.find((item: any) => item.key === "order_attributes")?.value || "[]").map((item: any) => {
						return {
							title: item.key,
							value: item.value,
						};
					}) || [],
				f_date_created: res?.data?.date_created ? new Date(res?.data?.date_created) : undefined,
				f_date_production: res?.data?.date_production ? new Date(res?.data?.date_production) : undefined,
				f_date_shipped: res?.data?.date_shipped ? new Date(res?.data?.date_shipped) : undefined,
				f_date_delivered: res?.data?.date_delivered ? new Date(res?.data?.date_delivered) : undefined,
				f_date_completed: res?.data?.date_completed ? new Date(res?.data?.date_completed) : undefined,
				f_date_refunded: res?.data?.date_refunded ? new Date(res?.data?.date_refunded) : undefined,
				f_user: Array.isArray(res?.data?.user) ? res?.data?.user[0]?.id || "" : "",
				f_user_product: Array.isArray(res?.data?.user_product) ? res?.data?.user_product[0]?.id || "" : "",
				f_user_manager: Array.isArray(res?.data?.user_manager) ? res?.data?.user_manager[0]?.id || "" : "",
				f_user_shipping: Array.isArray(res?.data?.user_shipping) ? res?.data?.user_shipping[0]?.id || "" : "",
				f_vendor: Array.isArray(res?.data?.vendor) ? res?.data?.vendor[0]?.id || "" : "",
				f_file: res?.data?.image || "",
			});
			setThumbnail(res?.data?.image);
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
						<Tabs
							defaultValue={id ? "general" : "basic"}
							orientation="vertical"
							className="flex w-full items-start gap-10">
							<TabsList className="flex-col rounded-none bg-transparent p-0 min-w-[200px] space-y-1">
								{id && (
									<TabsTrigger
										className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:after:bg-primary cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:after:bg-primary rounded-md overflow-hidden"
										value="general">
										General
									</TabsTrigger>
								)}
								<TabsTrigger
									className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:after:bg-primary cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:after:bg-primary rounded-md overflow-hidden"
									value="basic">
									Basic Info
								</TabsTrigger>
								<TabsTrigger
									className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:after:bg-primary cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:after:bg-primary rounded-md overflow-hidden"
									value="shipping">
									Shipping
								</TabsTrigger>
								<TabsTrigger
									className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:after:bg-primary cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:after:bg-primary rounded-md overflow-hidden"
									value="user_product">
									User/Vendor manager
								</TabsTrigger>
								<TabsTrigger
									className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:after:bg-primary cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:after:bg-primary rounded-md overflow-hidden"
									value="files">
									Medias
								</TabsTrigger>
								<TabsTrigger
									className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:after:bg-primary cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:after:bg-primary rounded-md overflow-hidden"
									value="advance">
									Advance
								</TabsTrigger>
							</TabsList>

							<div className="grow text-start">
								{id && (
									<TabsContent
										value="general"
										className="space-y-15">
										<OrderAttributeMain data={data}
											onChange={(e: any) => {
												console.log(e);
											}}
										/>
										<OrderAttributeGroup data={data} />
									</TabsContent>
								)}
								<TabsContent
									value="basic"
									className="space-y-15">
									<div className="flex gap-5">
										<div className="w-full">
											<FormField
												control={form.control}
												name="f_title"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title</FormLabel>
														{FieldInput({ field })}
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="f_status"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Status</FormLabel>
													{FieldSelect({
														field,
														data: enumOrderStatus.map((item: any) => {
															return {
																id: item.value,
																name: item.label,
															};
														}),

														align: "end",
													})}
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 gap-15">
										<FormField
											control={form.control}
											name="f_customer"
											render={({ field }) => (
												<FormItem className="flex flex-col gap-4">
													<FormLabel>Customer</FormLabel>
													{ConnectUser({
														form,
														field,
														data,
														users: customers,
														id,
														key: "customer",
														model: "customer",
														onChange: async (e: any) => {
															const res = await customer_actions.getAll({ s: e });
															if (res.success === "success" && res.data) {
																const customers = res?.data?.map((item: any) => {
																	return {
																		id: item.id,
																		name: item.name,
																	};
																});
																setCustomers(customers);
															} else {
																setCustomers([]);
															}
														},
													})}
												</FormItem>
											)}
										/>
									</div>
									<div className="grid grid-cols-4 gap-15">
										<FormField
											control={form.control}
											name="f_date_created"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Date Created</FormLabel>
													{FieldDate({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_date_production"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Date Production</FormLabel>
													{FieldDate({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_date_completed"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Date Completed</FormLabel>
													{FieldDate({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_date_refunded"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Date Refunded</FormLabel>
													{FieldDate({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="f_categories"
										render={() => (
											<FormItem>
												<FormLabel>Categories</FormLabel>
												<div className="grid grid-cols-2 lg:grid-cols-4 mt-3 gap-4">{FieldCheckbox({ data: categories, form })}</div>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="f_content"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Note</FormLabel>
												<FormControl>
													<AppEditor
														{...field}
														onChange={(e: any) => {
															field.onChange(e);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex items-center gap-4"></div>
								</TabsContent>

								<TabsContent
									value="shipping"
									className="space-y-15">
									<div className="grid grid-cols-3 gap-15">
										<FormField
											control={form.control}
											name="f_date_shipped"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Date Shipping</FormLabel>
													{FieldDate({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_date_delivered"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Date Delivered</FormLabel>
													{FieldDate({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</TabsContent>

								<TabsContent
									value="user_product"
									className="space-y-15">
									<div className="space-y-15">
										<FormField
											control={form.control}
											name="f_user"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>User Creator</FormLabel>
													{ConnectUser({
														form,
														field,
														data,
														users: users,
														id,
														key: "user",
														model: "user",
														onChange: async (e: any) => {
															const res = await user_actions.getAll({ s: e });
															if (res.success === "success" && res.data) {
																const _users = res?.data?.map((item: any) => {
																	return {
																		id: item.id,
																		name: item.name,
																	};
																});
																setUsers(_users);
															} else {
																setUsers([]);
															}
														},
													})}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_user_product"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>User Product</FormLabel>
													{ConnectUser({
														form,
														field,
														data,
														users: users,
														id,
														key: "user_product",
														model: "user",
														onChange: async (e: any) => {
															const res = await user_actions.getAll({ s: e });
															if (res.success === "success" && res.data) {
																const _users = res?.data?.map((item: any) => {
																	return {
																		id: item.id,
																		name: item.name,
																	};
																});
																setUsers(_users);
															} else {
																setUsers([]);
															}
														},
													})}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_user_manager"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>User Manager</FormLabel>
													{ConnectUser({
														form,
														field,
														data,
														users: users,
														id,
														key: "user_manager",
														model: "user",
														onChange: async (e: any) => {
															const res = await user_actions.getAll({ s: e });
															if (res.success === "success" && res.data) {
																const _users = res?.data?.map((item: any) => {
																	return {
																		id: item.id,
																		name: item.name,
																	};
																});
																setUsers(_users);
															} else {
																setUsers([]);
															}
														},
													})}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_user_shipping"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>User Shipping</FormLabel>
													{ConnectUser({
														form,
														field,
														data,
														users: users,
														id,
														key: "user_shipping",
														model: "user",
														onChange: async (e: any) => {
															const res = await user_actions.getAll({ s: e });
															if (res.success === "success" && res.data) {
																const _users = res?.data?.map((item: any) => {
																	return {
																		id: item.id,
																		name: item.name,
																	};
																});
																setUsers(_users);
															} else {
																setUsers([]);
															}
														},
													})}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_vendor"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Vendor</FormLabel>
													{ConnectUser({
														form,
														field,
														data,
														users: vendors,
														id,
														key: "vendor",
														model: "vendor",
														onChange: async (e: any) => {
															const res = await vendor_actions.getAll({ s: e });
															if (res.success === "success" && res.data) {
																const _vendors = res?.data?.map((item: any) => {
																	return {
																		id: item.id,
																		name: item.name,
																	};
																});
																setVendors(_vendors);
															} else {
																setVendors([]);
															}
														},
													})}
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</TabsContent>

								<TabsContent
									value="files"
									className="space-y-10">
									<div className="space-y-10">
										{ImageList({
											role,
											data: data,
											thumbnail,
											setThumbnail,
											fetchData,
											onChange: (e: any) => {
												changeFeature(e);
											},
										})}
									</div>
									<FormField
										control={form.control}
										name="f_file"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Upload Image</FormLabel>
												{FieldUpload({
													field,
													data,
													accept: appState.ACCEPTED_IMG_FILE_TYPES,
													onChange: (e: any) => {
														field.onChange(e[0]?.data[0]?.url);
														setThumbnail(e[0]?.data[0]?.url);
														setImgs(e);
													},
												})}
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent
									value="advance"
									className="space-y-10">
									<div className="mt-4 grid sm:grid-cols-3 gap-4">
										<FormField
											control={form.control}
											name="f_price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Price</FormLabel>
													{FieldInput({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_sale_price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Sale Price</FormLabel>
													{FieldInput({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_import_price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Import Price</FormLabel>
													{FieldInput({ field })}
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="mt-4 flex flex-col gap-4">{Attribute({ form })}</div>
								</TabsContent>
							</div>
						</Tabs>

						<div className="post_bottom z-10 absolute bottom-0 right-0 flex w-full items-center justify-between space-x-2 border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
							{role === "ADMIN" && (
								<FormField
									control={form.control}
									name="f_published"
									render={({ field }) => (
										<FormItem>
											{FieldSelect({
												field,
												data: enumPublished.map((item: any) => ({
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
