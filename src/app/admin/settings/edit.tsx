"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { AppEditor } from "@/components/AppEditor";
import AppLoading from "@/components/AppLoading";
import { FieldUpload } from "@/components/fields/upload";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/SettingTab";
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
import { appState } from "@/lib/appConst";
import { useAppDispatch } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";

import * as actions from "./actions";

const FormSchema = z.object({
	f_title: z
		.string()
		.min(2, { message: "Fullname must be at least 2 characters." }),
	f_description: z
		.string()
		.min(2, { message: "Content must be at least 2 characters." }),
	f_page: z.any().optional(),
	f_tax: z.any().optional(),
	f_bill_note: z
		.string()
		.min(2, { message: "Bill note must be at least 2 characters." }),
	f_bill_company_name: z
		.string()
		.min(2, { message: "Bill company name must be at least 2 characters." }),
	f_bill_company_address: z
		.string()
		.min(2, { message: "Bill company address must be at least 2 characters." }),
	f_bill_company_info: z
		.string()
		.min(2, { message: "Bill company info must be at least 2 characters." }),
	f_bill_company_phone: z.string().optional(),
	f_file: z
		.any()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
});

export default function FormEdit() {
	const dispatch = useAppDispatch(); // Any where is using useAppDispatch the page will callback to CheckState
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any>(null);
	const [thumbnail, setThumbnail] = useState<any>(null);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_title: "",
			f_description: "",
			f_page: 10,
			f_tax: 8.5,
			f_bill_note: "",
			f_bill_company_name: "",
			f_bill_company_address: "",
			f_bill_company_info: "",
			f_bill_company_phone: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const _body = {
			title: values.f_title || "",
			description: values.f_description || "",
			page: values.f_page.toString() || "",
			tax: values.f_tax.toString() || "",
			bill_note: values.f_bill_note || "",
			bill_company_name: values.f_bill_company_name || "",
			bill_company_address: values.f_bill_company_address || "",
			bill_company_info: values.f_bill_company_info || "",
			bill_company_phone: values.f_bill_company_phone || "",
			image: thumbnail || "",
		};

		const update = await actions.updateAllRecord(_body);
		if (update?.success !== "success") {
			toast.error(update.message);
			return;
		}
		dispatch(
			SET_APP_STATE({
				pageSize:
					update.data?.find((item: any) => item.key === "page")?.value || 10,
				title:
					update.data?.find((item: any) => item.key === "title")?.value || "",
				description:
					update.data?.find((item: any) => item.key === "description")?.value ||
					"",
				image:
					update.data?.find((item: any) => item.key === "image")?.value || "",
				tax: update.data?.find((item: any) => item.key === "tax")?.value || 8.5,
				bill_note:
					update.data?.find((item: any) => item.key === "bill_note")?.value ||
					"",
				bill_company_name:
					update.data?.find((item: any) => item.key === "bill_company_name")
						?.value || "",
				bill_company_address:
					update.data?.find((item: any) => item.key === "bill_company_address")
						?.value || "",
				bill_company_info:
					update.data?.find((item: any) => item.key === "bill_company_info")
						?.value || "",
				bill_company_phone:
					update.data?.find((item: any) => item.key === "bill_company_phone")
						?.value || "",
			}),
		);
		fetchData();
		toast.success(update.message);
	}

	const clearCache = (key: string, e: any) => {
		e.preventDefault();
		localStorage.removeItem(key);
		// Disable the button
		const button = e.currentTarget;
		button.disabled = true;
		button.classList.add("opacity-50");
		button.classList.remove("hover:bg-red-500");
		button.classList.add("cursor-not-allowed");
		toast.success("Local Storage cleared");
	};

	const fetchData = useCallback(async () => {
		const res = await actions.getAllRecord();
		if (res?.success === "success" && res?.data) {
			setData(res.data);
			form.reset({
				f_title:
					res.data?.find((item: any) => item.key === "title")?.value || "",
				f_description:
					res.data?.find((item: any) => item.key === "description")?.value ||
					"",
				f_page: res.data?.find((item: any) => item.key === "page")?.value || 10,
				f_tax: res.data?.find((item: any) => item.key === "tax")?.value || 8.5,
				f_bill_note:
					res.data?.find((item: any) => item.key === "bill_note")?.value || "",
				f_bill_company_name:
					res.data?.find((item: any) => item.key === "bill_company_name")
						?.value || "",
				f_bill_company_address:
					res.data?.find((item: any) => item.key === "bill_company_address")
						?.value || "",
				f_bill_company_info:
					res.data?.find((item: any) => item.key === "bill_company_info")
						?.value || "",
				f_bill_company_phone:
					res.data?.find((item: any) => item.key === "bill_company_phone")
						?.value || "",
				f_file:
					res.data?.find((item: any) => item.key === "image")?.value || "",
			});
			setThumbnail(
				res.data?.find((item: any) => item.key === "image")?.value || "",
			);
			setLoading(false);
		} else {
			setData(null);
			setLoading(false);
		}
	}, [form]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-full space-y-6 pb-15"
						>
							<Tabs
								defaultValue="tab-1"
								orientation="vertical"
								className="flex w-full items-start gap-10 mt-5"
							>
								<TabsList className="flex-col rounded-none border-l border-border bg-transparent p-0">
									<TabsTrigger
										value="tab-1"
										className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
									>
										Site configuration
									</TabsTrigger>
									<TabsTrigger
										value="tab-2"
										className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
									>
										Production configuration
									</TabsTrigger>
									<TabsTrigger
										value="tab-3"
										className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
									>
										APIs configuration
									</TabsTrigger>
									<TabsTrigger
										value="tab-4"
										className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
									>
										Local configuration
									</TabsTrigger>
								</TabsList>
								<div className="grow text-start">
									<TabsContent value="tab-1" className="space-y-10">
										<FormField
											control={form.control}
											name="f_title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description</FormLabel>
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
										<FormField
											control={form.control}
											name="f_page"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Page</FormLabel>
													<FormControl>
														<Input
															type="number"
															className="w-20"
															step={1}
															min={1}
															max={100}
															placeholder="Page"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_file"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Upload Image</FormLabel>
													{FieldUpload({
														field,
														data,
														thumbnail: true,
														multiple: false,
														preview: false,
														accept: appState.ACCEPTED_IMG_FILE_TYPES,
														onChange: (e: any) => {
															field.onChange(e[0]?.data[0]?.url);
															setThumbnail(e[0]?.data[0]?.url);
														},
													})}
												</FormItem>
											)}
										/>
									</TabsContent>
									<TabsContent value="tab-2" className="space-y-10">
										<FormField
											control={form.control}
											name="f_tax"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Tax</FormLabel>
													<FormControl>
														<Input
															type="number"
															step={0.01}
															className="w-20"
															min={1}
															max={100}
															placeholder="Tax"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_bill_note"
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
										<FormField
											control={form.control}
											name="f_bill_company_name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Name</FormLabel>
													<FormControl>
														<Input placeholder="Bill Company Name" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_bill_company_address"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Address</FormLabel>
													<FormControl>
														<Input
															placeholder="Bill Company Address"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_bill_company_info"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Info</FormLabel>
													<FormControl>
														<Input placeholder="Bill Company Info" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="f_bill_company_phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Phone</FormLabel>
													<FormControl>
														<Input
															placeholder="Bill Company Phone"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TabsContent>
									<TabsContent value="tab-3" className="space-y-10">
										This feature is not available yet.
									</TabsContent>
									<TabsContent value="tab-4" className="space-y-10">
										<div className="item">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
												Local Storage
											</h3>
											{Object.keys(localStorage)?.map((key) => {
												return (
													<div
														key={key}
														className="flex items-center justify-between space-y-3 "
													>
														<div className="flex items-center space-x-2">
															<Button
																size="icon"
																className="w-5 h-5"
																variant="destructive"
																onClick={(e) => {
																	clearCache(key, e);
																}}
															>
																<X className="h-3 w-3" />
															</Button>
															<span className="text-sm font-medium text-gray-700 dark:text-gray-200">
																{key}
															</span>
														</div>
														<div className="text-xs">
															{localStorage.getItem(key)?.length} bytes
														</div>
													</div>
												);
											})}
											{/* Clear all btn */}
											<Button
												variant="destructive"
												className="mt-5"
												onClick={(e) => {
													e.preventDefault();
													localStorage.clear();
													toast.success("All Local Storage cleared");
												}}
											>
												Clear all Local Storage
											</Button>
										</div>
									</TabsContent>
								</div>
							</Tabs>
							<div className="post_bottom z-10 absolute bottom-0 right-0 flex w-full items-center justify-between space-x-2 border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
								<div className="l"></div>
								<Button
									type="submit"
									disabled={
										!form.formState.isDirty || form.formState.isSubmitting
									}
								>
									Save changes
								</Button>
							</div>
						</form>
					</Form>
				</>
			)}
		</>
	);
}
