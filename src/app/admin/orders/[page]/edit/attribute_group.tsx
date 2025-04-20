import { Fragment, useEffect, useMemo, useState } from "react";
import { produce } from "immer"; // Import immer for easier state updates
import { Copy, Info, Pen, Plus, PlusCircle, Search, Settings, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkStringIsTextOrColorHexOrURL, cn } from "@/lib/utils"; // Assuming cn is available
import { useAppSelector } from "@/store";

import * as actions from "../actions";

interface AttributeItem {
	id: string;
	title: string;
	value?: any; // Can be string, object, or array depending on type
}

interface AttributeInstance {
	id: string;
	title: string;
	children: AttributeItem[][]; // Array of rows, each row is an array of attribute items
}

interface AttributeGroup {
	id: string;
	title: string;
	attributes: AttributeInstance[];
}

const generateId = () => `group_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
// Helper to generate unique IDs (replace with a more robust solution if needed)

export default function OrderAttributeGroup(props: any) {
	const { data, permission, orderPermission, tab } = props;
	const memoriez = useAppSelector((state) => state.attributeState.data);
	const atts = useMemo(() => {
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);

	const [open, setOpen] = useState<any>(["", null]); // [dialogType, dialogData]
	const [groupSelected, setGroupSelected] = useState<AttributeGroup[]>([]);
	const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
	const [savedGroupData, setSavedGroupData] = useState<AttributeGroup[]>([]); // Renamed 'current'
	const [search, setSearch] = useState<any>([]);
	const [loading, setLoading] = useState(true); // For search dialog

	// Helper to find the row with the most columns (fields) for header generation
	const findLongestRow = (rows: AttributeItem[][]): AttributeItem[] | null => {
		if (!Array.isArray(rows) || rows.length === 0) {
			return null;
		}
		let longestLength = 0;
		let longestRow: AttributeItem[] | null = null;
		rows.forEach((row) => {
			if (Array.isArray(row) && row.length > longestLength) {
				longestLength = row.length;
				longestRow = row;
			}
		});
		return longestRow;
	};

	// --- Data Fetching & Initialization ---

	// Effect 1: Parse data.data and set groupSelected/savedGroupData
	useEffect(() => {
		let parsedGroups: AttributeGroup[] = [];
		if (data?.data) {
			try {
				const parsedData = JSON.parse(data.data);
				if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0]?.attributes !== undefined) {
					// New structure
					parsedGroups = parsedData;
				} else if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0]?.attributes === undefined) {
					// Old structure - migrate
					const defaultGroup: AttributeGroup = {
						id: generateId(),
						title: "Default Group",
						attributes: parsedData, // Assuming old structure was AttributeInstance[]
					};
					parsedGroups = [defaultGroup];
				}
			} catch (error) {
				console.error("Failed to parse order data:", error);
				toast.error("Failed to load order attributes.");
				// Keep parsedGroups as []
			}
		}
		setGroupSelected(parsedGroups);
		setSavedGroupData(parsedGroups);
		// We will set the activeGroupId in the next effect
	}, [data?.data]); // Only depends on data.data

	// Effect 2: Set the initial active group ID based on parsed data
	useEffect(() => {
		// Only set the initial active ID if groups exist and no active group is currently selected.
		if (groupSelected && groupSelected.length > 0 && !activeGroupId) {
			setActiveGroupId(groupSelected[0].id);
		}
		// If groups become empty, ensure activeGroupId is nullified
		else if (groupSelected && groupSelected.length === 0 && activeGroupId) {
			setActiveGroupId(null);
		}
		// This effect runs when groupSelected changes (after parsing) or if activeGroupId changes.
		// The condition `!activeGroupId` prevents it from overriding an active selection later.
	}, [groupSelected, activeGroupId]); // Depends on the parsed result and current active ID

	// --- Derived State ---
	const activeGroup = useMemo(() => {
		return groupSelected.find((group) => group.id === activeGroupId);
	}, [groupSelected, activeGroupId]);

	const availableAttsForActiveGroup = useMemo(() => {
		if (!activeGroup) return [];
		// Ensure activeGroup.attributes is an array before mapping
		const selectedIds = Array.isArray(activeGroup.attributes) ? activeGroup.attributes.map((attr) => attr.id) : [];
		return atts.filter((att: any) => !selectedIds.includes(att.id));
	}, [atts, activeGroup]);

	const hasChanges = useMemo(() => {
		// Add checks to prevent errors if states are not arrays
		const currentString = Array.isArray(groupSelected) ? JSON.stringify(groupSelected) : "[]";
		const savedString = Array.isArray(savedGroupData) ? JSON.stringify(savedGroupData) : "[]";
		return currentString !== savedString;
	}, [groupSelected, savedGroupData]);

	// --- API Calls ---

	const searchAttributeMeta = async (searchTerm: string, attributeId: string) => {
		setLoading(true);
		setSearch([]);
		try {
			const res: any = await actions.searchAttributeMeta(searchTerm, attributeId);
			if (res.success === "success") {
				setSearch(res.data || []);
			} else {
				toast.error("Failed to search attribute values.");
				setSearch([]);
			}
		} catch (error) {
			console.error("Search error:", error);
			toast.error("An error occurred during search.");
			setSearch([]);
		} finally {
			setLoading(false);
		}
	};

	const saveAttributeMeta = async (groupsToSave?: AttributeGroup[]) => {
		// Use the provided groupsToSave if available, otherwise use the current state
		const dataToSave = groupsToSave ?? groupSelected;

		// Remove the hasChanges check here if you always want delete to save,
		// or keep it if you only want explicit saves via the button to check changes.
		// For deletion, we generally want to save the change.
		// if (!hasChanges && !groupsToSave) return; // Adjust this check if needed

		const orderId = data?.id;
		if (!orderId) {
			toast.error("Order ID is missing.");
			return;
		}

		// Ensure dataToSave is an array before stringifying
		const orderData = JSON.stringify(Array.isArray(dataToSave) ? dataToSave : []);

		try {
			const res: any = await actions.updateRecord(orderId, { data: orderData });
			if (res.success === "success") {
				// toast.success("Order attributes updated successfully");
				// Update saved state with the data that was actually saved
				setSavedGroupData(dataToSave);
			} else {
				toast.error("Failed to update order attributes.");
			}
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An error occurred while saving.");
		}
	};

	// --- State Update Handlers (using Immer for immutability) ---

	const handleAddGroup = (groupName: string) => {
		if (!groupName.trim()) {
			toast.error("Group name cannot be empty.");
			return;
		}
		const newGroup: AttributeGroup = {
			id: generateId(),
			title: groupName.trim(),
			attributes: [],
		};
		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			draft.push(newGroup);
		});

		// Update state
		setGroupSelected(nextGroupSelected);
		setActiveGroupId(newGroup.id); // Activate the new group
		setOpen(["", null]); // Close dialog

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};

	const handleSelectAttributeForGroup = (attributeDefinition: any) => {
		if (!activeGroupId) return;

		const newAttributeInstance: AttributeInstance = {
			title: attributeDefinition.title,
			id: attributeDefinition.id,
			children: [], // Initialize with no rows
		};

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group && !group.attributes.some((attr) => attr.id === newAttributeInstance.id)) {
				group.attributes.push(newAttributeInstance);
			} else if (group) {
				toast.info(`Attribute "${newAttributeInstance.title}" already added to this group.`);
				return; // Prevent saving if attribute already exists
			}
		});

		// Check if next state is different (toast might have prevented change)
		if (nextGroupSelected === groupSelected) return;

		// Update state
		setGroupSelected(nextGroupSelected);
		setOpen(["", null]); // Close dialog

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};


	const handleAddAttributeRow = (attributeId: string) => {
		if (!activeGroupId) return;

		const attributeDefinition = atts.find((att: any) => att.id === attributeId);
		if (!attributeDefinition || !attributeDefinition.children) {
			toast.error("Attribute definition not found or has no fields.");
			return;
		}

		// Create a new row based on the attribute definition's children (fields)
		const newRow: AttributeItem[] = attributeDefinition.children.map((child: any) => ({
			id: child.id,
			title: child.title,
			value: child.type === "checkbox" ? [] : "", // Initialize based on type
		}));

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group) {
				const attribute = group.attributes.find((attr) => attr.id === attributeId);
				if (attribute) {
					attribute.children.push(newRow);
				}
			}
		});

		// Update state
		setGroupSelected(nextGroupSelected);

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};

	const handleDuplicateAttributeRow = (attributeId: string, rowIndex: number) => {
		if (!activeGroupId) return;

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group) {
				const attribute = group.attributes.find((attr) => attr.id === attributeId);
				if (attribute && attribute.children[rowIndex]) {
					// Deep copy the row to duplicate
					const rowToDuplicate = JSON.parse(JSON.stringify(attribute.children[rowIndex]));
					attribute.children.splice(rowIndex + 1, 0, rowToDuplicate); // Insert duplicate below original
				}
			}
		});

		// Update state
		setGroupSelected(nextGroupSelected);

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};

	const handleDeleteAttributeRow = (attributeId: string, rowIndex: number) => {
		if (!activeGroupId) return;

		if (!confirm("Are you sure you want to remove this row?")) return;

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group) {
				const attribute = group.attributes.find((attr) => attr.id === attributeId);
				if (attribute) {
					attribute.children.splice(rowIndex, 1);
				}
			}
		});

		// Update state
		setGroupSelected(nextGroupSelected);

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};

	const handleDeleteAttributeInstance = (attributeId: string) => {
		if (!activeGroupId) return;

		if (!confirm(`Are you sure you want to remove the entire "${activeGroup?.attributes.find((a) => a.id === attributeId)?.title}" attribute section from this group?`)) return;

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group) {
				group.attributes = group.attributes.filter((attr) => attr.id !== attributeId);
			}
		});

		// Update state
		setGroupSelected(nextGroupSelected);

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};

	const handleUpdateFieldValue = (attributeId: string, rowIndex: number, fieldIndex: number, newValue: any) => {
		if (!activeGroupId) return;

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group) {
				const attribute = group.attributes.find((attr) => attr.id === attributeId);
				if (attribute && attribute.children[rowIndex] && attribute.children[rowIndex][fieldIndex]) {
					attribute.children[rowIndex][fieldIndex].value = newValue;
				}
			}
		});

		// Update state
		setGroupSelected(nextGroupSelected);

		// Save the calculated next state
		saveAttributeMeta(nextGroupSelected);
	};

	const handleUpdateCheckboxValue = (attributeId: string, rowIndex: number, fieldIndex: number, selectedMetaItem: any, add: boolean) => {
		if (!activeGroupId) return;

		let showToast = false; // Flag to prevent saving if toast is shown

		// Calculate next state
		const nextGroupSelected = produce(groupSelected, (draft) => {
			const group = draft.find((g) => g.id === activeGroupId);
			if (group) {
				const attribute = group.attributes.find((attr) => attr.id === attributeId);
				if (attribute && attribute.children[rowIndex] && attribute.children[rowIndex][fieldIndex]) {
					const field = attribute.children[rowIndex][fieldIndex];
					if (!Array.isArray(field.value)) {
						field.value = []; // Initialize if not an array
					}
					const existingIndex = field.value.findIndex((v: any) => v?.id === selectedMetaItem?.id);

					if (add) {
						if (existingIndex === -1) {
							field.value.push(selectedMetaItem);
						} else {
							toast.error("Already selected.");
							showToast = true; // Mark that toast was shown
						}
					} else {
						// Remove
						if (existingIndex !== -1) {
							field.value.splice(existingIndex, 1);
						} else {
							toast.error("Item not found to remove.");
							showToast = true; // Mark that toast was shown
						}
					}
				}
			}
		});

		// Only update state and save if no toast was shown (meaning a change occurred)
		if (!showToast) {
			setGroupSelected(nextGroupSelected);
			saveAttributeMeta(nextGroupSelected);
		}
	};

	const handleDeleteCheckboxSingleValue = (attributeId: string, rowIndex: number, fieldIndex: number, valueToRemove: any) => {
		if (!activeGroupId) return;
		if (!confirm("Are you sure you want to remove this item?")) return;
		handleUpdateCheckboxValue(attributeId, rowIndex, fieldIndex, valueToRemove, false); // Use the existing logic to remove
	};

	const handleDeleteGroup = (groupId: string) => {
		const groupToDelete = groupSelected.find(g => g.id === groupId);
		if (!groupToDelete) return; // Group not found

		if (!confirm(`Are you sure you want to delete the group "${groupToDelete.title}"?`)) return;

		// Calculate the next state *before* calling setGroupSelected
		const nextGroupSelected = groupSelected.filter(g => g.id !== groupId);

		// Determine the next active group ID
		let nextActiveGroupId = activeGroupId;
		if (activeGroupId === groupId) { // If the deleted group was active
			nextActiveGroupId = nextGroupSelected.length > 0 ? nextGroupSelected[0].id : null;
		} else if (nextGroupSelected.length === 0) { // If no groups left
			nextActiveGroupId = null;
		}
		// Otherwise, keep the current activeGroupId if it still exists

		// Update the state
		setGroupSelected(nextGroupSelected);
		setActiveGroupId(nextActiveGroupId);

		// Pass the calculated next state directly to saveAttributeMeta
		saveAttributeMeta(nextGroupSelected); // Save the *new* state
	};

	// --- Render ---

	return (
		<div className="block w-full">
			{/* Group Management */}

			{/* Tabs for Groups */}
			{groupSelected && groupSelected.length > 0 && (
				<Tabs
					value={activeGroupId ?? ""} // Controlled component
					onValueChange={setActiveGroupId} // Update active group on tab change
					className="mb-5 w-full">
					<div className="w-full flex items-start justify-between border-b border-gray-200 dark:border-gray-700">
						<div className="group flex items-center">
							<TabsList className="m-0 p-0 border-0 bg-transparent! shadow-none! h-auto -mb-[1px]">
								{groupSelected.map((group) => (
									<TabsTrigger
										// Change to border top on active tab
										className={cn(
											"border-t-2 border-b-0 dark:border-gray-700 border-l-0 border-r border-r-gray-200",
											{
												"border-black border-r-gray-200": activeGroupId === group.id,
												"border-transparent": activeGroupId !== group.id,
											},
											"rounded-none cursor-pointer px-5 py-3 shadow-none! bg-gray-100",
										)}
										// Double click to edit group name
										onDoubleClick={() => {
											const newName = prompt("Enter new group name", group.title);
											if (newName) {
												setGroupSelected(
													produce((draft) => {
														const g = draft.find((g) => g.id === group.id);
														if (g) {
															g.title = newName.trim();
														}
													}),
												);
											}
										}}
										key={group.id}
										value={group.id}>
										{group.title}
										{/* Add delete/edit icons for group here if needed */}
									</TabsTrigger>
								))}
							</TabsList>
							{/* Dropdown Add/Edit/Delete */}
							{!permission && (
								<Dialog
									open={open[0] === "create-group"}
									onOpenChange={(isOpen) => setOpen([isOpen ? "create-group" : "", null])}>
									<DialogTrigger asChild>
										<Button
											size="icon"
											className="rounded-full w-6 h-6 ml-4 cursor-pointer"
											type="button">
											<Plus className="w-4 h-4" />
										</Button>
									</DialogTrigger>
									<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
										<DialogHeader>
											<DialogTitle>Add New Group</DialogTitle>
										</DialogHeader>
										<Input
											placeholder="Group Name"
											id="group-namecreate"
											className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleAddGroup((e.target as HTMLInputElement)?.value);
												}
											}}
											autoFocus
										/>
										<Button
											type="button"
											onClick={() => handleAddGroup((document.querySelector("#group-namecreate") as HTMLInputElement)?.value)}>
											Create Group
										</Button>
									</DialogContent>
								</Dialog>
							)}
						</div>
						<div className="flex items-center space-x-5">
							{/* Save Button Area */}
							<div className="flex items-center justify-between">
								{/* <div className="l">
									<h3 className="font-semibold mb-0">Additional Information</h3>
									<p className="text-sm text-muted-foreground">Manage attributes within the selected group.</p>
								</div> */}
								{/* {atts?.length > 0 && (
									<div className="ml-auto flex items-center space-x-2">
										<Info className={cn("w-4 h-4 text-orange-500 transition-opacity", hasChanges ? "opacity-100" : "opacity-0")} />
										<Button
											type="button"
											disabled={!hasChanges}
											className="hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 px-2 h-8 bg-gray-200 font-medium hover:text-black text-black border-2 border-gray-400 rounded-lg"
											onClick={() => saveAttributeMeta()}>
											Save Data
										</Button>
									</div>
								)} */}
							</div>
							{/* Add other group management buttons here if needed (e.g., Rename, Delete Group) */}
						</div>
					</div>

					{/* Content for each Group */}
					{groupSelected.map((group) => (
						<TabsContent
							key={group.id}
							value={group.id}
							className="mt-0 pt-4" // Added border top
						>
							{/* Attribute Instances within the Active Group */}
							<div className="flex flex-col space-y-4">
								{group.attributes?.map((attributeInstance, attrIndex) => {
									const longestRowForHeader = findLongestRow(attributeInstance.children);
									return (
										<Fragment key={`${group.id}-${attributeInstance.id}`}>
											{/* Attribute Instance Header */}
											<div className="flex items-center justify-between group">
												<div className="text-base font-semibold">{attributeInstance.title}</div>
												{/* Delete Attribute Instance Button */}
												{!permission && (
													<>
														<div
															className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hidden group-hover:block cursor-pointer ml-2"
															onClick={() => handleDeleteAttributeInstance(attributeInstance.id)}
															title={`Remove ${attributeInstance.title} section`}>
															<X className="w-5 h-5" />
														</div>
														<div className="ml-auto">
															<div className="flex items-center space-x-1">
																{/* Add Row Button */}
																<div
																	className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
																	onClick={() => handleAddAttributeRow(attributeInstance.id)}
																	title={`Add new row for ${attributeInstance.title}`}>
																	<PlusCircle className="w-6 h-6" />
																</div>
															</div>
														</div>
													</>
												)}
											</div>

											{/* Rows (Children) for this Attribute Instance */}
											<table
												id={`group_${group.id}_attr_${attributeInstance.id}`}
												className="w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm">
												<thead>
													<tr className="bg-gray-100 dark:bg-gray-800">
														{(!permission && longestRowForHeader?.length) && (
															<>
																<th className="p-2 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-medium w-4"></th>
																<th className="p-2 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-medium w-4">D</th>
															</>
														)}
														{longestRowForHeader?.map((headerField) => (
															<th
																key={headerField.id}
																className="text-left p-2 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-medium">
																{headerField.title}
															</th>
														))}
													</tr>
												</thead>

												<tbody>

													{attributeInstance.children?.map((row, rowIndex) => {
														// Find the definition to determine column count and field types
														const attributeDefinition = atts.find((att: any) => att.id === attributeInstance.id);
														const colCount = attributeDefinition?.children?.length ?? 1;

														return (
															<tr
																key={`${group.id}-${attributeInstance.id}-row-${rowIndex}`}
																className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"

															>
																{/* Row Actions (Duplicate, Delete) */}
																{!permission && (
																	<>
																		<td className="p-2">
																			<Button
																				variant="ghost"
																				size="icon"
																				type="button"
																				className="w-6 h-6 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
																				title="Delete Row"
																				onClick={() => handleDeleteAttributeRow(attributeInstance.id, rowIndex)}>
																				<X className="w-4 h-4" />
																			</Button>
																		</td>
																		<td className="p-2">
																			<Button
																				variant="ghost"
																				size="icon"
																				type="button"
																				className="w-6 h-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
																				title="Duplicate Row"
																				onClick={() => handleDuplicateAttributeRow(attributeInstance.id, rowIndex)}>
																				<Copy className="w-4 h-4" />
																			</Button>
																		</td>
																	</>
																)}

																{/* Fields within the Row */}
																{row.map((field, fieldIndex) => {
																	const fieldDefinition = attributeDefinition?.children?.[fieldIndex];
																	const fieldType = fieldDefinition?.type ?? "text"; // Default to text

																	return (
																		<Fragment key={`${group.id}-${attributeInstance.id}-row-${rowIndex}-field-${field.id}`}>
																			<td className="p-2">
																				{/* <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{field.title}</span> */}
																				<div className="field-content">
																					{/* --- Text Input --- */}
																					{fieldType === "text" && (
																						<Input
																							className="w-full px-2 py-1 h-8 text-sm" // Adjusted size
																							defaultValue={field?.value || ""} // Default value for uncontrolled component
																							onKeyDown={(e) => {
																								if (e.key === "Enter") {
																									handleUpdateFieldValue(attributeInstance.id, rowIndex, fieldIndex, (e.target as HTMLInputElement)?.value);
																								}
																							}}
																						// placeholder={field.title}
																						/>
																					)}

																					{/* --- Select Input --- */}
																					{fieldType === "select" && (
																						<Button
																							variant="outline"
																							type="button"
																							size="sm"
																							className="w-full justify-start font-normal h-8 text-sm border-0 shadow-none cursor-pointer" // Adjusted size
																							onClick={() => {
																								setSearch([]);
																								setLoading(true);
																								searchAttributeMeta("", field.id);
																								// Store necessary info to update the correct field
																								setOpen(["search", { groupId: group.id, attributeId: attributeInstance.id, rowIndex, fieldIndex, fieldId: field.id, fieldTitle: field.title, fieldType }]);
																							}}>
																							{field.value?.value ? (
																								<div className="flex items-center space-x-1">
																									{checkStringIsTextOrColorHexOrURL(field.value.value) === "color" && (
																										<div
																											className="w-3 h-3 rounded-full border border-gray-300 mr-1"
																											style={{ backgroundColor: field.value.value }}></div>
																									)}
																									<span className="truncate">{field.value.value}</span>
																								</div>
																							) : (
																								<span className="text-gray-500 dark:text-gray-400 flex items-center">
																									<Search className="w-3 h-3 mr-1" /> Select {field.title}
																								</span>
																							)}
																						</Button>
																					)}

																					{/* --- Checkbox Input --- */}
																					{fieldType === "checkbox" && (
																						<div className="flex flex-col space-y-1">
																							{/* Display selected checkbox values */}
																							{Array.isArray(field.value) &&
																								field.value.length > 0 &&
																								field.value.map((v: any, k: number) => (
																									<div
																										key={k}
																										className="relative flex items-center group space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
																										{checkStringIsTextOrColorHexOrURL(v?.value) === "color" && (
																											<div
																												className="w-3 h-3 rounded-full border border-gray-300"
																												style={{ backgroundColor: v?.value }}></div>
																										)}
																										<span className="text-gray-700 dark:text-white flex-grow truncate">{v?.value}</span>
																										{/* Delete single checkbox value */}
																										{!permission && (
																											<button
																												type="button"
																												className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
																												onClick={() => handleDeleteCheckboxSingleValue(attributeInstance.id, rowIndex, fieldIndex, v)}
																												title={`Remove ${v?.value}`}>
																												<X className="w-3 h-3" />
																											</button>
																										)}
																									</div>
																								))}
																							{/* Button to add more checkbox values */}
																							{!permission && (
																								<Button
																									variant="outline"
																									size="sm"
																									type="button"
																									className="w-full justify-start font-normal h-8 text-sm mt-1" // Adjusted size
																									onClick={() => {
																										setSearch([]);
																										setLoading(true);
																										searchAttributeMeta("", field.id);
																										setOpen(["search", { groupId: group.id, attributeId: attributeInstance.id, rowIndex, fieldIndex, fieldId: field.id, fieldTitle: field.title, fieldType }]);
																									}}>
																									<Search className="w-3 h-3 mr-1" /> Add {field.title}
																								</Button>
																							)}
																						</div>
																					)}
																				</div>
																			</td>
																		</Fragment>
																	);
																})}
															</tr>
														);
													})}

													{attributeInstance.children?.length === 0 && !permission && (
														<tr className="text-center text-sm text-gray-500 dark:text-gray-400">
															<td className="p-2" colSpan={!permission ? (Number(longestRowForHeader?.length ?? 0) + 2) : longestRowForHeader?.length ?? 0}>
																No rows added yet for "{attributeInstance.title}". Click <PlusCircle className="w-4 h-4 inline-block mx-1" /> above to add one.
															</td>
														</tr>
													)}

												</tbody>
												{/* Show message if no rows exist for this attribute */}
											</table>
										</Fragment>
									);
								})}

								{/* Add Attribute to Group Button */}
								{availableAttsForActiveGroup.length > 0 && !permission && (
									<Dialog
										open={open[0] === "create" && open[1]?.groupId === group.id} // Only open for the active group
										onOpenChange={(isOpen) => setOpen([isOpen ? "create" : "", isOpen ? { groupId: group.id } : null])}>
										<DialogTrigger asChild>
											<Button
												type="button"
												// variant="outline"
												className="mt-4 cursor-pointer">
												<PlusCircle className="w-4 h-4 mr-1" />
												Add Attribute to "{group.title}"
											</Button>
										</DialogTrigger>
										<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
											<DialogHeader>
												<DialogTitle>Add Attribute to "{group.title}"</DialogTitle>
											</DialogHeader>
											<div className="flex flex-col max-h-[400px] overflow-y-auto">
												{availableAttsForActiveGroup.map((item: any, index: number) => (
													<div
														key={index}
														className={`flex items-center justify-between py-2 border-b border-border dark:border-gray-700 last:border-b-0`}>
														<p className="text-sm">{item?.title}</p>
														<Button
															size="sm"
															type="button"
															className="text-xs"
															onClick={() => handleSelectAttributeForGroup(item)}>
															Add
														</Button>
													</div>
												))}
											</div>
										</DialogContent>
									</Dialog>
								)}

								{/* Message if no attributes are in the group */}
								{group.attributes?.length === 0 && !permission && <div className="text-center text-gray-500 dark:text-gray-400 py-4">No attributes added to this group yet.</div>}
							</div>

							{/* Delete the group */}
							{!permission && (
								<div className="flex justify-center mt-10">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="rounded-full cursor-pointer">
												<Settings className="w-4 h-4" />
												Group Settings
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												className="cursor-pointer"
												onClick={() => {
													handleDeleteGroup(group.id)
												}}>
												<div className="text-red-500">Delete Group</div>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
						</TabsContent>
					))}
				</Tabs>
			)}

			{/* Message if no groups exist */}
			{groupSelected.length === 0 && !permission && (
				<div className="text-center text-gray-500 dark:text-gray-400 py-6 flex items-center justify-center space-x-2">
					<span>No data created yet. Click "Add Group" to start.</span>
					<Dialog
						open={open[0] === "create-group"}
						onOpenChange={(isOpen) => setOpen([isOpen ? "create-group" : "", null])}>
						<DialogTrigger asChild>
							<Button
								size="icon"
								className="rounded-full w-6 h-6 cursor-pointer"
								type="button">
								<Plus className="w-4 h-4" />
							</Button>
						</DialogTrigger>
						<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle>Add New Group</DialogTitle>
							</DialogHeader>
							<Input
								placeholder="Group Name"
								id="group-name"
								className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleAddGroup((e.target as HTMLInputElement)?.value);
									}
								}}
								autoFocus
							/>
							<Button
								type="button"
								onClick={() => handleAddGroup((document.querySelector("#group-name") as HTMLInputElement)?.value)}>
								Create Group
							</Button>
						</DialogContent>
					</Dialog>
				</div>
			)}

			{/* Search Dialog */}
			<Dialog
				open={open[0] === "search"}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setSearch([]);
						setLoading(true); // Reset loading state for next open
						setOpen(["", null]);
					}
				}}>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						{/* Use optional chaining for safety */}
						<DialogTitle>Search in {open[1]?.fieldTitle ?? "Attribute"}</DialogTitle>
					</DialogHeader>
					<Command className="dark:bg-gray-800 dark:border-gray-700 border-0">
						<Input
							placeholder="Search or type value..."
							className="border-gray-200 dark:bg-gray-800 dark:border-gray-700"
							autoFocus
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const searchTerm = (e.target as HTMLInputElement)?.value;
									const fieldId = open[1]?.fieldId; // Get fieldId from dialog data
									if (fieldId) {
										searchAttributeMeta(searchTerm, fieldId);
									}
								}
							}}
						/>
						<CommandList>
							<CommandEmpty>{loading ? "Loading..." : "No results found."}</CommandEmpty>
							{!loading && search?.length > 0 && (
								<CommandGroup
									heading="Search Results"
									className="max-h-[300px] overflow-y-auto">
									{search.map((item: any, index: number) => (
										<CommandItem
											key={index}
											value={item?.key} // Use key for potential filtering
											className="cursor-pointer flex items-center space-x-2"
											onSelect={() => {
												const { groupId, attributeId, rowIndex, fieldIndex, fieldType } = open[1];
												const selectedMetaItem = {
													id: item?.id,
													title: item?.key, // Usually the same as key for meta
													value: item?.value,
												};

												if (fieldType === "checkbox") {
													handleUpdateCheckboxValue(attributeId, rowIndex, fieldIndex, selectedMetaItem, true); // Add value
												} else {
													// select or other types that take a single object
													handleUpdateFieldValue(attributeId, rowIndex, fieldIndex, selectedMetaItem);
												}

												setOpen(["", null]); // Close dialog
											}}>
											{/* Show Color Picker */}
											{checkStringIsTextOrColorHexOrURL(item?.value) === "color" && (
												<div
													className="w-4 h-4 rounded-full border border-gray-300"
													style={{ backgroundColor: item?.value }}></div>
											)}
											<span>
												{item?.key} ({item?.value})
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		</div>
	);
}
