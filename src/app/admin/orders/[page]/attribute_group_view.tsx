import { Fragment, useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { checkStringIsTextOrColorHexOrURL } from "@/lib/utils";
import { useAppSelector } from "@/store";

export default function OrderAttribute(props: any) {
	const { data } = props;
	const memoriez = useAppSelector((state) => state.attributeState.data);
	const atts = useMemo(() => {
		return memoriez.filter((item: any) => item?.mapto === "order");
	}, [memoriez]);

	const [selected, setSelected] = useState<any>([]);

	const findLongestItem = (arr: any) => {
		if (!arr || arr.length === 0) {
			return null;
		}
		let longest = 0;
		let longestItem: any = null;
		arr.forEach((item: any) => {
			if (item?.length > longest) {
				longest = item?.length;
				longestItem = item;
			}
		});

		return longestItem;
	}

	useEffect(() => {
		if (data?.data) {
			const dataParsed = JSON.parse(data?.data);
			setSelected(dataParsed);
		}
	}, [data?.data]);

	return (
		<div className="block w-full">

			<div className="flex flex-col">
				{/* Loop through selected attributes */}
				{selected?.map((item: any, index: number) => (
					<Fragment key={index}>
						<div className="flex flex-col">
							<h2 className="">
								<div className="text-lg font-bold pl-1">{item?.title}</div>
							</h2>
						</div>
						{/* Loop through children */}
						<table
							id={`father_${item?.id}`}
							className="space-y-1 whitespace-nowrap mb-5">
							<thead>
								<tr
									className={`gap-5 border py-2 px-3 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-600 relative px-3`}
								>
									{/* Find item?.children longest */}
									{/* {item?.children.find((child: any) => child?.length > 0)?.map((child: any, i: number) => (
										<Fragment key={i}>
											<th className="text-left bg-gray-100 dark:bg-gray-900 p-2">
												{child?.title}
											</th>
										</Fragment>
									))} */}

									{findLongestItem(item?.children)?.map((child: any, i: number) => (
										<Fragment key={i}>
											<th className="text-left bg-gray-100 dark:bg-gray-900 p-2">
												{child?.title}
											</th>
										</Fragment>
									))}
								</tr>
							</thead>
							<tbody>
								{item?.children?.map((child: any, i: number) => (
									<tr
										key={i}
										className={`gap-5 border py-2 px-3 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-600 relative px-3`}
									>
										{child?.map((frm: any, j: number) => (
											<Fragment key={j}>
												{frm?.value && (
													<td className="">
														<div className="p-2">
															<div className="flex items-center justify-between space-x-2 font-light">
																{/* Selectbox */}
																{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type !== "checkbox" && (
																	<div
																		className="flex items-center space-x-1 font-light">
																		{checkStringIsTextOrColorHexOrURL(frm?.value?.value) === "color" && (
																			<>
																				<div
																					className="w-4 h-4 rounded-full border border-gray-300"
																					style={{ backgroundColor: frm?.value?.value }}></div>
																				<p className="text-sm text-gray-500 dark:text-white">{frm?.value?.value}</p>
																			</>
																		)}
																		{checkStringIsTextOrColorHexOrURL(frm?.value?.value) !== "color" && (
																			<>
																				<p className="text-sm text-gray-500 dark:text-white">{frm?.value?.value}</p>
																			</>
																		)}
																	</div>
																)}
																{/* Checkbox */}
																{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "checkbox" && (
																	<div className="flex flex-col space-y-1 font-light">
																		{/* Loop through checkbox values */}
																		{frm?.value.length > 0 &&
																			frm?.value?.map((v: any, k: number) => (
																				<div
																					key={k}
																					className="relative flex items-center group space-x-1">
																					<div
																						className="flex items-center space-x-1 font-light">
																						{checkStringIsTextOrColorHexOrURL(v?.value) === "color" && (
																							<>
																								<div
																									className="w-4 h-4 rounded-full border border-gray-300"
																									style={{ backgroundColor: v?.value }}></div>
																								<p className="text-sm text-gray-500 dark:text-white">{v?.value}</p>
																							</>
																						)}
																						{checkStringIsTextOrColorHexOrURL(v?.value) !== "color" && (
																							<>
																								<p className="text-sm text-gray-500 dark:text-white">{v?.value}</p>
																							</>
																						)}
																					</div>
																				</div>
																			))}
																		{/* IF No value */}
																		{frm?.value?.length === 0 && (
																			<>N/A</>
																		)}
																	</div>
																)}
															</div>
														</div>
													</td>
												)}
											</Fragment>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</Fragment>
				))}
			</div>

			{atts?.length === 0 && (
				<div className="flex items-center justify-between py-2 text-gray-500">
					<p>No attributes found, please add attributes first</p>
				</div>
			)}
		</div>
	);
}
