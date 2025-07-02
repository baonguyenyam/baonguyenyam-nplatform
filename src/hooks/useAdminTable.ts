import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
	useDebouncedCallback,
	useMemoizedCallback,
} from "@/hooks/useMemoizedCallback";
import { pageSkip } from "@/lib/utils";
import { useAppSelector } from "@/store";

interface BaseEntity {
	id: string | number;
	[key: string]: any;
}

interface UseAdminTableOptions<T> {
	apiActions: {
		getAll: (query: any) => Promise<{ data: T[]; count: number } | null>;
		deleteRecord: (id: string | number) => Promise<any>;
		deleteMultiple: (ids: (string | number)[]) => Promise<any>;
	};
	tableName: string;
	title: string;
	breadcrumb: any[];
}

interface DrawerState<T> {
	mode: "create" | "edit" | "view" | "design" | null;
	data: T | null;
}

export function useAdminTable<T extends BaseEntity>({
	apiActions,
	tableName,
	title,
	breadcrumb,
}: UseAdminTableOptions<T>) {
	// State management
	const [db, setDb] = useState<{ data: T[]; count: number }>({
		data: [],
		count: 0,
	});
	const [loading, setLoading] = useState(true);
	const [drawerState, setDrawerState] = useState<DrawerState<T>>({
		mode: null,
		data: null,
	});

	// Redux state
	const pageSize =
		useAppSelector((state) => (state.appState as any)?.pageSize) || 10;

	// URL params
	const search = useSearchParams();

	// Memoized query object to prevent unnecessary API calls
	const query = useMemo(
		() => ({
			take: Number(pageSize),
			skip: pageSkip(Number(search.get("page") || "1"), pageSize),
			s: search.get("s") || "",
			orderBy: search.get("orderBy") || "createdAt",
			filterBy: search.get("filterBy") || "",
			cat: search.get("cat") || "",
			published: search.get("published")
				? search.get("published") === "true"
				: undefined,
		}),
		[pageSize, search],
	);

	// Memoized fetch function
	const fetchData = useMemoizedCallback(async () => {
		try {
			setLoading(true);
			const result = await apiActions.getAll(query);

			if (result) {
				setDb(result);
			} else {
				setDb({ data: [], count: 0 });
				toast.error(`Failed to fetch ${title.toLowerCase()}`);
			}
		} catch (error) {
			console.error(`Error fetching ${tableName}:`, error);
			setDb({ data: [], count: 0 });
			toast.error(`Error loading ${title.toLowerCase()}`);
		} finally {
			setLoading(false);
		}
	});

	// Debounced search to prevent excessive API calls
	const debouncedFetch = useDebouncedCallback(fetchData, 300);

	// Delete single record
	const deleteRecord = useMemoizedCallback(async (id: string | number) => {
		try {
			const result = await apiActions.deleteRecord(id);
			if (result) {
				toast.success(`${title} deleted successfully`);
				await fetchData();
				handleDrawerClose();
			} else {
				toast.error(`Failed to delete ${title.toLowerCase()}`);
			}
		} catch (error) {
			console.error(`Error deleting ${tableName}:`, error);
			toast.error(`Error deleting ${title.toLowerCase()}`);
		}
	});

	// Drawer handlers
	const handleDrawerClose = useMemoizedCallback(() => {
		setDrawerState({ mode: null, data: null });
	});

	const handleEdit = useMemoizedCallback((item: T) => {
		setDrawerState({ mode: "edit", data: item });
	});

	const handleView = useMemoizedCallback((item: T) => {
		setDrawerState({ mode: "view", data: item });
	});

	const handleCreate = useMemoizedCallback(() => {
		setDrawerState({ mode: "create", data: null });
	});

	const handleDesign = useMemoizedCallback((item: T) => {
		setDrawerState({ mode: "design", data: item });
	});

	const handleFormChange = useMemoizedCallback((event: string) => {
		if (event === "submit") {
			handleDrawerClose();
			fetchData();
		}
	});

	// Table actions (for bulk operations)
	const actions = useMemo(
		() => ({
			deleteMultiple: async (ids: (string | number)[]) => {
				try {
					const result = await apiActions.deleteMultiple(ids);
					if (result) {
						toast.success(
							`${ids.length} ${title.toLowerCase()}(s) deleted successfully`,
						);
						await fetchData();
					} else {
						toast.error(`Failed to delete selected ${title.toLowerCase()}s`);
					}
				} catch (error) {
					console.error(`Error deleting multiple ${tableName}:`, error);
					toast.error(`Error deleting selected ${title.toLowerCase()}s`);
				}
			},
		}),
		[apiActions, fetchData, title, tableName],
	);

	// Effects
	useEffect(() => {
		fetchData();
	}, [fetchData, query]); // Fetch when query changes

	// When search parameters change, use debounced fetch
	const searchTerm = search.get("s");
	useEffect(() => {
		if (searchTerm) {
			debouncedFetch();
		}
	}, [searchTerm, debouncedFetch]);

	return {
		// State
		db,
		loading,
		drawerState,

		// Actions
		fetchData,
		deleteRecord,
		handleDrawerClose,
		handleEdit,
		handleView,
		handleCreate,
		handleDesign,
		handleFormChange,
		setDrawerState,
		actions,

		// Meta
		title,
		breadcrumb,
		query,
	};
}
