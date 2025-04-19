import { Fragment, useEffect, useMemo, useState } from "react";
import { produce } from "immer"; // Import immer for easier state updates
import { Copy, Info, Pen, Plus, PlusCircle, Search, Settings, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

export default function OrderAttribute(props: any) {
	const { data } = props; // Order data containing the saved attributes structure
	const memoriez = useAppSelector((state) => state.attributeState.data); // All available attribute definitions

	// Filter available attribute definitions for 'order' type
	const availableAttributeDefinitions = useMemo(() => {
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);

	// --- State ---
	const [open, setOpen] = useState<any>(["", null]); // [dialogType, dialogData] for modals
	const [attributes, setAttributes] = useState<AttributeInstance[]>([]); // Current state of attributes added to the order
	const [savedAttributes, setSavedAttributes] = useState<AttributeInstance[]>([]); // State of attributes when loaded/saved
	const [search, setSearch] = useState<any>([]); // Search results for select/checkbox fields
	const [loading, setLoading] = useState(true); // Loading state for search dialog

	// --- Data Fetching & Initialization ---
	useEffect(() => {
		let initialAttributes: AttributeInstance[] = [];
		if (data?.data) {
			try {
				const parsedData = JSON.parse(data.data);
				if (Array.isArray(parsedData)) {
					// Check if it's the old group structure
					if (parsedData.length > 0 && parsedData[0]?.attributes !== undefined && Array.isArray(parsedData[0].attributes)) {
						// Flatten the groups into a single list
						initialAttributes = parsedData.flatMap((group: any) => group.attributes || []);
					}
					// Check if it's the old flat structure (or already flattened)
					else if (parsedData.length > 0 && parsedData[0]?.children !== undefined) {
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
	}, [data?.data]); // Re-run only when the input data changes

	// --- Derived State ---

	// Filter definitions that haven't been added yet
	const availableAttsToAdd = useMemo(() => {
		const selectedIds = attributes.map((attr) => attr.id);
		return availableAttributeDefinitions.filter((att: any) => !selectedIds.includes(att.id));
	}, [availableAttributeDefinitions, attributes]);

	// Check if there are unsaved changes
	const hasChanges = useMemo(() => {
		const currentString = JSON.stringify(attributes);
		const savedString = JSON.stringify(savedAttributes);
		return currentString !== savedString;
	}, [attributes, savedAttributes]);

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

	const saveAttributeMeta = async () => {
		if (!hasChanges) return;
		const orderId = data?.id;
		if (!orderId) {
			toast.error("Order ID is missing.");
			return;
		}
		// Save the flattened attributes array directly
		const orderData = JSON.stringify(attributes);
		try {
			const res: any = await actions.updateRecord(orderId, { data: orderData });
			if (res.success === "success") {
				toast.success("Order attributes updated successfully");
				setSavedAttributes(attributes); // Update saved state on success
			} else {
				toast.error("Failed to update order attributes.");
			}
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An error occurred while saving.");
		}
	};

	// --- State Update Handlers (using Immer for immutability) ---

	const handleSelectAttribute = (attributeDefinition: any) => {
		const newAttributeInstance: AttributeInstance = {
			title: attributeDefinition.title,
			id: attributeDefinition.id,
			children: [], // Initialize with no rows
		};

		setAttributes(
			produce((draft) => {
				// Prevent adding duplicates
				if (!draft.some((attr) => attr.id === newAttributeInstance.id)) {
					draft.push(newAttributeInstance);
				} else {
					toast.info(`Attribute "${newAttributeInstance.title}" already added.`);
				}
			}),
		);
		setOpen(["", null]); // Close dialog
	};

	const handleAddAttributeRow = (attributeId: string) => {
		const attributeDefinition = availableAttributeDefinitions.find((att: any) => att.id === attributeId);
		if (!attributeDefinition || !attributeDefinition.children) {
			toast.error("Attribute definition not found or has no fields.");
			return;
		}

		// Create a new row based on the attribute definition's children (fields)
		const newRow: AttributeItem[] = attributeDefinition.children.map((child: any) => ({
			id: child.id, // Use the field definition ID
			title: child.title,
			value: child.type === "checkbox" ? [] : "", // Initialize based on type
		}));

		setAttributes(
			produce((draft) => {
				const attribute = draft.find((attr) => attr.id === attributeId);
				if (attribute) {
					attribute.children.push(newRow);
				}
			}),
		);
	};

	const handleDuplicateAttributeRow = (attributeId: string, rowIndex: number) => {
		setAttributes(
			produce((draft) => {
				const attribute = draft.find((attr) => attr.id === attributeId);
				if (attribute && attribute.children[rowIndex]) {
					// Deep copy the row to duplicate
					const rowToDuplicate = JSON.parse(JSON.stringify(attribute.children[rowIndex]));
					attribute.children.splice(rowIndex + 1, 0, rowToDuplicate); // Insert duplicate below original
				}
			}),
		);
	};

	const handleDeleteAttributeRow = (attributeId: string, rowIndex: number) => {
		if (!confirm("Are you sure you want to remove this row?")) return;

		setAttributes(
			produce((draft) => {
				const attribute = draft.find((attr) => attr.id === attributeId);
				if (attribute) {
					attribute.children.splice(rowIndex, 1);
				}
			}),
		);
	};

	const handleDeleteAttributeInstance = (attributeId: string) => {
		const attributeToDelete = attributes.find((a) => a.id === attributeId);
		if (!confirm(`Are you sure you want to remove the entire "${attributeToDelete?.title}" attribute section?`)) return;

		setAttributes(
			produce((draft) => {
				const index = draft.findIndex((attr) => attr.id === attributeId);
				if (index !== -1) {
					draft.splice(index, 1);
				}
			}),
		);
	};

	const handleUpdateFieldValue = (attributeId: string, rowIndex: number, fieldIndex: number, newValue: any) => {
		setAttributes(
			produce((draft) => {
				const attribute = draft.find((attr) => attr.id === attributeId);
				if (attribute && attribute.children[rowIndex] && attribute.children[rowIndex][fieldIndex]) {
					attribute.children[rowIndex][fieldIndex].value = newValue;
				}
			}),
		);
	};

	const handleUpdateCheckboxValue = (attributeId: string, rowIndex: number, fieldIndex: number, selectedMetaItem: any, add: boolean) => {
		setAttributes(
			produce((draft) => {
				const attribute = draft.find((attr) => attr.id === attributeId);
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
						}
					} else {
						// Remove
						if (existingIndex !== -1) {
							field.value.splice(existingIndex, 1);
						} else {
							toast.error("Item not found to remove.");
						}
					}
				}
			}),
		);
	};

	const handleDeleteCheckboxSingleValue = (attributeId: string, rowIndex: number, fieldIndex: number, valueToRemove: any) => {
		if (!confirm("Are you sure you want to remove this item?")) return;
		handleUpdateCheckboxValue(attributeId, rowIndex, fieldIndex, valueToRemove, false); // Use the existing logic to remove
	};

	// --- Render ---

	return (
		<div className="block w-full space-y-6">
			{/* Save Button Area */}
			<div className="flex items-center justify-end space-x-2 sticky top-0 bg-white dark:bg-gray-950 py-3 z-10 border-b border-border dark:border-gray-800">
				<Info className={cn("w-4 h-4 text-orange-500 transition-opacity", hasChanges ? "opacity-100" : "opacity-0")} />
				<Button
					type="button"
					disabled={!hasChanges}
					className="hover:bg-gray-400 focus:outline-hidden focus:ring-0 text-sm flex flex-row items-center justify-center focus:ring-gray-800 px-2 h-8 bg-gray-200 font-medium hover:text-black text-black border-2 border-gray-400 rounded-lg"
					onClick={saveAttributeMeta}>
					Save Attributes
				</Button>
			</div>

			{/* Attribute Instances */}
			<div className="flex flex-col space-y-4">
				{attributes?.map((attributeInstance) => (
					<Fragment key={attributeInstance.id}>
						{/* Attribute Instance Header */}
						<div className="flex items-center justify-between group bg-gray-100 px-3 py-2 rounded-lg dark:bg-gray-900">
							<div className="text-base font-semibold">{attributeInstance.title}</div>
							<div className="flex items-center space-x-1 ml-auto">
								{/* Add Row Button */}
								<div
									className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
									onClick={() => handleAddAttributeRow(attributeInstance.id)}
									title={`Add new row for ${attributeInstance.title}`}>
									<PlusCircle className="w-6 h-6" />
								</div>
								{/* Delete Attribute Instance Button */}
								<div
									className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer ml-2"
									onClick={() => handleDeleteAttributeInstance(attributeInstance.id)}
									title={`Remove ${attributeInstance.title} section`}>
									<X className="w-5 h-5" />
								</div>
							</div>
						</div>

						{/* Rows (Children) for this Attribute Instance */}
						<div
							id={`attr_${attributeInstance.id}`}
							className="flex flex-col space-y-2">
							{attributeInstance.children?.map((row, rowIndex) => {
								// Find the definition to determine column count and field types
								const attributeDefinition = availableAttributeDefinitions.find((att: any) => att.id === attributeInstance.id);
								const colCount = attributeDefinition?.children?.length ?? 1;

								return (
									<div
										key={`${attributeInstance.id}-row-${rowIndex}`} // Simplified key
										className={`grid gap-3 border py-2 px-3 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-transparent relative px-10 group`} // Adjusted padding
										style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }} // Use minmax for better responsiveness
									>
										{/* Row Actions (Duplicate, Delete) */}
										<div className="absolute right-2 top-2 hidden group-hover:flex flex-col space-y-1">
											<Button
												variant="ghost"
												size="icon"
												type="button"
												className="w-6 h-6 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
												title="Delete Row"
												onClick={() => handleDeleteAttributeRow(attributeInstance.id, rowIndex)}>
												<X className="w-4 h-4" />
											</Button>
										</div>
										<div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-row items-center space-x-1">
											<Button
												variant="ghost"
												size="icon"
												type="button"
												className="w-6 h-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
												title="Duplicate Row"
												onClick={() => handleDuplicateAttributeRow(attributeInstance.id, rowIndex)}>
												<Copy className="w-4 h-4" />
											</Button>
										</div>

										{/* Fields within the Row */}
										{row.map((field, fieldIndex) => {
											const fieldDefinition = attributeDefinition?.children?.[fieldIndex];
											const fieldType = fieldDefinition?.type ?? "text"; // Default to text

											return (
												<Fragment key={`${attributeInstance.id}-row-${rowIndex}-field-${field.id}`}>
													<div className="item flex flex-col space-y-1">
														{/* <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{field.title}</span> */}
														<div className="field-content">
															{/* --- Text Input --- */}
															{fieldType === "text" && (
																<Input
																	className="w-full px-2 py-1 h-8 text-sm" // Adjusted size
																	value={field.value || ""} // Controlled component
																	onChange={(e) => handleUpdateFieldValue(attributeInstance.id, rowIndex, fieldIndex, e.target.value)}
																	placeholder={field.title}
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
																		searchAttributeMeta("", field.id); // Use field.id (field definition ID) for search
																		// Store necessary info to update the correct field
																		setOpen(["search", { attributeId: attributeInstance.id, rowIndex, fieldIndex, fieldId: field.id, fieldTitle: field.title, fieldType }]);
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
																				<button
																					type="button"
																					className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
																					onClick={() => handleDeleteCheckboxSingleValue(attributeInstance.id, rowIndex, fieldIndex, v)}
																					title={`Remove ${v?.value}`}>
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
																		onClick={() => {
																			setSearch([]);
																			setLoading(true);
																			searchAttributeMeta("", field.id); // Use field.id (field definition ID) for search
																			setOpen(["search", { attributeId: attributeInstance.id, rowIndex, fieldIndex, fieldId: field.id, fieldTitle: field.title, fieldType }]);
																		}}>
																		<Search className="w-3 h-3 mr-1" /> Add {field.title}
																	</Button>
																</div>
															)}
														</div>
													</div>
												</Fragment>
											);
										})}
									</div>
								);
							})}
							{/* Show message if no rows exist for this attribute */}
							{attributeInstance.children?.length === 0 && (
								<div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
									No rows added yet for "{attributeInstance.title}". Click <PlusCircle className="w-4 h-4 inline-block mx-1" /> above to add one.
								</div>
							)}
						</div>
					</Fragment>
				))}
			</div>

			{/* Add Attribute Button */}
			{availableAttsToAdd.length > 0 && (
				<Dialog
					open={open[0] === "add-attribute"}
					onOpenChange={(isOpen) => setOpen([isOpen ? "add-attribute" : "", null])}>
					<DialogTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="mt-4 cursor-pointer w-full border-dashed">
							<PlusCircle className="w-4 h-4 mr-1" />
							Add Attribute Section
						</Button>
					</DialogTrigger>
					<DialogContent className="w-full sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
						<DialogHeader>
							<DialogTitle>Add Attribute Section</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col max-h-[400px] overflow-y-auto">
							{availableAttsToAdd.map((item: any, index: number) => (
								<div
									key={index}
									className={`flex items-center justify-between py-2 border-b border-border dark:border-gray-700 last:border-b-0`}>
									<p className="text-sm">{item?.title}</p>
									<Button
										size="sm"
										type="button"
										className="text-xs"
										onClick={() => handleSelectAttribute(item)}>
										Add
									</Button>
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>
			)}

			{/* Message if no attributes are added */}
			{attributes.length === 0 && <div className="text-center text-gray-500 dark:text-gray-400 py-4">No attributes added yet.</div>}

			{/* Search Dialog (Remains largely the same, but context passed in 'open' state is simplified) */}
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
												// Destructure simplified context from open[1]
												const { attributeId, rowIndex, fieldIndex, fieldType } = open[1];
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
