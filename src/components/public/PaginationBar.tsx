"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";

const PaginationBar = ({
	items,
	pageSize,
	currentPage,
	url,
}: {
	items: number;
	pageSize: string;
	currentPage: number;
	url: string;
}) => {
	const searchParams = useSearchParams();
	const pagesCount = Math.ceil(items / Number(pageSize));
	const s = searchParams.get("s") || "";
	if (pagesCount === 1) return null;
	const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
	return (
		<>
			<Pagination>
				<PaginationContent>
					{pagesCount > 3 && currentPage > 1 && (
						<PaginationItem>
							<PaginationLink href={`${url}?s=${s}`}>
								<ChevronsLeft />
							</PaginationLink>
						</PaginationItem>
					)}
					{pagesCount > 3 && currentPage > 1 && (
						<PaginationItem>
							<PaginationLink href={`${url}/${currentPage - 1}?s=${s}`}>
								<ChevronLeft />
							</PaginationLink>
						</PaginationItem>
					)}
					{pages.map((page, index) => {
						if (pagesCount > 3 && currentPage > 2 && index === 0)
							return (
								<PaginationItem
									className={`${page == currentPage ? "styles.pageItemActive" : "styles.pageItem"}`}
									key={index}
								>
									<PaginationEllipsis />
								</PaginationItem>
							);
						if (
							pagesCount > 3 &&
							currentPage < pagesCount - 1 &&
							index === pages.length - 1
						)
							return (
								<PaginationItem
									className={`${page == currentPage ? "styles.pageItemActive" : "styles.pageItem"}`}
									key={index}
								>
									<PaginationEllipsis />
								</PaginationItem>
							);
						if (page === currentPage) {
							return (
								<PaginationItem
									className={`${page == currentPage ? "styles.pageItemActive" : "styles.pageItem"}`}
									key={index}
								>
									<PaginationLink
										className={`${page == currentPage ? "bg-gray-900! text-white!" : ""}`}
										href={`${url}/${page}?s=${s}`}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							);
						}
						if (page === currentPage - 1 || page === currentPage + 1) {
							return (
								<PaginationItem key={index}>
									<PaginationLink href={`${url}/${page}?s=${s}`}>
										{page}
									</PaginationLink>
								</PaginationItem>
							);
						}
						return null;
					})}
					{pagesCount > 3 && currentPage < pagesCount && (
						<PaginationItem>
							<PaginationLink href={`${url}/${currentPage + 1}?s=${s}`}>
								<ChevronRight />
							</PaginationLink>
						</PaginationItem>
					)}
					{pagesCount > 3 && currentPage < pagesCount && (
						<PaginationItem>
							<PaginationLink href={`${url}/${pagesCount}?s=${s}`}>
								<ChevronsRight />
							</PaginationLink>
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</>
	);
};

export default PaginationBar;
