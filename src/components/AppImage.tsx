"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { appState } from "@/lib/appConst";

interface AppImageProps {
	src: string;
	alt?: string;
	className?: string;
	width: number;
	height: number;
	id?: string;
	priority?: boolean;
	loading?: "lazy" | "eager";
	onError?: () => void;
}

function AppImage({
	src,
	alt = "Image",
	className = "",
	width,
	height,
	id,
	priority = false,
	loading = "lazy",
	onError
}: AppImageProps) {
	const [imgSrc, setImgSrc] = useState(src || appState.placeholder);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	// Memoized error handler
	const handleError = useCallback(() => {
		setHasError(true);
		setImgSrc(appState.placeholder);
		setIsLoading(false);
		onError?.();
	}, [onError]);

	// Memoized load handler
	const handleLoad = useCallback(() => {
		setIsLoading(false);
		setHasError(false);
	}, []);

	// Only validate image if src changes and is not placeholder
	useEffect(() => {
		if (src && src !== appState.placeholder && src !== imgSrc) {
			setIsLoading(true);
			setHasError(false);
			
			// Use Image constructor for better performance than fetch
			const img = new window.Image();
			img.onload = () => {
				setImgSrc(src);
				setIsLoading(false);
			};
			img.onerror = () => {
				setImgSrc(appState.placeholder);
				setIsLoading(false);
				setHasError(true);
				onError?.();
			};
			img.src = src;

			// Cleanup
			return () => {
				img.onload = null;
				img.onerror = null;
			};
		}
	}, [src, imgSrc, onError]);

	return (
		<div className={`relative ${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
			<Image
				id={id}
				src={imgSrc}
				alt={alt}
				className={`object-cover transition-opacity duration-300 ${
					isLoading ? 'opacity-0' : 'opacity-100'
				} ${hasError ? 'opacity-50' : ''}`}
				width={width}
				height={height}
				priority={priority}
				loading={loading}
				onLoad={handleLoad}
				onError={handleError}
				placeholder="blur"
				blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+pP5+xbNtyleh2XcOVk1Lg5GjbrC8a7y6Vu6lol0ZCz1lzG4RnAlG6xGHQZz1IZJOgwgMBJ5Xgn0nV8hk7mLMc7baHRWkr6Wy3VLppz1IZJCqOl2JYRrVgwPVjMKg2RaGXQhEPG8DQ"
			/>
			{hasError && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
					Failed to load
				</div>
			)}
		</div>
	);
}

// Export memoized version
export default memo(AppImage);
