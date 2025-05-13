import { useMemo, useRef } from "react";
import debounce from "debounce";

export default function useDebounce<T extends (...args: any[]) => void>(fn: T, ms: number, maxWait?: number) {
	const funcRef = useRef<T | null>(null);
	funcRef.current = fn;

	return useMemo(
		() =>
			debounce(
				(...args: Parameters<T>) => {
					if (funcRef.current) {
						funcRef.current(...args);
					}
				},
				ms,
				{ immediate: false },
			),
		[ms],
	);
}
