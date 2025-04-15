import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function FieldDropDown(props: { field: any; form: any; key?: string; data?: any; onChange?: any; onChangeVal?: (item: any) => void }) {
	const { field, form, key, data, onChangeVal, onChange } = props;
	const [open, setOpen] = useState(false);
	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						className={cn("justify-between", !field.value && "text-muted-foreground")}>
						{field.value ? data?.find((item: any) => item.id === field.value)?.name : "Select one"}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent
				className="p-0 dark:border-gray-700 max-w-[250px]"
				align="start">
				<Command className="dark:bg-gray-800 dark:border-gray-700 border-0">
					<CommandInput
						placeholder="Search..."
						className="h-9"
						onValueChange={(e) => {
							onChange(e);
						}}
					/>
					<CommandList>
						<CommandEmpty>No data found.</CommandEmpty>
						<CommandGroup>
							{data.map((item: any) => (
								<CommandItem
									value={item.name}
									key={item.id}
									className="cursor-pointer"
									onSelect={() => {
										form.setValue(key, item.id);
										field.onChange(item.id);
										setOpen(false);
										if (onChangeVal) {
											onChangeVal(item);
										}
									}}>
									{item.name}
									<Check className={cn("ml-auto", item.id === field.value ? "opacity-100" : "opacity-0")} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
