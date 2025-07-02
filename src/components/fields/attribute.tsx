import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function Attribute(props: { form: any }) {
	const { form } = props;

	return (
		<>
			{form.watch("f_attributes")?.map((item: any, index: number) => (
				<div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="col-span-1">
						<FormField
							control={form.control}
							name={`f_attributes.${index}.title`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="col-span-2">
						<FormField
							control={form.control}
							name={`f_attributes.${index}.value`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<div className="flex items-center gap-2">
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<div className="h-full flex items-center justify-center">
											<Button
												type="button"
												size="icon"
												variant="destructive"
												onClick={() => {
													if (
														confirm(
															"Are you sure you want to delete this record?",
														)
													) {
														const updatedAttributes = (
															form.getValues("f_attributes") || []
														).filter((_: any, i: number) => i !== index);
														form.setValue("f_attributes", updatedAttributes);
													}
												}}
												className="text-xs rounded-full w-5 h-5"
											>
												<X className="text-white" />
											</Button>
										</div>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			))}
			<Button
				type="button"
				variant="outline"
				onClick={() => {
					form.setValue("f_attributes", [
						...(form.getValues("f_attributes") || []),
						{
							title: "",
							value: "",
						},
					]);
				}}
				className="text-xs"
			>
				Add Attribute
			</Button>
		</>
	);
}
