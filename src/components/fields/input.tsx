import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FieldInput(props: any) {
	const { field } = props;

	return (
		<FormControl>
			<Input
				placeholder={props?.placeholder || ""}
				className={props?.className || ""}
				type={props?.ype || "text"}
				onChange={props?.onChange}
				onBlur={props?.onBlur}
				onFocus={props?.onFocus}
				onKeyDown={props?.onKeyDown}
				{...field}
			/>
		</FormControl>
	);
}
