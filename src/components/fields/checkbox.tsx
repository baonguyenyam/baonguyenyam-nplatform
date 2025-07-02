import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";

export function FieldCheckbox(props: { form: any; data: any }) {
	const { data, form } = props;

	return (
		<>
			{data.map((item: any) => (
				<FormField
					key={item.id}
					control={form.control}
					name="f_categories"
					render={({ field }) => {
						return (
							<FormItem
								key={item.id}
								className="flex flex-row items-start space-x-1 space-y-0"
							>
								<FormControl>
									<CheckboxPrimitive.Root
										data-slot="checkbox"
										className={
											"peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
										}
										checked={field.value?.includes(item.id)}
										onCheckedChange={(checked) => {
											return checked
												? field.onChange([...(field.value || []), item.id])
												: field.onChange(
														field.value?.filter(
															(value: any) => value !== item.id,
														),
													);
										}}
									>
										<CheckboxPrimitive.Indicator
											data-slot="checkbox-indicator"
											className="flex items-center justify-center text-current transition-none"
										>
											<CheckIcon className="size-3.5" />
										</CheckboxPrimitive.Indicator>
									</CheckboxPrimitive.Root>
								</FormControl>
								<FormLabel className="text-sm font-normal whitespace-nowrap truncate overflow-ellipsis">
									{item.title}
								</FormLabel>
							</FormItem>
						);
					}}
				/>
			))}
		</>
	);
}
