"use client";

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { appState } from "@/lib/appConst";

const SmartImage = (props: any) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const imageRef = useRef<HTMLImageElement>(null);

	const { src, alt, width, height, className, style } = props;

	const imageSrc = isError ? appState.placeholder : src;
	const imageAlt = alt || "Image";
	const imageWidth = width || 1024;
	const imageHeight = height || 768;
	const imageAspectRatio = props.aspectRatio || "16 / 9";

	return (
		<>
			{isLoading && (
				<Skeleton
					className={`h-full w-full ${className}`}
					style={{ aspectRatio: imageAspectRatio, ...style }}
				/>
			)}
			{!isError && (
				<Image
					ref={imageRef}
					src={imageSrc}
					alt={imageAlt}
					width={imageWidth}
					height={imageHeight}
					className={`object-cover ${className}`}
					style={{ aspectRatio: imageAspectRatio, ...style }}
					onLoad={() => {
						setIsLoading(false);
					}}
					onError={() => {
						setIsError(true);
					}}
				/>
			)}
			{isError && (
				<div
					className={`bg-gray-200 ${className}`}
					style={{ aspectRatio: imageAspectRatio, ...style }}>
					<Image
						src={appState.placeholder}
						alt="Fallback Image"
						width={imageWidth}
						height={imageHeight}
						className={`object-cover ${className}`}
						style={{ aspectRatio: imageAspectRatio, ...style }}
						onLoad={() => {
							setIsLoading(false);
						}}
					/>
				</div>
			)}
		</>
	);
};

SmartImage.displayName = "SmartImage";

export { SmartImage };
