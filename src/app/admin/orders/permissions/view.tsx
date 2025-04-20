"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
// import { Lock } from "lucide-react"; // Lock icon seems unused, can be removed if not needed
import { toast } from "sonner";

import AppLoading from "@/components/AppLoading";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { enumOrderType } from "@/lib/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";
import { setAttribute } from "@/store/attributeSlice";

import * as actions from "./actions";

// Define a type for the permission structure for better type safety
type PermissionItem = {
	id: number;
	permission: Array<{ key: string; checked: boolean }>;
};

export default function View() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const memoriezAttrs = useAppSelector((state) => state.attributeState.data);
	const att_orders = useMemo(() => memoriezAttrs?.filter((item: any) => item.mapto === "order"), [memoriezAttrs]);
	const memoriezPermission = useAppSelector((state) => (state.appState && "order_permission" in state.appState ? state.appState.order_permission : []));

	// Use the PermissionItem type for better state management
	const [saveData, setSaveData] = useState<PermissionItem[]>([]);

	// Initialize saveData when component mounts or permissions change
	useEffect(() => {
		// Initialize or update saveData based on the current permissions from the store
		const initialSaveData = att_orders.flatMap((item: any) =>
			item.children.map((child: any) => {
				// Find existing permissions for this child ID from the Redux store
				const existingPermission = (memoriezPermission as PermissionItem[])?.find(p => p.id === child.id);
				return {
					id: child.id,
					permission: enumOrderType.map((type) => {
						// Check if there's an existing permission setting for this type, otherwise default to false
						const perm = existingPermission?.permission.find(p => p.key === type.value);
						return {
							key: type.value,
							checked: perm ? perm.checked : false, // Default to false if not found
						};
					}),
				};
			})
		);
		setSaveData(initialSaveData);
	}, [att_orders, memoriezPermission]); // Rerun when attributes or stored permissions change


	const fetchData = useCallback(async () => {
		setLoading(true); // Set loading true at the start
		try {
			const all = await actions.getAll({ min: true, published: true });
			if (all?.data) {
				dispatch(setAttribute(all?.data));
			}
			// Fetch initial permissions if needed or rely on useEffect initialization
			// Example: Fetch app settings which might contain order_permission
			// const appSettings = await someActionToGetAppSettings();
			// if (appSettings?.order_permission) {
			//   dispatch(SET_APP_STATE({ order_permission: JSON.parse(appSettings.order_permission) }));
			// }
		} catch (error) {
			console.error("Failed to fetch data:", error);
			toast.error("Failed to load initial data.");
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	// Handler for Switch changes
	const handleCheckedChange = (childId: number, permissionKey: string, checked: boolean) => {
		setSaveData(prevSaveData => {
			// Create a deep copy to avoid direct state mutation
			const newData = JSON.parse(JSON.stringify(prevSaveData));
			// Find the item with the matching childId
			const itemIndex = newData.findIndex((item: PermissionItem) => item.id === childId);

			if (itemIndex !== -1) {
				// Find the specific permission within that item
				const permissionIndex = newData[itemIndex].permission.findIndex((perm: { key: string }) => perm.key === permissionKey);
				if (permissionIndex !== -1) {
					// Update the checked status
					newData[itemIndex].permission[permissionIndex].checked = checked;
				} else {
					// If permission key doesn't exist (shouldn't happen with proper init), add it
					newData[itemIndex].permission.push({ key: permissionKey, checked: checked });
				}
			} else {
				// If childId doesn't exist (shouldn't happen with proper init), add it
				newData.push({
					id: childId,
					permission: [{ key: permissionKey, checked: checked }]
				});
			}
			return newData; // Return the updated array
		});
	};

	// Function to get the checked state from saveData
	const getCheckedState = (childId: number, permissionKey: string): boolean => {
		const item = saveData.find(item => item.id === childId);
		const permission = item?.permission.find(perm => perm.key === permissionKey);
		return permission ? permission.checked : false; // Default to false if not found
	};


	const template = (items: any[]) => {
		// Check if items is valid before mapping
		if (!items || items.length === 0) {
			return <p>No attribute groups found for orders.</p>;
		}

		return (
			<div className="w-full overflow-auto">
				{items.map((item: any) => (
					<div
						key={item.id}
						className="text-sm gap-4 mb-10">
						<div className="">
							<h3 className="text-xl font-semibold mb-2 flex items-center gap-2 border-b pb-2 mb-5">
								<span>{item.title}</span>
							</h3>
							{/* Check if children exist and have items */}
							{item.children && item.children.length > 0 ? (
								<div className="flex flex-row items-center gap-10 flex-wrap"> {/* Added flex-wrap */}
									{item.children.map((child: any) => (
										<div key={child.id} className=""> {/* Added margin-bottom */}
											<div
												className="flex items-center gap-2 uppercase text-xs font-bold"> {/* Made title bold */}
												{child.title}
											</div>
											<div className="mt-2 flex flex-col space-y-1">
												{enumOrderType.map((type) => (
													<div
														className="flex items-center gap-2 text-xs" // Ensure items are aligned
														key={`${child.id}-${type.value}`}>
														<Switch
															// className="mr-2" // Removed margin, using gap in parent instead
															id={`${child.id}-${type.value}`}
															name={`${child.id}-${type.value}`}
															// Use getCheckedState to ensure UI reflects saveData
															checked={getCheckedState(child.id, type.value)}
															// No need for defaultChecked if using controlled 'checked'
															onCheckedChange={(checked) => {
																handleCheckedChange(child.id, type.value, checked);
															}}
														/>
														<label htmlFor={`${child.id}-${type.value}`}>{type.label}</label>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-xs text-gray-500">No attributes in this group.</p> // Handle empty children
							)}
						</div>
					</div>
				))}
			</div>
		);
	};


	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSaveChanges = async () => {
		// Use the current saveData state directly
		const json = JSON.stringify(saveData);
		const _body = {
			order_permission: json,
		};

		try {
			const update = await actions.updateAllRecord(_body);
			if (update?.success !== "success") {
				toast.error(update.message || "Failed to update permissions.");
				return;
			}
			toast.success("Order permission updated successfully");

			// Save the updated permissions to the global appState
			dispatch(SET_APP_STATE({ order_permission: saveData }));
		} catch (error) {
			console.error("Failed to save changes:", error);
			toast.error("An error occurred while saving changes.");
		}
	};

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<div className="flex flex-col mt-10">
					{template(att_orders)}
					<div className="flex mt-6"> {/* Added margin-top */}
						<Button
							className="px-4 py-2 inline-flex" // Removed mt-4 as added to parent div
							onClick={handleSaveChanges}>
							Save Changes
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
