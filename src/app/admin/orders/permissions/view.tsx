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

// Define a type for the permission structure
interface PermissionItem {
	key: string;
	checked: boolean;
}
interface PermissionChild {
	id: number; // Keep as number if your IDs are numbers, or string if they are strings
	title: string; // Add the title property
	permission: PermissionItem[];
}
interface PermissionGroup {
	id: number; // Keep as number if your IDs are numbers, or string if they are strings
	title: string;
	children: PermissionChild[];
}

export default function View() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const memoriezAttrs = useAppSelector((state) => state.attributeState.data);
	const att_orders = useMemo(() => memoriezAttrs?.filter((item: any) => item.mapto === "order"), [memoriezAttrs]);
	const memoriezPermission = useAppSelector((state) => (state.appState && "order_permission" in state.appState ? (state.appState.order_permission as PermissionGroup[]) : []));

	// State to hold the current permissions being edited
	const [permissionsState, setPermissionsState] = useState<PermissionGroup[]>([]);

	// Initialize or update local state when Redux state or attributes change
	useEffect(() => {
		if (att_orders && att_orders.length > 0) {
			const initialPermissions = att_orders.map((item: any) => {
				// Find existing permissions for this attribute group from Redux store
				const existingGroupPermission = memoriezPermission?.find((p: any) => p.id === item.id);

				return {
					id: item.id,
					title: item.title,
					children: item.children.map((child: any) => {
						// Find existing permissions for this child attribute from Redux store
						const existingChildPermission = existingGroupPermission?.children?.find((c: any) => c.id === child.id);

						return {
							id: child.id,
							title: child.title,
							permission: enumOrderType.map((type) => {
								// Find the specific permission type (e.g., 'view', 'edit')
								const existingTypePermission = existingChildPermission?.permission?.find((perm: any) => perm.key === type.value);
								return {
									key: type.value,
									// Default to false if not found in Redux state
									checked: existingTypePermission?.checked ?? false,
								};
							}),
						};
					}),
				};
			});
			setPermissionsState(initialPermissions);
		} else {
			setPermissionsState([]); // Reset if no attributes
		}
	}, [att_orders, memoriezPermission]); // Re-run when attributes or stored permissions change

	const fetchData = useCallback(async () => {
		setLoading(true); // Ensure loading is true at the start
		try {
			const all = await actions.getAll({ min: true, published: true });
			if (all?.data) {
				dispatch(setAttribute(all?.data));
			}
		} catch (error) {
			console.error("Failed to fetch attributes:", error);
			toast.error("Failed to load attribute definitions.");
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	// Handler to update the state when a switch is toggled
	const handlePermissionChange = (groupId: number, childId: number, typeKey: string, checked: boolean) => {
		setPermissionsState(
			produce((draft) => {
				const group = draft.find((g) => g.id === groupId);
				if (group) {
					const child = group.children.find((c) => c.id === childId);
					if (child) {
						const permission = child.permission.find((p) => p.key === typeKey);
						if (permission) {
							permission.checked = checked;
						}
					}
				}
			}),
		);
	};

	// Function to get the current checked state for a switch
	const getCheckedState = (groupId: number, childId: number, typeKey: string): boolean => {
		const group = permissionsState.find((g) => g.id === groupId);
		const child = group?.children.find((c) => c.id === childId);
		const permission = child?.permission.find((p) => p.key === typeKey);
		return permission?.checked ?? false; // Default to false if not found
	};

	const template = (items: PermissionGroup[]) => {
		return (
			<div className="w-full overflow-auto">
				{items && items.length > 0 ? (
					items.map(
						(
							item, // Use the items passed to the function (which is permissionsState)
						) => (
							<div
								key={item.id}
								className="mb-4 text-sm gap-4">
								<div className="mb-4">
									<h3 className="text-xl font-semibold mb-2 flex items-center gap-2 border-b pb-2 mb-5">
										<span>{item.title}</span>
									</h3>
									<div className="flex flex-row items-center gap-10 flex-wrap">
										{" "}
										{/* Added flex-wrap */}
										{item.children.map((child) => (
											<div
												key={child.id}
												className="mb-5">
												{" "}
												{/* Added margin-bottom */}
												<div className="flex items-center gap-2 uppercase text-xs font-semibold">
													{" "}
													{/* Made title bold */}
													{child?.title}
												</div>
												<div className="mt-2 flex flex-col space-y-2">
													{" "}
													{/* Increased space */}
													{enumOrderType.map((type) => (
														<div
															className="flex items-center gap-2" // Keep items aligned
															key={type.value}>
															<Switch
																id={`${item.id}-${child.id}-${type.value}`} // More specific ID
																checked={getCheckedState(item.id, child.id, type.value)}
																onCheckedChange={(checked) => {
																	handlePermissionChange(item.id, child.id, type.value, checked);
																}}
															/>
															<label
																htmlFor={`${item.id}-${child.id}-${type.value}`}
																className="text-xs cursor-pointer">
																{" "}
																{/* Added cursor-pointer */}
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
						),
					)
				) : (
					<p>No attributes found for user.</p>
				)}
			</div>
		);
	};

	useEffect(() => {
		// Fetch attributes only if they are not already in the store or if they are empty
		if (!memoriezAttrs || memoriezAttrs.length === 0) {
			fetchData();
		} else {
			setLoading(false); // Already have attributes, just stop loading
		}
	}, [fetchData, memoriezAttrs]); // Depend on fetchData and memoriezAttrs

	const handleSaveChanges = async () => {
		// Use the permissionsState which holds the current settings
		const dataToSave = permissionsState;

		// Basic validation (optional, but good practice)
		if (!Array.isArray(dataToSave)) {
			toast.error("Invalid permission data format.");
			return;
		}

		const json = JSON.stringify(dataToSave);

		const _body = {
			order_permission: json,
		};

		try {
			setLoading(true); // Show loading indicator during save
			const update = await actions.updateAllRecord(_body);
			if (update?.success !== "success") {
				toast.error(update.message || "Failed to update permissions.");
			} else {
				toast.success("Order permission updated successfully");
				// Save to appState (Redux) after successful DB update
				dispatch(SET_APP_STATE({ order_permission: dataToSave }));
			}
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An error occurred while saving permissions.");
		} finally {
			setLoading(false); // Hide loading indicator
		}
	};

	return (
		<>
			{loading && <AppLoading />}
			{!loading && (
				<div className="flex flex-col my-10">
					{/* Pass the local state to the template function */}
					{template(permissionsState)}
					<div className="flex mt-6">
						{" "}
						{/* Added margin-top */}
						<Button
							className="px-4 py-2 inline-flex"
							onClick={handleSaveChanges} // Use the new save handler
							disabled={loading} // Disable button while saving
						>
							Save Changes
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
