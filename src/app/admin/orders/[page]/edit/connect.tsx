import { X } from "lucide-react";
import { toast } from "sonner";

import { FieldDropDown } from "@/components/fields/dropdown";
import { Button } from "@/components/ui/button";

import * as actions from "../actions";

export function ConnectUser({
	form,
	field,
	data,
	users,
	id,
	key,
	model,
	onChange,
}: {
	form?: any;
	field?: any;
	data?: any;
	users?: any;
	id?: any;
	key?: string;
	model?: string;
	onChange?: any;
}) {
	const disconnectUser = async (item: any) => {
		const customerList = document.getElementById("customerList" + key);
		if (customerList) {
			const customer = customerList.querySelector(`[data-id="${item.id}"]`);
			if (customer) {
				(customer as HTMLElement).style.display = "none";
			}
		}
		const res = await actions.disconnectUser(data?.id, item?.id, model, key);
		if (res.success !== "success") {
			toast.error(res.message);
			return;
		}
		toast.success(res.message);
	};

	const connectUser = async (item: any) => {
		const customerList = document.getElementById("customerList" + key);
		if (customerList) {
			const customer = customerList.querySelector(`[data-id="${item.id}"]`);
			if (customer) {
				(customer as HTMLElement).style.display = "none";
			}
			const newItem = document.createElement("span");
			newItem.setAttribute("data-id", item.id);
			newItem.className =
				"text-main-foreground text-sm bg-gray-200 rounded-full px-5 py-2 mr-5 relative dark:bg-gray-700";
			newItem.innerHTML = `${item.name}<button type="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 size-9 text-xs rounded-full w-5 h-5 absolute -top-2 -right-2 z-10"> 
				<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>
				</button>`;
			newItem.querySelector("button")?.addEventListener("click", () => {
				disconnectUser(item);
			});
			customerList.prepend(newItem);
		}

		const res = await actions.connectUser(data?.id, item?.id, model, key);
		if (res.success !== "success") {
			toast.error(res.message);
			return;
		}
		toast.success(res.message);
	};

	return (
		<div className="flex">
			<div
				className="flex items-center whitespace-nowrap flex-wrap space-y-3"
				id={"customerList" + key}
			>
				{id &&
					key &&
					data &&
					data[key]?.length > 0 &&
					data[key]?.map((item: any) => {
						return (
							<span
								data-id={item.id}
								key={item.id}
								className="text-main-foreground text-sm bg-gray-200 rounded-full px-5 py-2 mr-5 relative dark:bg-gray-700"
							>
								{item.name}
								<Button
									variant="destructive"
									size="icon"
									type="button"
									className="text-xs rounded-full w-5 h-5 absolute -top-2 -right-2 z-10"
									onClick={() => {
										disconnectUser(item);
									}}
								>
									<X className="text-white" />
								</Button>
							</span>
						);
					})}
				<div className="mb-3">
					{FieldDropDown({
						form,
						field,
						data: users,
						key: "f_" + key,
						onChange: (e: any) => {
							if (onChange) {
								onChange(e);
							}
						},
						onChangeVal: (e: any) => {
							if (id) connectUser(e);
						},
					})}
				</div>
			</div>
		</div>
	);
}
