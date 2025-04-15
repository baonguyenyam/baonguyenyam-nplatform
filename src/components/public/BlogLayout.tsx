import { Fragment } from "react";
import Link from "next/link";

import PaginationBar from "@/components/public/PaginationBar";
import { SmartImage } from "@/components/public/SmartImage";

export default function BlogLayout(props: any) {
	const { count, page, pageSize, url } = props;

	return (
		<div className=" dark:bg-gray-900 dark:text-white">
			<div className="flex flex-col w-full mb-10">
				{props.first &&
					props.first.map((item: any) => (
						<Fragment key={item?.id}>
							<div className="bg-gray-900 text-white">
								<div className="container mx-auto grid w-full grid-cols-9 px-5 py-9 lg:py-25 xl:max-w-[1020px]">
									<h1 className="3xl:text-5xl col-span-9 text-3xl leading-tight font-medium xl:col-span-7">
										<Link href={`/blog/${item?.slug}`}>{item?.title}</Link>
									</h1>
								</div>
								<div className="h-[100px] sm:h-[200px] lg:h-[300px]"></div>
							</div>
							<div className="container mx-auto -mt-[100px] px-5 sm:-mt-[200px] lg:-mt-[300px] xl:max-w-[1020px]">
								<div className="relative mx-auto max-h-[200px] overflow-hidden sm:max-h-[400px] lg:max-h-[600px] xl:max-w-[1020px] rounded-2xl">
									<Link href={`/blog/${item?.slug}`}>
										<SmartImage
											aspectRatio="16 / 9"
											alt={item?.title}
											src={item?.image}
											width={1020}
											height={800}
										/>
									</Link>
								</div>
							</div>
						</Fragment>
					))}

				<div className="container mx-auto w-full px-5 py-9 lg:py-25 xl:max-w-[1020px]">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
						{props.data.map((item: any) => (
							<div
								key={item?.id}
								className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition duration-300 dark:bg-gray-800 dark:text-white">
								<Link href={`/blog/${item?.slug}`}>
									<SmartImage
										aspectRatio="16 / 9"
										alt={item?.title}
										src={item?.image}
										width={1020}
										height={800}
									/>
									<div className="p-3">
										<h2 className="text-md font-semibold">{item?.title}</h2>
									</div>
								</Link>
							</div>
						))}
					</div>
				</div>

				{Math.ceil(count / pageSize) > 1 && (
					<div className="flex flex-col justify-between w-full items-center my-10">
						<div className="flex space-x-2">
							<PaginationBar
								items={count}
								currentPage={page}
								pageSize={pageSize}
								url={url}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
