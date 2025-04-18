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

	useEffect(() => {
		if (data?.data) {
			const dataParsed = JSON.parse(data?.data);
			setSelected(dataParsed);
		}
	}, [data?.data]);

	return (
		<div className="block w-full">

			<div className="flex flex-col space-y-4">
				{/* Loop through selected attributes */}
				{selected?.map((item: any, index: number) => (
					<Fragment key={index}>
						<div className="flex flex-col">
							<div className="flex items-center justify-between group bg-gray-100 px-2 py-2 rounded-lg dark:bg-gray-900">
								<div className="text-lg font-bold pl-1">{item?.title}</div>
							</div>
						</div>
						{/* Loop through children */}
						<div
							id={`father_${item?.id}`}
							className="flex flex-col space-y-1 whitespace-nowrap">
							{item?.children?.map((child: any, i: number) => (
								<div
									key={i}
									className={`grid grid-cols-${child?.length} gap-5 border py-2 px-3 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-600 relative px-3`}
									style={{ gridTemplateColumns: `repeat(${child?.length}, 1fr)` }}
								>
									{child?.map((frm: any, j: number) => (
										<Fragment key={j}>
											<div className="item flex items-center">
												{frm?.value && (
													<div className="item flex items-center justify-between group space-x-2">
														{/* IF Type is text field then show input */}
														{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "text" && (
															<div className="flex items-center space-x-2">
																<span>{frm?.title}</span>
																<Input
																	className="w-full px-2 py-0! h-7"
																	defaultValue={frm?.value?.value}
																/>
															</div>
														)}
														{/* IF Type is not text field then show select/checkbox */}
														{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type !== "text" && (
															<div className="flex items-center justify-between space-x-2 font-light">
																{/* Selectbox */}
																{atts.find((att: any) => att?.id === item?.id)?.children?.find((c: any) => c?.id === frm?.id)?.type === "select" && (
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
														)}
													</div>
												)}
												{/* IF Empty */}
												{!frm?.value && (
													<>N/A</>
												)}
											</div>
										</Fragment>
									))}
								</div>
							))}
						</div>
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
