"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { appState } from "@/lib/appConst";

interface AppImageProps {
	src: string;
	alt?: string;
	className?: string;
	title?: string;
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
	title = "",
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

	// Enhanced image validation with retry logic and better error handling
	useEffect(() => {
		if (src && src !== appState.placeholder && src !== imgSrc) {
			setIsLoading(true);
			setHasError(false);

			let retryCount = 0;
			const maxRetries = 2;

			const tryLoadImage = () => {
				const img = new window.Image();

				img.onload = () => {
					setImgSrc(src);
					setIsLoading(false);
					setHasError(false);
				};

				img.onerror = () => {
					retryCount++;
					if (retryCount < maxRetries) {
						// Retry after a short delay
						setTimeout(tryLoadImage, 1000 * retryCount);
					} else {
						setImgSrc(appState.placeholder);
						setIsLoading(false);
						setHasError(true);
						onError?.();
					}
				};

				// Add timeout for slow-loading images
				const timeout = setTimeout(() => {
					img.src = ''; // Cancel loading
					if (retryCount < maxRetries) {
						retryCount++;
						tryLoadImage();
					} else {
						setImgSrc(appState.placeholder);
						setIsLoading(false);
						setHasError(true);
						onError?.();
					}
				}, 10000); // 10 second timeout

				img.onload = () => {
					clearTimeout(timeout);
					setImgSrc(src);
					setIsLoading(false);
					setHasError(false);
				};

				img.onerror = () => {
					clearTimeout(timeout);
					retryCount++;
					if (retryCount < maxRetries) {
						setTimeout(tryLoadImage, 1000 * retryCount);
					} else {
						setImgSrc(appState.placeholder);
						setIsLoading(false);
						setHasError(true);
						onError?.();
					}
				};

				img.src = src;

				return () => {
					clearTimeout(timeout);
					img.onload = null;
					img.onerror = null;
				};
			};

			const cleanup = tryLoadImage();
			return cleanup;
		}
	}, [src, imgSrc, onError]);

	return (
		<div className={`relative ${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
			<Image
				id={id}
				src={imgSrc}
				alt={alt}
				title={title}
				className={`object-cover transition-opacity duration-300 h-full rounded ${hasError ? 'opacity-50' : ''}`}
				width={width}
				height={height}
				priority={priority}
				loading={loading}
				onLoad={handleLoad}
				onError={handleError}
				placeholder="blur"
				blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+pP5+xbNtyleh2XcOVk1Lg5GjbrC8a7y6Vu6lol0ZCz1lzG4RnAlG6xGHQZz1IZJOgwgMBJ5Xgn0nV8hk7mLMc7baHRWkr6Wy3VLppz1IZJCqOl2JYRrVgwPVjMKg2RaGXQhEPG8DQ"
				// Enhanced image optimization
				sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
				quality={85}
				unoptimized={imgSrc === appState.placeholder}
			/>
			{hasError && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded">
					<div className="text-center">
						<div className="mb-1">⚠️</div>
						<div>Failed to load</div>
					</div>
				</div>
			)}
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
				</div>
			)}
		</div>
	);
}

// Export memoized version
export default memo(AppImage);
