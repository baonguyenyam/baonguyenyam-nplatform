"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { produce } from "immer"; // Import immer
import { toast } from "sonner";

import AppLoading from "@/components/AppLoading";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { enumOrderType } from "@/lib/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { SET_APP_STATE } from "@/store/appSlice";
import { setAttribute } from "@/store/attributeSlice";

import * as actions from "./actions";

// Define a clearer type for permission structure
type PermissionItem = {
	key: string;
	checked: boolean;
};

type AttributePermission = {
	id: number; // Corresponds to child.id
	permission: PermissionItem[];
};

export default function View() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const memoriezAttrs = useAppSelector((state) => state.attributeState.data);
	const att_orders = useMemo(() => memoriezAttrs?.filter((item: any) => item.mapto === "order"), [memoriezAttrs]);
	const memoriezPermission = useAppSelector((state) => (state.appState && "order_permission" in state.appState ? state.appState.order_permission : []));

	// Local state to manage UI changes
	const [localPermissions, setLocalPermissions] = useState<AttributePermission[]>([]);
	// State to track if changes have been made
	const [hasChanges, setHasChanges] = useState(false);

	// Initialize local state when Redux state changes or component mounts
	useEffect(() => {
		// Ensure memoriezPermission is treated as the correct type
		const initialPermissions = (memoriezPermission || []) as AttributePermission[];
		setLocalPermissions(initialPermissions);
		setHasChanges(false); // Reset changes flag when data reloads
	}, [memoriezPermission]);

	const fetchData = useCallback(async () => {
		setLoading(true); // Start loading
		const all = await actions.getAll({ min: true, published: true });
		if (all?.data) {
			dispatch(setAttribute(all?.data));
			// Fetch existing permissions from app state after attributes are loaded
			// Note: This assumes app state might already have permissions or they are fetched elsewhere.
			// If permissions need to be fetched specifically, add that call here.
		} else {
			toast.error("Failed to load attributes.");
		}
		setLoading(false); // End loading
	}, [dispatch]);

	// Function to handle switch changes
	const handlePermissionChange = (childId: number, permissionKey: string, isChecked: boolean) => {
		setLocalPermissions(
			produce((draft) => {
				let attributePerm = draft.find((item) => item.id === childId);

				// If the attribute child doesn't exist in permissions yet, create it
				if (!attributePerm) {
					attributePerm = {
						id: childId,
						permission: enumOrderType.map((type) => ({
							key: type.value,
							// Initialize based on current change or default to false
							checked: type.value === permissionKey ? isChecked : false,
						})),
					};
					draft.push(attributePerm);
				} else {
					// If the attribute child exists, find the specific permission key
					let permItem = attributePerm.permission.find((perm) => perm.key === permissionKey);
					// If the permission key doesn't exist (shouldn't happen with enumOrderType), add it
					if (!permItem) {
						permItem = { key: permissionKey, checked: isChecked };
						attributePerm.permission.push(permItem);
					} else {
						// Update the existing permission key's checked status
						permItem.checked = isChecked;
					}
				}
			}),
		);
		setHasChanges(true); // Mark that changes have been made
	};

	// Function to get the checked state from localPermissions
	const getCheckedState = (childId: number, permissionKey: string): boolean => {
		const attributePerm = localPermissions.find((item) => item.id === childId);
		if (!attributePerm) return false; // Default to false if attribute child not found
		const permItem = attributePerm.permission.find((perm) => perm.key === permissionKey);
		return permItem?.checked ?? false; // Default to false if permission key not found
	};

	const template = (items: any[]) => {
		// Use localPermissions for rendering checked state
		return (
			<div className="w-full overflow-auto">
				{items && items.length > 0 ? (
					items.map((item: any) => (
						<div
							key={item.id}
							className="mb-4 text-sm gap-4">
							<div className="mb-4">
								<h3 className="text-xl font-semibold mb-2 flex items-center gap-2 border-b pb-2 mb-5">
									<span>{item.title}</span>
								</h3>
								<div className="flex flex-row flex-wrap items-start gap-10"> {/* Added flex-wrap and items-start */}
									{item.children.map((child: any) => (
										<div
											key={child.id}
											className="min-w-[150px]"> {/* Added min-width */}
											<div className="flex items-center gap-2 uppercase text-xs font-semibold mb-2"> {/* Adjusted styling */}
												<strong>{child.title}</strong>
											</div>
											<div className="flex flex-col space-y-1">
												{enumOrderType.map((type) => (
													<div
														className="flex items-center gap-2 text-xs"
														key={type.value}>
														<Switch
															className="" // Removed mr-2, gap-2 handles spacing
															id={`${child.id}-${type.value}`}
															name={`${child.id}-${type.value}`}
															// Read checked state from localPermissions
															checked={getCheckedState(child.id, type.value)}
															// Update localPermissions on change
															onCheckedChange={(checked) => {
																handlePermissionChange(child.id, type.value, checked);
															}}
														/>
														<label
															htmlFor={`${child.id}-${type.value}`}
															className="cursor-pointer"> {/* Added cursor-pointer */}
															{type.label}
														</label>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					))
				) : (
					<p>No attributes found for orders.</p> // Changed message slightly
				)}
			</div>
		);
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Save handler
	const handleSaveChanges = async () => {
		setLoading(true); // Indicate saving process

		// Construct the final data structure using localPermissions
		// We only need to save the localPermissions array directly as it holds the relevant structure.
		const dataToSave = localPermissions;

		console.log("Saving Data:", dataToSave);

		const json = JSON.stringify(dataToSave);
		const _body = {
			order_permission: json,
		};

		try {
			const update = await actions.updateAllRecord(_body);
			if (update?.success !== "success") {
				toast.error(update.message || "Failed to update permissions.");
			} else {
				toast.success("Order permissions updated successfully");
				// Save the updated permissions to Redux appState
				dispatch(SET_APP_STATE({ order_permission: dataToSave }));
				setHasChanges(false); // Reset changes flag after successful save
			}
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An error occurred while saving permissions.");
		} finally {
			setLoading(false); // Finish loading/saving indicator
		}
	};

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<div className="flex flex-col my-10">
					{template(att_orders)}
					<div className="flex mt-6"> {/* Added margin-top */}
						<Button
							className="px-4 py-2 inline-flex"
							onClick={handleSaveChanges}
							disabled={!hasChanges || loading} // Disable if no changes or already saving
						>
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
