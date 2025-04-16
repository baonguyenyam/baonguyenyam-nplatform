import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { AppEditor } from "@/components/AppEditor";
import AppLoading from "@/components/AppLoading";
import { FieldSelect } from "@/components/fields/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { enumPublished, enumType } from "@/lib/enum";

import * as actions from "./actions";

const FormSchema = z.object({
	f_title: z.string().min(2, { message: "Fullname must be at least 2 characters." }),
	f_content: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]], { required_error: "Published is required" }).optional(),
	f_type: z.enum(enumType.map((item) => item.value) as [string, ...string[]], { required_error: "Type is required" }).optional(),
});

export default function FormEdit(props: any) {
	const { id, onChange } = props;
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const role = useCurrentRole();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_title: "",
			f_content: "",
			f_published: "FALSE",
			f_type: "post",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const _body = {
			title: values.f_title,
			content: values.f_content,
			published: values.f_published === "TRUE" ? true : false,
			type: values.f_type,
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
			toast.success(create.message);
		}
		onChange("submit", values);
	}

	const fetchData = useCallback(async () => {
		const res = await actions.getRecord(id);
		if (res?.success === "success" && res?.data) {
			setData(res.data);
			form.reset({
				f_title: res?.data?.title || "",
				f_content: res?.data?.content || "",
				f_published: res?.data?.published === true ? "TRUE" : "FALSE",
				f_type: res?.data?.type || "post",
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
							name="f_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									{FieldSelect({
										field,
										data: enumType.map((item) => ({
											id: item.value,
											name: item.label,
										})),
									})}
									<FormMessage />
								</FormItem>
							)}
						/>
						{role === "ADMIN" && (
							<FormField
								control={form.control}
								name="f_published"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Published</FormLabel>
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
						<div className="post_bottom z-10 absolute bottom-0 right-0 flex w-full items-center justify-end space-x-2 rounded-b-lg border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
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
