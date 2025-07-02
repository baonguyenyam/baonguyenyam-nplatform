import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { AppEditor } from "@/components/AppEditor";
import AppLoading from "@/components/AppLoading";
import { FieldCheckbox } from "@/components/fields/checkbox";
import { ImageList } from "@/components/fields/imagelist";
import { FieldInput } from "@/components/fields/input";
import { FieldSelect } from "@/components/fields/select";
import { FieldSelectAttribute } from "@/components/fields/selectattribute";
import { FieldUpload } from "@/components/fields/upload";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { appState } from "@/lib/appConst";
import { enumPublished } from "@/lib/enum";
import { genSlug, randomOrderString, stringToKeyValue } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";

// --- Interfaces ---
interface Category {
	id: number; // Or string, depending on your data model
	name: string;
	type?: string; // Optional: if categories are typed (e.g., 'post', 'product')
}

interface PostMeta {
	key: string;
	value: string;
}

interface AttributeItem {
	id: number;
	title: string;
	mapto: string;
	children?: {
		id: number;
		title: string;
		type: "text" | "select" | "checkbox"; // Add other types if needed
		options?: string[]; // For select/checkbox
	}[];
}

interface PostData {
	id: string; // Or number, depending on your data model
	title: string;
	slug: string;
	content?: string;
	published?: boolean;
	image?: string; // URL of the featured image
	type?: string; // e.g., 'post', 'page'
	categories?: Category[]; // Array of associated categories
	files?: { id: string }[]; // Array of associated file objects (adjust structure as needed)
	data?: string; // JSON string potentially holding dynamic attribute data
	meta?: PostMeta[]; // Array for metadata like SEO keywords, etc.
	// Add any other relevant fields for your Post data structure
}

