import { useEffect, useMemo, useState } from "react";

import { checkStringIsTextOrColorHexOrURL } from "@/lib/utils";
import { useAppSelector } from "@/store";

// Re-use the interfaces from the edit component for consistency
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

export default function AttributeTab(props: any) {
	const { data } = props;
	const memoriez = useAppSelector((state) => state.attributeState.data);
	const atts = useMemo(() => {
		// This filters the *definitions* of attributes applicable to orders
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);

	// State now holds the grouped structure
	const [groupSelected, setGroupSelected] = useState<AttributeGroup[]>([]);

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

	useEffect(() => {
		if (data?.data) {
			try {
				const parsedData = JSON.parse(data.data);
				// Check if it's the new grouped structure or the old flat structure
				if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0]?.attributes !== undefined) {
					// New grouped structure
					setGroupSelected(parsedData);
				} else if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0]?.attributes === undefined) {
					// Old flat structure - wrap it in a default group for display
					const defaultGroup: AttributeGroup = {
						id: "default_group_view", // Simple ID for view mode
						title: "General Attributes", // Default title
						attributes: parsedData,
					};
					setGroupSelected([defaultGroup]);
				} else {
					// Handle empty or invalid data
					setGroupSelected([]);
				}
			} catch (error) {
				console.error("Failed to parse order data for view:", error);
				setGroupSelected([]); // Reset on error
			}
		} else {
			setGroupSelected([]); // Reset if no data
		}
	}, [data?.data]);

	// Helper to find the definition of a specific field within an attribute definition
	const findFieldDefinition = (attributeId: string, fieldId: string) => {
		const attributeDefinition = atts.find((att: any) => att.id === attributeId);
		return attributeDefinition?.children?.find((fieldDef: any) => fieldDef.id === fieldId);
	};

	return (
		<div className="block w-full">
			{groupSelected.length > 0 ? (
				<div className="flex flex-col space-y-6">
					{/* Loop through groups */}
					{groupSelected.map((group) => (
						<div
							key={group.id}
							className="group-section mb-10">
							<h2 className="text-xl font-semibold mb-3 border-b pb-2 dark:border-gray-700">{group.title}</h2>
							{group.attributes && group.attributes.length > 0 ? (
								<div className="flex flex-col space-y-4">
									{/* Loop through attribute instances within the group */}
									{group.attributes.map((attributeInstance) => {
										const longestRowForHeader = findLongestRow(attributeInstance.children);
										return (
											<div
												key={attributeInstance.id}
												className="attribute-instance">
												<h3 className="text-base font-medium mb-2 pl-1">{attributeInstance.title}</h3>
												{attributeInstance.children && attributeInstance.children.length > 0 ? (
													<table
														id={`table_${group.id}_${attributeInstance.id}`}
														className="w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm">
														<thead>
															<tr className="bg-gray-100 dark:bg-gray-800">
																{/* Generate headers based on the longest row */}
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
															{/* Loop through rows (children) */}
															{attributeInstance.children.map((row, rowIndex) => (
																<tr
																	key={rowIndex}
																	className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
																	{/* Loop through fields within the row */}
																	{row.map((field) => {
																		const fieldDefinition = findFieldDefinition(attributeInstance.id, field.id);
																		const fieldType = fieldDefinition?.type ?? "text"; // Default to text if definition not found

																		return (
																			<td
																				key={field.id}
																				className="p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 align-top">
																				{/* --- Render based on field type --- */}

																				{/* Text or Select (Single Value) */}
																				{(fieldType === "text" || fieldType === "select") && field.value && (
																					<div className="flex items-center space-x-1">
																						{/* Check if value is an object (likely from select) */}
																						{typeof field.value === "object" && field.value !== null && field.value.value ? (
																							<>
																								{checkStringIsTextOrColorHexOrURL(field.value.value) === "color" && (
																									<div
																										className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
																										style={{ backgroundColor: field.value.value }}></div>
																								)}
																								<span className="text-gray-700 dark:text-gray-200 break-words">{field.value.value}</span>
																							</>
																						) : (
																							// Otherwise, treat as plain text
																							<span className="text-gray-700 dark:text-gray-200 break-words">{String(field.value)}</span>
																						)}
																					</div>
																				)}

																				{/* Checkbox (Multiple Values) */}
																				{fieldType === "checkbox" && Array.isArray(field.value) && (
																					<div className="flex flex-col space-y-1">
																						{field.value.length > 0 ? (
																							field.value.map((v: any, k: number) => (
																								<div
																									key={k}
																									className="flex items-center space-x-1">
																									{checkStringIsTextOrColorHexOrURL(v?.value) === "color" && (
																										<div
																											className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
																											style={{ backgroundColor: v?.value }}></div>
																									)}
																									<span className="text-gray-700 dark:text-gray-200 break-words">{v?.value ?? "N/A"}</span>
																								</div>
																							))
																						) : (
																							<span className="text-gray-500 dark:text-gray-400 italic">None selected</span>
																						)}
																					</div>
																				)}

																				{/* Handle cases where value might be empty/null */}
																				{(!field.value || (Array.isArray(field.value) && field.value.length === 0 && fieldType !== "checkbox")) && <span className="text-gray-400 dark:text-gray-500 italic">N/A</span>}
																			</td>
																		);
																	})}
																	{/* Add empty cells if row is shorter than header row */}
																	{longestRowForHeader &&
																		row.length < longestRowForHeader.length &&
																		Array.from({ length: longestRowForHeader.length - row.length }).map((_, emptyIndex) => (
																			<td
																				key={`empty-${rowIndex}-${emptyIndex}`}
																				className="p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
																				<span className="text-gray-400 dark:text-gray-500 italic">--</span>
																			</td>
																		))}
																</tr>
															))}
														</tbody>
													</table>
												) : (
													<p className="text-sm text-gray-500 dark:text-gray-400 italic pl-1">No data recorded for this attribute.</p>
												)}
											</div>
										);
									})}
								</div>
							) : (
								<p className="text-sm text-gray-500 dark:text-gray-400 italic">No attributes added to this group.</p>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="flex p-3 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-md bg-red-50 dark:bg-red-100 mb-10">
					<p>No attribute data available for this order.</p>
				</div>
			)}

			{/* Message if attribute definitions are missing (optional, but good sanity check) */}
			{atts?.length === 0 && groupSelected.length > 0 && <div className="mt-4 text-sm text-orange-600 dark:text-orange-400">Warning: Attribute definitions seem to be missing. Display might be incomplete.</div>}
		</div>
	);
}
