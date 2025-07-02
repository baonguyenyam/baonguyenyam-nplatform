import { FormControl } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { enumOrderStatus, enumPublished } from "@/lib/enum";

export function FieldSelect(props: {
	field: any;
	data: any;
	type?: string;
	placeholder?: string;
	align?: any;
}) {
	const { field, type, placeholder, data, align } = props;

	return (
		<FormControl>
			<Select onValueChange={field.onChange} defaultValue={field.value}>
				<FormControl
					className={`${enumOrderStatus.find((status) => status.value === field.value)?.className ?? enumPublished.find((status) => status.value === field.value)?.className} ${enumOrderStatus.find((status) => status.value === field.value)?.bgClassName ?? enumPublished.find((status) => status.value === field.value)?.bgClassName} ${enumOrderStatus.find((status) => status.value === field.value)?.borderClassName ?? enumPublished.find((status) => status.value === field.value)?.borderClassName}`}
				>
					<SelectTrigger>
						<SelectGroup>
							<SelectValue placeholder={placeholder} />
						</SelectGroup>
					</SelectTrigger>
				</FormControl>
				<SelectContent align={align}>
					{(data ?? []).map((item: any) => (
						<SelectItem
							className={
								enumOrderStatus.find((status) => status.value === item.id)
									?.className ??
								enumPublished.find((status) => status.value === item.id)
									?.className
							}
							value={item.id}
							key={item.id}
						>
							{item.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FormControl>
	);
}
