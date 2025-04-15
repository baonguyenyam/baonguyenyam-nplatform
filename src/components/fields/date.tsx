import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function FieldDate(props: { field: any }) {
	const { field } = props;
	const [open, setOpen] = useState(false);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant={"outline"}
						className={cn("text-left font-normal", !field.value && "text-muted-foreground")}>
						{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700"
				align="start">
				<Calendar
					mode="single"
					selected={field.value}
					onSelect={(date) => {
						field.onChange(date);
						setOpen(false);
					}}
					// disabled={(date) =>
					// 	date > new Date() || date < new Date("1900-01-01")
					// }
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
