import { useCallback, useRef } from "react";

/**
 * Custom hook for stable callback references
 * Helps prevent unnecessary re-renders in child components
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
	callback: T,
): T {
	const callbackRef = useRef<T>(callback);
	callbackRef.current = callback;

	return useCallback(
		(...args: Parameters<T>) => callbackRef.current(...args),
		[],
	) as T;
}

/**
 * Debounce hook for preventing excessive API calls
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): T {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		((...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		}) as T,
		[callback, delay],
	);
}
