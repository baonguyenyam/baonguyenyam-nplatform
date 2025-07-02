import { Fragment } from "react";

import {
	checkAllObjectEmpty,
	convertStringToJson,
	removeUnderscoreAndDash,
} from "@/lib/utils";

export default function AttributeMisc(props: any) {
	const { data } = props;
	return (
		<>
			<h2 className="text-lg font-bold mb-5">Mics</h2>
			{/* data?meta */}
			<div className="space-y-5 grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-10">
				{data &&
					data?.meta &&
					data?.meta?.length > 0 &&
					data?.meta?.map((item: any, index: number) => (
						<Fragment key={index}>
							{!checkAllObjectEmpty(data?.meta, "value") && (
								<div className="flex flex-col">
									{item?.key === "order_attributes" &&
										item?.value?.length > 0 && (
											<>
												{convertStringToJson(item?.value)?.map(
													(item: any, index: number) => (
														<Fragment key={index}>
															<label className="text-xs font-semibold mb-2 uppercase text-gray-500">
																{removeUnderscoreAndDash(item?.key, "order")}
															</label>
															<div key={index} className="flex flex-col">
																{item?.value}
															</div>
														</Fragment>
													),
												)}
											</>
										)}
									{item?.key !== "order_attributes" &&
										item?.value?.length > 0 && (
											<>
												<label className="text-xs font-semibold mb-2 uppercase text-gray-500">
													{removeUnderscoreAndDash(item?.key, "order")}
												</label>
												<div className="flex flex-col">{item?.value}</div>
											</>
										)}
								</div>
							)}
						</Fragment>
					))}
				{/* All value in meta is empty  */}
			</div>
			{checkAllObjectEmpty(data?.meta, "value") && (
				<div className="flex p-3 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 mb-10">
					<p>No meta data available for this order.</p>
				</div>
			)}
		</>
	);
}
