import { useCallback, useEffect, useMemo, useState } from "react";
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
import { FieldUpload } from "@/components/fields/upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { appState } from "@/lib/appConst";
import { enumPublished } from "@/lib/enum";
import { genSlug, randomOrderString } from "@/lib/utils";
import { useAppSelector } from "@/store";

import * as actions from "./actions";

const FormSchema = z.object({
	f_title: z.string().min(2, { message: "Fullname must be at least 2 characters." }),
	f_content: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]], { required_error: "Published is required" }).optional(),
	f_categories: z
		.array(z.number())
		.refine((data) => data.length > 0 && data[0] !== 0, { message: "Please select at least one category" })
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

export default function FormEdit(props: any) {
	const type = "product";
	const { id, onChange } = props;
	const memoriez = useAppSelector((state) => state.categoriesState.data);
	const categories = useMemo(() => {
		return memoriez.filter((item) => item?.type === type);
	}, [memoriez]);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any>(null);
	const [thumbnail, setThumbnail] = useState<any>(null);
	const [imgs, setImgs] = useState<any>([]);
	const role = useCurrentRole();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_title: "",
			f_content: "",
			f_published: "FALSE",
			f_categories: [],
			f_seo_keywords: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		// Update or create post
		const _body = {
			title: values.f_title,
			content: values.f_content,
			published: values.f_published === "TRUE" ? true : false,
			slug: genSlug(values.f_title + " " + randomOrderString(10)),
			image: !id ? thumbnail : undefined,
			type: type,
			categories: {
				connect: values.f_categories?.map((category: any) => {
					return { id: category };
				}),
			},
			files: {
				connect: imgs ? imgs.map((item: any) => ({ id: item?.data[0]?.id })) : undefined,
			},
		};
		const _meta = {
			data: [
				{
					key: "seo_keywords",
					value: values.f_seo_keywords,
				},
			],
		};

		const res = data ? await actions.updateRecord(id, _body, _meta) : await actions.createRecord(_body, _meta);
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
			form.reset({
				f_title: res?.data?.title || "",
				f_content: res?.data?.content || "",
				f_published: res?.data?.published === true ? "TRUE" : "FALSE",
				f_categories: res?.data?.categories?.map((item: any) => item.id) || [],
				f_seo_keywords: res?.data?.meta?.find((item: any) => item.key === "seo_keywords")?.value || "",
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
									<div className="grid grid-cols-2 lg:grid-cols-4 mt-3 gap-4">{FieldCheckbox({ data: categories, form })}</div>
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
						<Tabs defaultValue="file">
							<TabsList className="w-full">
								<TabsTrigger value="file">Files</TabsTrigger>
								<TabsTrigger value="seo">SEO</TabsTrigger>
							</TabsList>
							<TabsContent
								value="file"
								className="mt-4">
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
							</TabsContent>
							<TabsContent
								value="seo"
								className="mt-4">
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
