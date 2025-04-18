import { FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enumOrderStatus } from "@/lib/enum";

export function FieldSelect(props: { field: any; data: any; type?: string; placeholder?: string; align?: any }) {
	const { field, type, placeholder, data, align } = props;

	return (
		<FormControl>
			<Select
				onValueChange={field.onChange}
				defaultValue={field.value}>
				<FormControl>
					<SelectTrigger>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
				</FormControl>
				<SelectContent
					align={align}
				>
					{(data ?? []).map((item: any) => (
						<SelectItem
							className={enumOrderStatus.find((status) => status.value === item.id)?.className}
							value={item.id}
							key={item.id}>
							{item.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FormControl>
	);
}
