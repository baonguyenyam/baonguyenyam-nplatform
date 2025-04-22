import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import AppLoading from "@/components/AppLoading";
import { FieldInput } from "@/components/fields/input";
import { FieldSelect } from "@/components/fields/select"; // For 'published' status
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCurrentRole } from "@/hooks/useCurrentRole"; // Keep if role affects fields
import { enumPublished } from "@/lib/enum"; // Use for published status

import * as actions from "./actions";

// --- Interfaces ---
// Interface for the data structure expected by the form and API
interface VendorData {
	id?: string; // Optional for create mode
	name: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	company?: string;
	zip?: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	published?: boolean; // Use boolean for internal logic, string for API compatibil
	// Add other relevant fields
	type: string; // Vendor type
}

// --- Zod Schema ---
// Define the validation schema for the vendor form
const FormSchema = z.object({
	f_email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal("")), // Allow empty string
	f_phone: z.string().optional(),
	f_address: z.string().optional(),
	f_city: z.string().optional(),
	f_state: z.string().optional(),
	f_country: z.string().optional(),
	// Use enum for published status for consistency
	f_published: z.enum(enumPublished.map((item) => item.value) as [string, ...string[]]).optional(),
	f_firstname: z.string().optional(),
	f_lastname: z.string().optional(),
	f_zip: z.string().optional(),
	f_company: z.string().optional(),
});

// --- Component Props ---
interface FormEditProps {
	id?: string; // ID for editing existing vendor
	initialData?: VendorData | any; // Pre-populate form in edit mode
	onChange: (event: string, data?: any) => void; // Callback for events like submit
}

export default function FormEdit({ id, initialData, onChange }: FormEditProps) {
	const type = "vendor";
	const [loading, setLoading] = useState(!!id); // Start loading only if editing
	const [data, setData] = useState<VendorData | null>(initialData || null); // Store fetched data if needed elsewhere
	const role = useCurrentRole(); // Get user role if needed for conditional rendering

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			f_email: initialData?.email || "",
			f_phone: initialData?.phone || "",
			f_address: initialData?.address || "",
			f_city: initialData?.city || "",
			f_state: initialData?.state || "",
			f_country: initialData?.country || "",
			f_published: initialData?.published ? "TRUE" : "FALSE",
			f_firstname: initialData?.first_name || "",
			f_lastname: initialData?.last_name || "",
			f_zip: initialData?.zip || "",
			f_company: initialData?.company || "",
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
				const vendorData = res.data as VendorData;
				setData(vendorData);
				// Reset form with fetched data
				form.reset({
					f_email: vendorData.email || "",
					f_phone: vendorData.phone || "",
					f_address: vendorData.address || "",
					f_city: vendorData.city || "",
					f_state: vendorData.state || "",
					f_country: vendorData.country || "",
					f_published: vendorData.published === true ? "TRUE" : "FALSE",
					f_firstname: vendorData.first_name || "",
					f_lastname: vendorData.last_name || "",
					f_zip: vendorData.zip || "",
					f_company: vendorData.company || "",
				});
			} else {
				toast.error("Failed to load vendor data.");
				setData(null); // Reset data on failure
			}
		} catch (error) {
			console.error("Error fetching vendor:", error);
			toast.error("An error occurred while fetching vendor data.");
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
		const body: Partial<VendorData> = {
			name: values.f_firstname + " " + values.f_lastname,
			email: values.f_email || undefined, // Send undefined if empty
			phone: values.f_phone || undefined,
			address: values.f_address || undefined,
			city: values.f_city || undefined,
			state: values.f_state || undefined,
			country: values.f_country || undefined,
			published: values.f_published === "TRUE" ? true : false,
			first_name: values.f_firstname || undefined,
			last_name: values.f_lastname || undefined,
			zip: values.f_zip || undefined,
			company: values.f_company || undefined,
			type: type,
		};

		// Use update or create action based on presence of id
		const action = id ? actions.updateRecord(id, body) : actions.createRecord(body); // Assuming meta is empty for vendors

		try {
			const res = await action;
			if (res.success === "success") {
				toast.success(res.message || (id ? "Vendor updated successfully!" : "Vendor created successfully!"));
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
						{/* Name Field */}
						<div className="grid grid-cols-2 gap-5">
							<FormField
								control={form.control}
								name="f_firstname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										{FieldInput({ field })}
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
										{FieldInput({ field })}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Email Field */}
						<FormField
							control={form.control}
							name="f_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									{FieldInput({ field, type: "email" })}
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
									{FieldInput({ field })}
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Address Fields - Consider grouping */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="f_city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										{FieldInput({ field })}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="f_state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State / Province</FormLabel>
										{FieldInput({ field })}
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
										{FieldInput({ field })}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="f_zip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ZIP / Postal Code</FormLabel>
										{FieldInput({ field })}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="f_phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										{FieldInput({ field, type: "tel" })}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="f_company"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company</FormLabel>
										{FieldInput({ field })}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Bottom Bar for Actions */}
						<div className="fixed bottom-0 right-0 w-full md:w-[calc(800px-1rem)] border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-between z-10">
							{/* Published Status (Optional, based on role) */}
							{role === "ADMIN" && ( // Example: Only admins can set published status
								<FormField
									control={form.control}
									name="f_published"
									render={({ field }) => (
										<FormItem className="w-32">
											{" "}
											{/* Adjust width as needed */}
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
							)}
							{/* Spacer if published status is not shown */}
							{role !== "ADMIN" && <div />}

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
