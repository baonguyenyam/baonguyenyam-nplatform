"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const AppPagination = ({ items, pageSize, currentPage, url }: { items: number; pageSize: string; currentPage: number; url: string }) => {
	const searchParams = useSearchParams();
	const pagesCount = Math.ceil(items / Number(pageSize));
	const s = searchParams.get("s") || "";
	if (pagesCount === 1) return null;
	const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
	return (
		<>
			<Pagination>
				<PaginationContent className="flex items-center justify-between gap-3">
					{pagesCount > 3 && currentPage > 1 && (
						<PaginationItem>
							<PaginationLink
								href={`${url}?s=${s}`}
								className="bg-gray-100 rounded hover:bg-black hover:text-white  dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100">
								<ChevronsLeft />
							</PaginationLink>
						</PaginationItem>
					)}
					{pagesCount > 3 && currentPage > 1 && (
						<PaginationItem>
							<PaginationLink
								href={`${url}/${currentPage - 1}?s=${s}`}
								className="bg-gray-100 rounded hover:bg-black hover:text-white  dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100">
								<ChevronLeft />
							</PaginationLink>
						</PaginationItem>
					)}
					{pages.map((page, index) => {
						if (pagesCount > 3 && currentPage > 2 && index === 0)
							return (
								<PaginationItem
									className={`${page == currentPage ? "styles.pageItemActive" : ""}`}
									key={index}>
									<PaginationEllipsis />
								</PaginationItem>
							);
						if (pagesCount > 3 && currentPage < pagesCount - 1 && index === pages.length - 1)
							return (
								<PaginationItem
									className={`${page == currentPage ? "styles.pageItemActive" : ""}`}
									key={index}>
									<PaginationEllipsis />
								</PaginationItem>
							);
						if (page === currentPage) {
							return (
								<PaginationItem
									className={`${page == currentPage ? "" : ""}`}
									key={index}>
									<PaginationLink
										className={`${page == currentPage ? "bg-black text-white hover:bg-black hover:text-white dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-gray-500 dark:hover:text-gray-100" : "bg-gray-100 rounded"}`}
										href={`${url}/${page}?s=${s}`}>
										{page}
									</PaginationLink>
								</PaginationItem>
							);
						}
						if (page === currentPage - 1 || page === currentPage + 1) {
							return (
								<PaginationItem key={index}>
									<PaginationLink
										href={`${url}/${page}?s=${s}`}
										className="bg-gray-100 rounded hover:bg-black hover:text-white  dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100">
										{page}
									</PaginationLink>
								</PaginationItem>
							);
						}
						return null;
					})}
					{pagesCount > 3 && currentPage < pagesCount && (
						<PaginationItem>
							<PaginationLink
								href={`${url}/${currentPage + 1}?s=${s}`}
								className="bg-gray-100 rounded hover:bg-black hover:text-white  dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100">
								<ChevronRight />
							</PaginationLink>
						</PaginationItem>
					)}
					{pagesCount > 3 && currentPage < pagesCount && (
						<PaginationItem>
							<PaginationLink
								href={`${url}/${pagesCount}?s=${s}`}
								className="bg-gray-100 rounded hover:bg-black hover:text-white  dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100">
								<ChevronsRight />
							</PaginationLink>
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</>
	);
};

export default AppPagination;
