import { Fragment, useEffect, useMemo, useState } from "react";
import { produce } from "immer"; // Import immer for easier state updates
import {
	Copy,
	Info,
	Pen,
	Plus,
	PlusCircle,
	Search,
	Settings,
	X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

export default function OrderAttributeMain(props: any) {
	const { data, onChange, permission, setkey, orderPermission, tab } = props; // Order data containing the saved attributes structure
	const memoriez = useAppSelector((state) => state.attributeState.data); // All available attribute definitions
	// Filter available attribute definitions for 'order' type
	const availableAttributeDefinitions = useMemo(() => {
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);

	// --- State ---
	const [open, setOpen] = useState<any>(["", null]); // [dialogType, dialogData] for modals
	const [attributes, setAttributes] = useState<AttributeInstance[]>([]); // Current state of attributes added to the order
	const [savedAttributes, setSavedAttributes] = useState<AttributeInstance[]>(
		[],
	); // State of attributes when loaded/saved
	const [search, setSearch] = useState<any>([]); // Search results for select/checkbox fields
	const [loading, setLoading] = useState(true); // Loading state for search dialog

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
	useEffect(() => {
		let initialAttributes: AttributeInstance[] = [];
		if (data?.data_main) {
			try {
				const parsedData = JSON.parse(data?.data_main);
				if (Array.isArray(parsedData)) {
					// Check if it's the old group structure
					if (
						parsedData.length > 0 &&
						parsedData[0]?.attributes !== undefined &&
						Array.isArray(parsedData[0].attributes)
					) {
						// Flatten the groups into a single list
						initialAttributes = parsedData.flatMap(
							(group: any) => group.attributes || [],
						);
					}
					// Check if it's the old flat structure (or already flattened)
					else if (
						parsedData.length > 0 &&
						parsedData[0]?.children !== undefined
					) {
						initialAttributes = parsedData;
					}
					// Handle potentially empty array or unexpected structure gracefully
					else {
						initialAttributes = [];
					}
				}
			} catch (error) {
				console.error("Failed to parse order attribute data:", error);
				toast.error("Failed to load order attributes.");
				initialAttributes = []; // Reset on error
			}
		}
		setAttributes(initialAttributes);
		setSavedAttributes(initialAttributes); // Initialize saved state
	}, [data?.data_main]); // Re-run only when the input data changes

	// --- Derived State ---

	// Filter definitions that haven't been added yet
	const availableAttsToAdd = useMemo(() => {
		const selectedIds = attributes.map((attr) => attr.id);
		return availableAttributeDefinitions.filter(
			(att: any) => !selectedIds.includes(att.id),
		);
	}, [availableAttributeDefinitions, attributes]);

	// Check if there are unsaved changes
	const hasChanges = useMemo(() => {
		const currentString = JSON.stringify(attributes);
		const savedString = JSON.stringify(savedAttributes);
		return currentString !== savedString;
	}, [attributes, savedAttributes]);

	// --- API Calls ---

	const searchAttributeMeta = async (
		searchTerm: string,
		attributeId: string,
	) => {
		setLoading(true);
		setSearch([]);
		try {
			const res: any = await actions.searchAttributeMeta(
				searchTerm,
				attributeId,
			);
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

	const saveAttributeMeta = async (attributesToSave?: AttributeInstance[]) => {
		// Use the provided attributesToSave if available, otherwise use the current state
		const dataToSave = attributesToSave ?? attributes;

		// If called without specific data (e.g., from the Save button), check for changes.
		// If called with specific data (after an action), always save.
		if (!attributesToSave && !hasChanges) {
			// console.log("Save skipped: No changes detected.");
			return;
		}

		const orderId = data?.id;
		if (!orderId) {
			toast.error("Order ID is missing.");
			return;
		}

		// Ensure dataToSave is an array before stringifying
		const orderData = JSON.stringify(
			Array.isArray(dataToSave) ? dataToSave : [],
		);

		try {
			const res: any = await actions.updateRecord(orderId, {
				data_main: orderData,
			});
			if (res.success === "success") {
				// toast.success("Main attributes updated successfully");
				// Update saved state with the data that was actually saved
				setSavedAttributes(dataToSave);
			} else {
				toast.error("Failed to update main attributes.");
			}
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An error occurred while saving main attributes.");
		}
	};

	// --- State Update Handlers (using Immer for immutability) ---

	const handleSelectAttribute = (attributeDefinition: any) => {
		// Don't allow changes if read-only

		const newAttributeInstance: AttributeInstance = {
			title: attributeDefinition.title,
			id: attributeDefinition.id,
			children: [], // Initialize with no rows
		};

		let attributeAlreadyExists = false;
		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			if (!draft.some((attr) => attr.id === newAttributeInstance.id)) {
				draft.push(newAttributeInstance);
			} else {
				toast.info(`Attribute "${newAttributeInstance.title}" already added.`);
				attributeAlreadyExists = true;
			}
		});

		// Only update state and save if the attribute was actually added
		if (!attributeAlreadyExists) {
			setAttributes(nextAttributes);
			saveAttributeMeta(nextAttributes); // Save immediately
		}
		setOpen(["", null]); // Close dialog regardless
	};

	const handleAddAttributeRow = (attributeId: string) => {
		const attributeDefinition = availableAttributeDefinitions.find(
			(att: any) => att.id === attributeId,
		);
		if (!attributeDefinition || !attributeDefinition.children) {
			toast.error("Attribute definition not found or has no fields.");
			return;
		}

		// Create a new row based on the attribute definition's children (fields)
		const newRow: AttributeItem[] = attributeDefinition.children.map(
			(child: any) => ({
				id: child.id, // Use the field definition ID
				title: child.title,
				value: child.type === "checkbox" ? [] : "", // Initialize based on type
			}),
		);

		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			const attribute = draft.find((attr) => attr.id === attributeId);
			if (attribute) {
				attribute.children.push(newRow);
			}
		});

		// Update state
		setAttributes(nextAttributes);
		// Save the calculated next state
		saveAttributeMeta(nextAttributes);
	};

	const handleDuplicateAttributeRow = (
		attributeId: string,
		rowIndex: number,
	) => {
		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			const attribute = draft.find((attr) => attr.id === attributeId);
			if (attribute && attribute.children[rowIndex]) {
				// Deep copy the row to duplicate
				const rowToDuplicate = JSON.parse(
					JSON.stringify(attribute.children[rowIndex]),
				);
				attribute.children.splice(rowIndex + 1, 0, rowToDuplicate); // Insert duplicate below original
			}
		});

		// Update state
		setAttributes(nextAttributes);
		// Save the calculated next state
		saveAttributeMeta(nextAttributes);
	};

	const handleDeleteAttributeRow = (attributeId: string, rowIndex: number) => {
		if (!confirm("Are you sure you want to remove this row?")) return;

		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			const attribute = draft.find((attr) => attr.id === attributeId);
			if (attribute) {
				attribute.children.splice(rowIndex, 1);
			}
		});

		// Update state
		setAttributes(nextAttributes);
		// Save the calculated next state
		saveAttributeMeta(nextAttributes);
	};

	const handleDeleteAttributeInstance = (attributeId: string) => {
		const attributeToDelete = attributes.find((a) => a.id === attributeId);
		if (
			!confirm(
				`Are you sure you want to remove the entire "${attributeToDelete?.title}" attribute section?`,
			)
		)
			return;

		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			const index = draft.findIndex((attr) => attr.id === attributeId);
			if (index !== -1) {
				draft.splice(index, 1);
			}
		});

		// Update state
		setAttributes(nextAttributes);
		// Save the calculated next state
		saveAttributeMeta(nextAttributes);
	};

	const handleUpdateFieldValue = (
		attributeId: string,
		rowIndex: number,
		fieldIndex: number,
		newValue: any,
	) => {
		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			const attribute = draft.find((attr) => attr.id === attributeId);
			if (
				attribute &&
				attribute.children[rowIndex] &&
				attribute.children[rowIndex][fieldIndex]
			) {
				attribute.children[rowIndex][fieldIndex].value = newValue;
			}
		});

		// Update state
		setAttributes(nextAttributes);
		// Save the calculated next state
		saveAttributeMeta(nextAttributes);
	};

	const handleUpdateCheckboxValue = (
		attributeId: string,
		rowIndex: number,
		fieldIndex: number,
		selectedMetaItem: any,
		add: boolean,
	) => {
		let showToast = false; // Flag to prevent saving if toast is shown

		// Calculate next state
		const nextAttributes = produce(attributes, (draft) => {
			const attribute = draft.find((attr) => attr.id === attributeId);
			if (
				attribute &&
				attribute.children[rowIndex] &&
				attribute.children[rowIndex][fieldIndex]
			) {
				const field = attribute.children[rowIndex][fieldIndex];
				if (!Array.isArray(field.value)) {
					field.value = []; // Initialize if not an array
				}
				const existingIndex = field.value.findIndex(
					(v: any) => v?.id === selectedMetaItem?.id,
				);

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
		});

		// Only update state and save if no toast was shown (meaning a change occurred)
		if (!showToast) {
			setAttributes(nextAttributes);
			saveAttributeMeta(nextAttributes);
		}
	};

	const handleDeleteCheckboxSingleValue = (
		attributeId: string,
		rowIndex: number,
		fieldIndex: number,
		valueToRemove: any,
	) => {
		if (!confirm("Are you sure you want to remove this item?")) return;
		// Use the existing logic to remove, which now handles saving internally
		handleUpdateCheckboxValue(
			attributeId,
			rowIndex,
			fieldIndex,
			valueToRemove,
			false,
		);
		// No need to call saveAttributeMeta here again
	};

	// --- Render ---

	return (
		<div className="block w-full">
			{/* Save Button Area */}
			{/* <div className="flex items-center justify-end space-x-2 sticky top-0 bg-white dark:bg-gray-950 z-10 mb-3">
				<Info className={cn("w-4 h-4 text-orange-500 transition-opacity", hasChanges ? "opacity-100" : "opacity-0")} />
				<Button
					type="button"
					disabled={!hasChanges}
					className="hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 px-2 h-8 bg-gray-200 font-medium hover:text-black text-black border-2 border-gray-400 rounded-lg"
					onClick={() => saveAttributeMeta()}>
					Save Attributes
				</Button>
			</div> */}

			{/* Header */}

			{/* Attribute Instances */}
			<div className="flex flex-col space-y-4">
				{attributes?.map((attributeInstance) => {
					const longestRowForHeader = findLongestRow(
						attributeInstance.children,
					);
					return (
						<Fragment key={attributeInstance.id}>
							{/* Attribute Instance Header */}
							<div className="flex items-center justify-between group">
								<div className="text-base font-semibold">
									{attributeInstance.title}
								</div>
								{!permission && (
									<>
										<div
											className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer ml-2 hidden group-hover:flex"
											onClick={() =>
												handleDeleteAttributeInstance(attributeInstance.id)
											}
											title={`Remove ${attributeInstance.title} section`}
										>
											<X className="w-5 h-5" />
										</div>
										<div className="flex items-center space-x-1 ml-auto">
											{/* Add Row Button */}
											<div
												className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
												onClick={() =>
													handleAddAttributeRow(attributeInstance.id)
												}
												title={`Add new row for ${attributeInstance.title}`}
											>
												<PlusCircle className="w-6 h-6" />
											</div>
											{/* Delete Attribute Instance Button */}
										</div>
									</>
								)}
							</div>

							{/* Rows (Children) for this Attribute Instance */}
							<table
								id={`attr_${attributeInstance.id}`}
								className="w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm"
							>
								<thead>
									<tr className="bg-gray-100 dark:bg-gray-800">
										{!permission && longestRowForHeader?.length && (
											<>
												<th className="p-2 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-medium w-4"></th>
												<th className="p-2 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-medium w-4">
													D
												</th>
											</>
										)}
										{longestRowForHeader?.map((headerField) => (
											<th
												key={headerField.id}
												className="text-left p-2 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-medium"
											>
												{headerField.title}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{attributeInstance.children?.map((row, rowIndex) => {
										// Find the definition to determine column count and field types
										const attributeDefinition =
											availableAttributeDefinitions.find(
												(att: any) => att.id === attributeInstance.id,
											);
										const colCount = attributeDefinition?.children?.length ?? 1;

										return (
											<tr
												key={`${attributeInstance.id}-row-${rowIndex}`} // Simplified key
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
																onClick={() =>
																	handleDeleteAttributeRow(
																		attributeInstance.id,
																		rowIndex,
																	)
																}
															>
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
																onClick={() =>
																	handleDuplicateAttributeRow(
																		attributeInstance.id,
																		rowIndex,
																	)
																}
															>
																<Copy className="w-4 h-4" />
															</Button>
														</td>
													</>
												)}

												{/* Fields within the Row */}
												{row.map((field, fieldIndex) => {
													const fieldDefinition =
														attributeDefinition?.children?.[fieldIndex];
													const fieldType = fieldDefinition?.type ?? "text"; // Default to text
													const getFParentInstanceId = attributeInstance.id; // Use attribute instance ID
													const getFieldId = fieldDefinition?.id ?? field.id; // Use field definition ID if available
													// Find in orderPermission
													const orderPermissionItem =
														orderPermission
															?.find(
																(item: any) =>
																	item.id === Number(getFParentInstanceId),
															)
															?.children?.find(
																(item: any) => item.id === Number(getFieldId),
															)
															?.permission.find((item: any) => item.key === tab)
															?.checked ?? true;

													return (
														<Fragment
															key={`${attributeInstance.id}-row-${rowIndex}-field-${field.id}`}
														>
															<td
																className={`p-2 ${orderPermissionItem ? "cursor-pointer" : "cursor-not-allowed disabled"}`}
															>
																{/* <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{field.title}</span> */}
																<div className="field-content">
																	{/* --- Text Input --- */}
																	{(fieldType === "text" ||
																		fieldType === "number") && (
																		<Input
																			className="w-full px-2 py-1 h-8 text-sm" // Adjusted size
																			defaultValue={field?.value || ""} // Default value for uncontrolled component
																			onKeyDown={(e) => {
																				if (e.key === "Enter") {
																					const target =
																						e.target as HTMLInputElement;
																					handleUpdateFieldValue(
																						attributeInstance.id,
																						rowIndex,
																						fieldIndex,
																						target.value,
																					);
																				}
																			}}
																			type={
																				fieldType === "number"
																					? "number"
																					: "text"
																			}
																			disabled={!orderPermissionItem} // Disable if permission is not granted
																			// placeholder={field.title}
																		/>
																	)}
																	{fieldType === "date" && (
																		<Input
																			className="w-full px-2 py-1 h-8 text-sm" // Adjusted size
																			defaultValue={field?.value || ""} // Default value for uncontrolled component
																			onChange={(e) => {
																				const target =
																					e.target as HTMLInputElement;
																				handleUpdateFieldValue(
																					attributeInstance.id,
																					rowIndex,
																					fieldIndex,
																					target.value,
																				);
																			}}
																			type="date"
																			disabled={!orderPermissionItem} // Disable if permission is not granted
																			// placeholder={field.title}
																		/>
																	)}
																	{fieldType === "toggle" && (
																		<Switch
																			checked={field?.value || false}
																			defaultChecked={field?.value || false}
																			disabled={!orderPermissionItem} // Disable if permission is not granted
																			onCheckedChange={(checked) =>
																				handleUpdateFieldValue(
																					attributeInstance.id,
																					rowIndex,
																					fieldIndex,
																					checked,
																				)
																			}
																		/>
																	)}

																	{/* --- Select Input --- */}
																	{fieldType === "select" && (
																		<Button
																			variant="outline"
																			type="button"
																			size="sm"
																			className="w-full justify-start font-normal h-8 text-sm border-0 shadow-none cursor-pointer" // Adjusted size
																			disabled={!orderPermissionItem}
																			onClick={() => {
																				setSearch([]);
																				setLoading(true);
																				searchAttributeMeta("", field.id); // Use field.id (field definition ID) for search
																				// Store necessary info to update the correct field
																				setOpen([
																					"search",
																					{
																						attributeId: attributeInstance.id,
																						rowIndex,
																						fieldIndex,
																						fieldId: field.id,
																						fieldTitle: field.title,
																						fieldType,
																					},
																				]);
																			}}
																		>
																			{field.value?.value ? (
																				<div className="flex items-center space-x-1">
																					{checkStringIsTextOrColorHexOrURL(
																						field.value.value,
																					) === "color" && (
																						<div
																							className="w-3 h-3 rounded-full border border-gray-300 mr-1"
																							style={{
																								backgroundColor:
																									field.value.value,
																							}}
																						></div>
																					)}
																					<span className="truncate">
																						{field.value.value}
																					</span>
																				</div>
																			) : (
																				<span className="text-gray-500 dark:text-gray-400 flex items-center">
																					<Search className="w-3 h-3 mr-1" />{" "}
																					Select {field.title}
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
																						className="relative flex items-center group space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs"
																					>
																						{checkStringIsTextOrColorHexOrURL(
																							v?.value,
																						) === "color" && (
																							<div
																								className="w-3 h-3 rounded-full border border-gray-300"
																								style={{
																									backgroundColor: v?.value,
																								}}
																							></div>
																						)}
																						<span className="text-gray-700 dark:text-white flex-grow truncate">
																							{v?.value}
																						</span>
																						{/* Delete single checkbox value */}
																						<button
																							type="button"
																							className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
																							onClick={() =>
																								handleDeleteCheckboxSingleValue(
																									attributeInstance.id,
																									rowIndex,
																									fieldIndex,
																									v,
																								)
																							}
																							title={`Remove ${v?.value}`}
																						>
																							<X className="w-3 h-3" />
																						</button>
																					</div>
																				))}
																			{/* Button to add more checkbox values */}
																			<Button
																				variant="outline"
																				size="sm"
																				type="button"
																				className="w-full justify-start font-normal h-8 text-sm mt-1" // Adjusted size
																				disabled={!orderPermissionItem}
																				onClick={() => {
																					setSearch([]);
																					setLoading(true);
																					searchAttributeMeta("", field.id); // Use field.id (field definition ID) for search
																					setOpen([
																						"search",
																						{
																							attributeId: attributeInstance.id,
																							rowIndex,
																							fieldIndex,
																							fieldId: field.id,
																							fieldTitle: field.title,
																							fieldType,
																						},
																					]);
																				}}
																			>
																				<Search className="w-3 h-3 mr-1" /> Add{" "}
																				{field.title}
																			</Button>
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
								</tbody>

								{/* Show message if no rows exist for this attribute */}
								{/* {attributeInstance.children?.length === 0 && (
								<div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
									No rows added yet for "{attributeInstance.title}". Click <PlusCircle className="w-4 h-4 inline-block mx-1" /> above to add one.
								</div>
							)} */}
							</table>
						</Fragment>
					);
				})}

				{/* Add Attribute Button */}
				{availableAttsToAdd.length > 0 && !permission && (
					<Dialog
						open={open[0] === "add-attribute"}
						onOpenChange={(isOpen) =>
							setOpen([isOpen ? "add-attribute" : "", null])
						}
					>
						<DialogTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="cursor-pointer w-full border-dashed"
							>
								<PlusCircle className="w-4 h-4 mr-1" />
								Add Main Attribute
							</Button>
						</DialogTrigger>
						<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle>Add Main Attribute</DialogTitle>
							</DialogHeader>
							<div className="flex flex-col max-h-[400px] overflow-y-auto">
								{availableAttsToAdd.map((item: any, index: number) => (
									<div
										key={index}
										className={`flex items-center justify-between py-2 border-b border-border dark:border-gray-700 last:border-b-0`}
									>
										<p className="text-sm">{item?.title}</p>
										<Button
											size="sm"
											type="button"
											className="text-xs"
											onClick={() => handleSelectAttribute(item)}
										>
											Add
										</Button>
									</div>
								))}
							</div>
						</DialogContent>
					</Dialog>
				)}

				{/* Message if no attributes are added */}
				{/* {attributes.length === 0 && <div className="text-center text-gray-500 dark:text-gray-400 py-4">No attributes added yet.</div>} */}
			</div>

			{/* Search Dialog (Remains largely the same, but context passed in 'open' state is simplified) */}
			<Dialog
				open={open[0] === "search"}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setSearch([]);
						setLoading(true); // Reset loading state for next open
						setOpen(["", null]);
					}
				}}
			>
				<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>
							Search in {open[1]?.fieldTitle ?? "Attribute"}
						</DialogTitle>
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
							<CommandEmpty>
								{loading ? "Loading..." : "No results found."}
							</CommandEmpty>
							{!loading && search?.length > 0 && (
								<CommandGroup
									heading="Search Results"
									className="max-h-[300px] overflow-y-auto"
								>
									{search.map((item: any, index: number) => (
										<CommandItem
											key={index}
											value={item?.key} // Use key for potential filtering
											className="cursor-pointer flex items-center space-x-2"
											onSelect={() => {
												// Destructure simplified context from open[1]
												const { attributeId, rowIndex, fieldIndex, fieldType } =
													open[1];
												const selectedMetaItem = {
													id: item?.id,
													title: item?.key, // Usually the same as key for meta
													value: item?.value,
												};

												if (fieldType === "checkbox") {
													handleUpdateCheckboxValue(
														attributeId,
														rowIndex,
														fieldIndex,
														selectedMetaItem,
														true,
													); // Add value
												} else {
													// select or other types that take a single object
													handleUpdateFieldValue(
														attributeId,
														rowIndex,
														fieldIndex,
														selectedMetaItem,
													);
												}
												setOpen(["", null]); // Close dialog

												// onChange(attributes)
											}}
										>
											{/* Show Color Picker */}
											{checkStringIsTextOrColorHexOrURL(item?.value) ===
												"color" && (
												<div
													className="w-4 h-4 rounded-full border border-gray-300"
													style={{ backgroundColor: item?.value }}
												></div>
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
