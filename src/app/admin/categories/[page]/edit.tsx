import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import AppLoading from "@/components/AppLoading";
import { FieldInput } from "@/components/fields/input";
import { FieldSelect } from "@/components/fields/select"; // For 'type' and 'published' status
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCurrentRole } from "@/hooks/useCurrentRole"; // Keep if role affects fields
import { enumPublished, enumType } from "@/lib/enum"; // Use enums

import * as actions from "./actions";

// --- Interfaces ---
// Interface for the data structure expected by the form and API
interface CategoryData {
	id?: string; // Optional for create mode
	title: string;
	slug?: string;
	type?: string;
	published?: boolean;
	// Add other relevant fields
}

// --- Component Props ---
interface FormEditProps {
	id?: string; // ID for editing existing category
	initialData?: CategoryData | any; // Pre-populate form in edit mode
	onChange: (event: string, data?: any) => void; // Callback for events like submit
}

// --- Zod Schema ---
// Define the validation schema for the category form
const FormSchema = z.object({
	f_title: z.string().min(2, { message: "Title must be at least 2 characters." }),
	f_slug: z.string().optional(), // Slug might be auto-generated or optional
	// Ensure the enum values are correctly typed for Zod
	f_type: z.enum(enumType.map((item) => item.value) as [string, ...string[]]).optional(),
	f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]]).optional(),
});

export default function FormEdit({ id, initialData, onChange }: FormEditProps) {
	const [loading, setLoading] = useState(!!id); // Start loading only if editing
	const [data, setData] = useState<CategoryData | {} | null>(null); // Store fetched data if needed elsewhere
	const role = useCurrentRole(); // Get user role if needed for conditional rendering

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_title: initialData?.title || "",
			f_slug: initialData?.slug || "",
			f_type: initialData?.type || enumType[0]?.value, // Default to first type or handle undefined
			f_published: initialData?.published === true ? "TRUE" : "FALSE",
		},
	});

	// Fetch data function for edit mode
	const fetchData = useCallback(async () => {
		if (!id) {
			setLoading(false);
			return; // No need to fetch if creating
		}
		setLoading(true);
		try {
			const res = await actions.getRecord(id); // Use the specific get action
			if (res?.success === "success" && res?.data) {
				const categoryData = res.data;
				setData(categoryData);
				// Reset form with fetched data
				form.reset({
					f_title: categoryData.title || "",
					f_slug: categoryData.slug || "",
					f_type: categoryData.type || enumType[0]?.value, // Handle potential undefined type
					f_published: categoryData.published === true ? "TRUE" : "FALSE",
				});
			} else {
				toast.error("Failed to load category data.");
				setData(null); // Reset data on failure
			}
		} catch (error) {
			console.error("Error fetching category:", error);
			toast.error("An error occurred while fetching category data.");
		} finally {
			setLoading(false);
		}
	}, [id, form]);

	// Fetch data on mount if in edit mode
	useEffect(() => {
		fetchData();
	}, [fetchData]); // Depend only on fetchData

	// Form submission handler
	async function onSubmit(values: z.infer<typeof FormSchema>) {
		const body: Partial<CategoryData> = {
			title: values.f_title,
			slug: values.f_slug || undefined, // Send undefined if empty, backend might auto-generate
			type: values.f_type,
			published: values.f_published === "TRUE",
		};

		// Use update or create action based on presence of id
		const action = id ? actions.updateRecord(id, body) : actions.createRecord(body); // Assuming meta is empty

		try {
			const res = await action;
			if (res.success === "success") {
				toast.success(res.message || (id ? "Category updated successfully!" : "Category created successfully!"));
				onChange("submit", res.data); // Notify parent component
			} else {
				toast.error(res.message || "An error occurred.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("An unexpected error occurred.");
		}
	}

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<Form {...form}>
					{/* Use pb-20 or similar to prevent overlap with bottom bar */}
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-4 pb-20">
						{/* Title Field */}
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

						{/* Slug Field (Optional) */}
						<FormField
							control={form.control}
							name="f_slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									{FieldInput({ field })}
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Type Field */}
						<FormField
							control={form.control}
							name="f_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									{FieldSelect({
										field,
										placeholder: "Select type...",
										data: enumType.map((item) => ({
											id: item.value,
											name: item.label,
										})),
									})}
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Bottom Bar for Actions */}
						<div className="fixed bottom-0 right-0 w-full md:w-[calc(800px-1rem)] border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-between z-10">
							{/* Published Status (Optional, based on role or always shown) */}
							{/* Example: Always show published status for categories */}
							<FormField
								control={form.control}
								name="f_published"
								render={({ field }) => (
									<FormItem className="w-32"> {/* Adjust width as needed */}
										{FieldSelect({
											field,
											placeholder: "Status", // Add placeholder
											data: enumPublished.map((item) => ({
												id: item.value,
												name: item.label,
											})),
										})}
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								disabled={!form.formState.isDirty || form.formState.isSubmitting}>
								{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			)}
		</>
	);
}
