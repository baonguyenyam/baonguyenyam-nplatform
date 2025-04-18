import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, getIdFromAttributeKey } from "@/lib/utils";

import * as actions from "./actions";

export function FieldSelectAttribute(props: any) {
	const { field, form, placeholder, align, id, key, type, mode } = props;
	const [open, setOpen] = useState(false);
	const [data, setData] = useState<any>(null);
	const [select, setSelect] = useState<any>([]);

	const searchAll = (e: any) => {
		actions.searchAttribute(id, e).then((res: any) => {
			if (res.success === "success") {
				// data: [
				// 	{
				// 		"id": Number,
				// 		"key": String,
				// 		"value": String,
				// 	}
				// ]
				setData(res.data);
			}
		});
	};

	const fetchData = useCallback(async () => {
		// Select 3
		if (type === "select" && mode === "edit") {
			const attID = getIdFromAttributeKey(field.name);
			await actions.getAttribute(Number(attID), field.value).then((res: any) => {
				if (res.success === "success") {
					// data: {
					// 	"id": Number,
					// 	"createdAt": Date,
					// 	"updatedAt": Date,
					// 	"key": String,
					// 	"value": String,
					// 	"data": any,
					// 	"attributeId": Number,
					// }
					if (res.data) {
						setData([res.data]);
					}
				}
			});
		}
		// ["Radio 3","Radio 2"]
		if (type === "checkbox" && mode === "edit") {
			const attID = getIdFromAttributeKey(field.name);
			const arrText = JSON.parse(field.value);
			const arr: any[] = [];
			for (let i = 0; i < arrText.length; i++) {
				await actions.getAttribute(Number(attID), arrText[i]).then((res: any) => {
					if (res.success === "success") {
						// data: {
						// 	"id": Number,
						// 	"createdAt": Date,
						// 	"updatedAt": Date,
						// 	"key": String,
						// 	"value": String,
						// 	"data": any,
						// 	"attributeId": Number,
						// }
						if (res.data) {
							const _item = {
								id: res?.data?.id,
								key: res?.data?.key,
								value: res?.data?.value,
							};
							if (res.data) {
								arr.push(_item);
							}
						}
					}
				});
			}
			if (arr.length > 0) {
				const arrText = arr.map((item: any) => item.value);
				setSelect(arrText);
				setData(arr);
			}
		}
	}, [field.name, field.value, mode, type]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						onClick={() => {
							searchAll("");
						}}
						className={cn("justify-between", !field.value && "text-muted-foreground")}>
						{type === "select" && <>{field.value ? data?.find((item: any) => item.value === field.value)?.key : "Select one"}</>}
						{type === "checkbox" && (
							<>
								{select && select.length > 0
									? select.map((item: any) => (
										<span
											key={item}
											className="mr-2">
											{data?.find((i: any) => i.value === item)?.key},
										</span>
									))
									: "Select one"}
							</>
						)}
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
						onValueChange={searchAll}
					/>
					<CommandList>
						<CommandEmpty>No data found.</CommandEmpty>
						{type === "select" && (
							<CommandGroup>
								{data &&
									data?.map((item: any) => (
										<CommandItem
											key={item.id}
											value={item.key}
											className="cursor-pointer"
											onSelect={() => {
												form.setValue(key, item.value);
												field.onChange(item.value);
												setOpen(false);
											}}>
											<div className="flex items-center">
												<div
													className="w-4 h-4 rounded-full mr-2"
													style={{ backgroundColor: item.value }}
												/>
												{item.key}
											</div>
											{field.value === item.value && <Check className="ml-auto h-4 w-4" />}
										</CommandItem>
									))}
							</CommandGroup>
						)}
						{type === "checkbox" && (
							<CommandGroup>
								{data &&
									data?.map((item: any) => (
										<CommandItem
											key={item.id}
											value={item.key}
											className="cursor-pointer"
											onSelect={() => {
												setSelect((prev: any) => {
													if (prev.includes(item.value)) {
														return prev.filter((i: any) => i !== item.value);
													} else {
														return [...prev, item.value];
													}
												});
												form.setValue(key, JSON.stringify(select));
												field.onChange(JSON.stringify(select));
												setOpen(false);
											}}>
											<div className="flex items-center">
												<div
													className="w-4 h-4 rounded-full mr-2"
													style={{ backgroundColor: item.value }}
												/>
												{item.key}
											</div>
											{select.includes(item.value) && <Check className="ml-auto h-4 w-4" />}
										</CommandItem>
									))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
