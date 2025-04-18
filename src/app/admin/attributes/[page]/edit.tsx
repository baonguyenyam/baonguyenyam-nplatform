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
import { enumAttribute, enumPublished } from "@/lib/enum";

import * as actions from "./actions";

const FormSchema = z.object({
	f_title: z.string().min(2, { message: "Fullname must be at least 2 characters." }),
	f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]], { required_error: "Published is required" }).optional(),
	f_content: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
	f_mapto: z.string().optional().nullable(),
	f_parent: z.string().optional().nullable(),
	f_order: z.number().optional().nullable(),
});

export default function FormEdit(props: any) {
	const { id, onChange } = props;
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const role = useCurrentRole();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_published: "FALSE",
			f_title: "",
			f_content: "",
			f_mapto: enumAttribute[0].value || null,
			f_order: 0,
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const _body = {
			title: values.f_title || "",
			content: values.f_content || "",
			published: values.f_published === "TRUE" ? true : false,
			parent: values.f_parent || null,
			mapto: values.f_mapto || null,
			order: values.f_order || 0,
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
				f_published: res?.data?.published === true ? "TRUE" : "FALSE",
				f_content: res?.data?.content || "",
				f_mapto: res?.data?.mapto || null,
				f_order: res?.data?.order || 0,
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
							name="f_order"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Order</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="0"
											className="w-auto max-w-[100px]"
											{...field}
											value={field.value ?? ""}
											onChange={(e: any) => {
												field.onChange(Number(e.target.value));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="f_mapto"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Map to</FormLabel>
									{FieldSelect({
										field,
										data: enumAttribute.map((item) => ({
											name: item.label,
											id: item.value,
										})),
									})}
									<FormMessage />
								</FormItem>
							)}
						/>
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
