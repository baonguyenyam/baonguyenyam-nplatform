import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColorPicker } from "antd";
import { toast } from "sonner";
import { z } from "zod";

import AppLoading from "@/components/AppLoading";
import { FieldUpload } from "@/components/fields/upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { appState } from "@/lib/appConst";
import { checkStringIsTextOrColorHexOrURL } from "@/lib/utils";

import * as actions from "./actions";

const FormSchema = z.object({
	f_key: z.string().min(2, { message: "Fullname must be at least 2 characters." }),
	f_value: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
});

export default function FormEdit(props: any) {
	const { id, parent, type, onChange } = props;
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [val, setVal] = useState<any>("text");
	const role = useCurrentRole();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_key: "",
			f_value: "",
		},
	});

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const _body = [
			{
				key: values.f_key,
				value: values.f_value,
			},
		];
		if (data) {
			const update = await actions.updateRecord(id, _body);
			if (update?.success !== "success") {
				toast.error(update.message);
				return;
			}
			toast.success(update.message);
		} else {
			const create = await actions.createRecord(parent, _body);
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
				f_key: res.data.key || "",
				f_value: res.data.value || "",
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
							name="f_key"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="f_value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									{type === "text" && (
										<FormControl>
											<Input
												placeholder="Value"
												{...field}
											/>
										</FormControl>
									)}
									{type !== "text" && (
										<Tabs
											onValueChange={(e) => {
												setVal(e);
											}}
											defaultValue={checkStringIsTextOrColorHexOrURL(field?.value || "")}
											className="w-full">
											<TabsList>
												<TabsTrigger value="text">Text</TabsTrigger>
												<TabsTrigger value="color">Color</TabsTrigger>
												<TabsTrigger value="photo">Photo</TabsTrigger>
											</TabsList>
											<TabsContent value="text">
												{(val === "text" || val === undefined || !val || checkStringIsTextOrColorHexOrURL(field?.value || "") === "text") && (
													<FormControl>
														<Input
															placeholder="Value"
															{...field}
															onChange={(e) => {
																field.onChange(e.target.value);
															}}
														/>
													</FormControl>
												)}
											</TabsContent>
											<TabsContent value="color">
												{(val === "color" || checkStringIsTextOrColorHexOrURL(field?.value || "") === "color") && (
													<ColorPicker
														defaultValue={field?.value || "#000000"}
														showText={true}
														onChange={(color) => {
															field.onChange(color?.toHexString?.());
														}}
													/>
												)}
											</TabsContent>
											<TabsContent value="photo">
												{(val === "photo" || checkStringIsTextOrColorHexOrURL(field?.value || "") === "url") && (
													<FormControl>
														{FieldUpload({
															field,
															data,
															multiple: false,
															preview: true,
															accept: appState.ACCEPTED_IMG_FILE_TYPES,
															onChange: (e: any) => {
																field.onChange(e[0]?.data[0]?.url);
															},
														})}
													</FormControl>
												)}
											</TabsContent>
										</Tabs>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
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