export default function FormEdit(props: any) {
	// Build the form schema using Zod
	let FormSchema = z.object({
		f_title: z
			.string()
			.min(2, { message: "Fullname must be at least 2 characters." }),
		f_slug: z
			.string()
			.min(10, { message: "Fullname must be at least 10 characters." }),
		f_content: z
			.string()
			.optional()
			.transform((e) => (e === "" ? undefined : e)),
		f_published: z
			.enum(
				enumPublished.map((item: any) => item.value) as [string, ...string[]],
				{ required_error: "Published is required" },
			)
			.optional(),
		f_categories: z
			.array(z.number())
			.refine((data) => data.length > 0 && data[0] !== 0, {
				message: "Please select at least one category",
			})
			.optional(),
		f_file: z
			.any()
			.optional()
			.transform((e) => (e === "" ? undefined : e)),
		f_seo_keywords: z
			.string()
			.optional()
			.transform((e) => (e === undefined ? undefined : e)),
	});
	const type = "post";
	const { id, onChange } = props;
	const memoriez = useAppSelector((state) => state.categoriesState.data);
	const categories = useMemo(() => {
		return memoriez.filter((item: Category) => item?.type === type);
	}, [memoriez]);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<PostData | {} | null>(null);
	const [thumbnail, setThumbnail] = useState<any>(null);
	const [imgs, setImgs] = useState<any>([]);
	const role = useCurrentRole();

	// Load the attribute data from the store
	const attributeData = useAppSelector((state) => state?.attributeState.data);
	const atts = useMemo(() => {
		if (attributeData) {
			return attributeData.filter((item: AttributeItem) => item.mapto === type);
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
			f_title: "",
			f_slug: "",
			f_content: "",
			f_published: "FALSE",
			f_categories: [],
			f_seo_keywords: "",
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
		// Update or create post
		const _body = {
			title: values.f_title,
			content: values.f_content,
			published: values.f_published === "TRUE" ? true : false,
			slug: !id
				? genSlug(values.f_title + " " + randomOrderString(10))
				: values.f_slug,
			image: !id ? thumbnail : undefined,
			type: type,
			categories: {
				connect: values.f_categories?.map((category: number) => {
					return { id: category };
				}),
			},
			files: {
				connect: imgs ? imgs.map((item: any) => ({ id: item?.id })) : undefined,
			},
			data: JSON.stringify(attrs),
		};
		const _meta = {
			data: [
				{
					key: "seo_keywords",
					value: values.f_seo_keywords,
				},
			],
		};

		const res = data
			? await actions.updateRecord(id, _body, _meta)
			: await actions.createRecord(_body, _meta);
		if (res.success !== "success") {
			toast.error(res.message);
			return;
		}
		toast.success(res.message);
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
			setImgs(res?.data?.files || []);
			form.reset({
				f_title: res?.data?.title || "",
				f_content: res?.data?.content || "",
				f_published: res?.data?.published === true ? "TRUE" : "FALSE",
				f_categories: res?.data?.categories?.map((item: any) => item.id) || [],
				f_seo_keywords:
					res?.data?.meta?.find((item: any) => item.key === "seo_keywords")
						?.value || "",
				f_slug: res?.data?.slug || "",
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
						const childValue = (
							_attribute?.find((c: any) => c.id === item.id) || {}
						)?.data?.find((v: any) => v.id === child.id)?.value;
						form.setValue(
							childFieldName as keyof z.infer<typeof FormSchema>,
							childValue || "",
						);
					}
					if (child?.type === "checkbox") {
						const childValue =
							(
								_attribute?.find((c: any) => c.id === item.id) || {}
							)?.data?.find((v: any) => v.id === child.id)?.value || "[]";
						form.setValue(
							childFieldName as keyof z.infer<typeof FormSchema>,
							childValue || "",
						);
					}
					if (child?.type === "text") {
						const childValue = (
							_attribute?.find((c: any) => c.id === item.id) || {}
						)?.data?.find((v: any) => v.id === child.id)?.value;
						form.setValue(
							childFieldName as keyof z.infer<typeof FormSchema>,
							childValue || "",
						);
					}
				});
			});
			setThumbnail(res?.data?.image);
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
						className="w-full space-y-6 pb-15"
					>
						<FormField
							control={form.control}
							name="f_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									{FieldInput({
										field,

										onKeyDown: (e: any) => {
											const str = e.target.value;
											if (!id) {
												form.setValue(
													"f_slug",
													genSlug(str + " " + randomOrderString(10)),
												);
											}
										},
									})}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="f_slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									{FieldInput({
										className: "h-7! px-1! py-0!",
										field,
									})}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="f_content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
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
							name="f_categories"
							render={() => (
								<FormItem>
									<FormLabel>Categories</FormLabel>
									<div className="grid grid-cols-2 lg:grid-cols-4 mt-3 gap-4">
										{FieldCheckbox({ data: categories, form })}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Tabs defaultValue="file">
							<TabsList className="w-full">
								<TabsTrigger value="file">Files</TabsTrigger>
								<TabsTrigger value="seo">SEO</TabsTrigger>
							</TabsList>
							<TabsContent value="file" className="mt-4">
								{ImageList({
									role,
									data: imgs,
									thumbnail,
									setThumbnail,
									fetchData,
									onChange: (e: any) => {
										changeFeature(e);
									},
								})}
								<div className="mt-3">
									<FormField
										control={form.control}
										name="f_file"
										render={({ field }) => (
											<FormItem>
												{FieldUpload({
													field,
													data: imgs,
													preview: false,
													accept: appState.ACCEPTED_IMG_FILE_TYPES,
													onChange: (e: any) => {
														field.onChange(e[0]?.data[0]?.url);
														setThumbnail(e[0]?.data[0]?.url);
														setImgs((prev: any) => [...prev, e[0]?.data[0]]);
													},
												})}
											</FormItem>
										)}
									/>
								</div>
							</TabsContent>
							<TabsContent value="seo" className="mt-4">
								<FormField
									control={form.control}
									name="f_seo_keywords"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Keywords</FormLabel>
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
							</TabsContent>
						</Tabs>

						{atts?.length > 0 && (
							<Tabs defaultValue={atts?.[0]?.id} className="mb-10">
								<TabsList className="mt-5 mb-2">
									{atts?.map((item: any) => (
										<TabsTrigger key={item.id} value={item.id}>
											{item.title}
										</TabsTrigger>
									))}
								</TabsList>
								<div className="grow text-start">
									{atts?.map((item: any) => (
										<TabsContent
											key={item.id}
											value={item.id}
											className="space-y-15"
										>
											<div className="grid grid-cols-3 gap-5">
												{item?.children?.map((child: any) => {
													const fieldName = `f_${stringToKeyValue(item.title)}_${item.id}_${child.id}`;
													return (
														<Fragment key={child.id}>
															<FormField
																control={form.control}
																name={
																	fieldName as keyof z.infer<typeof FormSchema>
																}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>{child.title}</FormLabel>
																		{child?.type === "text" && (
																			<FormControl>
																				<Input {...field} />
																			</FormControl>
																		)}
																		{(child?.type === "select" ||
																			child?.type === "checkbox") && (
																			<>
																				{FieldSelectAttribute({
																					mode: id ? "edit" : "create",
																					field,
																					form,
																					type: child?.type,
																					key:
																						"f_" +
																						stringToKeyValue(item.title) +
																						"_" +
																						item.id,
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
								disabled={
									!form.formState.isDirty || form.formState.isSubmitting
								}
							>
								Save changes
							</Button>
						</div>
					</form>
				</Form>
			)}
		</>
	);
}
