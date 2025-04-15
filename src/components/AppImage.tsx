"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { appState } from "@/lib/appConst";

export default function AppImage(props: any) {
	const { src, alt, className, width, height, id } = props;
	const [imgSrc, setImgSrc] = useState(src);

	useEffect(() => {
		const fetchImage = async () => {
			if (src) {
				const res = await fetch(src);
				if (res.status === 200) {
					setImgSrc(src);
				} else {
					setImgSrc(appState.placeholder);
				}
			}
		};
		fetchImage();
	}, [src]);

	return (
		<Image
			id={id || undefined}
			src={imgSrc || appState.placeholder}
			alt={alt || "Image"}
			className={`object-cover ${className}`}
			width={width}
			height={height}
		/>
	);
}
