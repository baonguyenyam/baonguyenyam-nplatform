import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SmartImage } from "@/components/public/SmartImage";

export default function Blog(props: any) {
	const { data } = props;
	const pathname = usePathname();

	const getCurrentURL = process.env.SITE_URL + pathname;

	return (
		<>
			{data && (
				<div className=" dark:bg-gray-900 dark:text-white">
					<div className="bg-gray-900 text-white">
						<div className="container mx-auto grid w-full grid-cols-9 px-5 py-9 lg:py-25 xl:max-w-[1020px]">
							<div className="col-span-9 mb-10 flex items-center">
								<ArrowLeft className="h-5 w-5 mr-3 text-white" />
								<Link
									className="font-light text-white"
									href="/blogs">
									Back to Blog
								</Link>
							</div>
							<h1 className="3xl:text-5xl col-span-9 text-3xl leading-tight font-medium xl:col-span-7">{data?.title}</h1>
						</div>
						<div className="h-[100px] sm:h-[200px] lg:h-[300px]"></div>
					</div>
					<div className="container mx-auto -mt-[100px] px-5 sm:-mt-[200px] lg:-mt-[300px] xl:max-w-[1020px]">
						<div className="relative mx-auto max-h-[200px] overflow-hidden sm:max-h-[400px] lg:max-h-[600px] xl:max-w-[1020px] rounded-2xl">
							<SmartImage
								aspectRatio="16 / 9"
								alt={data?.title}
								src={data?.image}
								width={1020}
								height={800}
							/>
						</div>
					</div>
					<div className="container mx-auto px-5 xl:max-w-[1020px] my-10">
						<div
							className="prose prose-invert max-w-none"
							dangerouslySetInnerHTML={{ __html: data?.content }}
						/>
						<h3 className="mt-10 mb-2 text-xl leading-tight font-medium">Share:</h3>
						<div className="w-100items-center flex flex-wrap">
							<Link
								href={`https://www.facebook.com/sharer/sharer.php?u=${getCurrentURL}`}
								target="_blank"
								rel="noreferrer"
								className="mr-3 mb-3 flex h-10 w-10 items-center justify-center bg-gray-200 p-[.5rem] text-black hover:border-0 dark:text-black!">
								<svg
									className="w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 320 512">
									<path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
								</svg>
							</Link>
							<Link
								href={`https://twitter.com/intent/tweet?url=${getCurrentURL}`}
								target="_blank"
								rel="noreferrer"
								className="mr-3 mb-3 flex h-10 w-10 items-center justify-center bg-gray-200 p-[.5rem] text-black hover:border-0 dark:text-black!">
								<svg
									className="w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512">
									<path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
								</svg>
							</Link>
							<Link
								href={`https://www.linkedin.com/shareArticle?mini=true&url=${getCurrentURL}`}
								target="_blank"
								rel="noreferrer"
								className="mr-3 mb-3 flex h-10 w-10 items-center justify-center bg-gray-200 p-[.5rem] text-black hover:border-0 dark:text-black!">
								<svg
									className="w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512">
									<path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
								</svg>
							</Link>
							<Link
								href={`https://wa.me/?text=${getCurrentURL}`}
								target="_blank"
								rel="noreferrer"
								className="mr-3 mb-3 flex h-10 w-10 items-center justify-center bg-gray-200 p-[.5rem] text-black hover:border-0 dark:text-black!">
								<svg
									className="w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512">
									<path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
								</svg>
							</Link>
							<Link
								href={`https://pinterest.com/pin/create/button/?url=${getCurrentURL}`}
								target="_blank"
								rel="noreferrer"
								className="mr-3 mb-3 flex h-10 w-10 items-center justify-center bg-gray-200 p-[.5rem] text-black hover:border-0 dark:text-black!">
								<svg
									className="w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 384 512">
									<path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
								</svg>
							</Link>
							<Link
								href={`https://www.threads.net/login?next=${getCurrentURL}`}
								target="_blank"
								rel="noreferrer"
								className="mr-3 mb-3 flex h-10 w-10 items-center justify-center bg-gray-200 p-[.5rem] text-black hover:border-0 dark:text-black!">
								<svg
									className="w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512">
									<path d="M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
