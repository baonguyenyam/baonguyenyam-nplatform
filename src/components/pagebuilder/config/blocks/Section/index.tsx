import { Hash } from "lucide-react";
import React from "react";

import { getClassNameFactory } from "@/core/lib";
import type { ComponentConfig, Slot } from "@/core/types";

import { withLayout } from "../../components/Layout";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Section", styles);

export type SectionProps = {
	items: Slot;
	backgroundColor?: string;
	backgroundImage?: string;
	backgroundSize?: "cover" | "contain" | string;
	backgroundPosition?: "top" | "bottom" | "left" | "right" | "center" | string;
	backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
	backgroundAttachment?: "fixed" | "scroll" | "local";
	padding?: Array<{ top: string; right: string; bottom: string; left: string }>;
	margin?: Array<{ top: string; right: string; bottom: string; left: string }>;
	class?: string;
};

const SectionInternal: ComponentConfig<SectionProps> = {
	fields: {
		items: {
			type: "slot",
		},
		backgroundColor: {
			label: "Background Color",
			type: "text",
			labelIcon: <Hash size={16} />,
		},
		backgroundImage: {
			label: "Background Image",
			type: "text",
			placeholder: "https://example.com/image.jpg",
			labelIcon: <Hash size={16} />,
		},
		backgroundSize: {
			label: "Background Size",
			type: "radio",
			options: [
				{ label: "Cover", value: "cover" },
				{ label: "Contain", value: "contain" },
			],
		},
		backgroundPosition: {
			label: "Background Position",
			type: "radio",
			options: [
				{ label: "Top", value: "top" },
				{ label: "Bottom", value: "bottom" },
				{ label: "Left", value: "left" },
				{ label: "Right", value: "right" },
				{ label: "Center", value: "center" },
			],
		},
		backgroundRepeat: {
			label: "Background Repeat",
			type: "radio",
			options: [
				{ label: "No", value: "no-repeat" },
				{ label: "Repeat", value: "repeat" },
				{ label: "X", value: "repeat-x" },
				{ label: "Y", value: "repeat-y" },
			],
		},
		backgroundAttachment: {
			label: "Background Attachment",
			type: "radio",
			options: [
				{ label: "Fixed", value: "fixed" },
				{ label: "Scroll", value: "scroll" },
				{ label: "Local", value: "local" },
			],
		},
		padding: {
			label: "Padding",
			type: "array",
			defaultItemProps: {
				top: "0px",
				right: "0px",
				bottom: "0px",
				left: "0px",
			},
			getItemSummary: (item) => {
				return `${item.top} ${item.right} ${item.bottom} ${item.left}`;
			},
			arrayFields: {
				top: {
					type: "text",
					placeholder: "Top",
					labelIcon: <Hash size={16} />,
				},
				right: {
					type: "text",
					placeholder: "Right",
					labelIcon: <Hash size={16} />,
				},
				bottom: {
					type: "text",
					placeholder: "Bottom",
					labelIcon: <Hash size={16} />,
				},
				left: {
					type: "text",
					placeholder: "Left",
					labelIcon: <Hash size={16} />,
				},
			},
			labelIcon: <Hash size={16} />,
			max: 1,
		},
		margin: {
			label: "Margin",
			type: "array",
			defaultItemProps: {
				top: "0px",
				right: "0px",
				bottom: "0px",
				left: "0px",
			},
			getItemSummary: (item) => {
				return `${item.top} ${item.right} ${item.bottom} ${item.left}`;
			},
			arrayFields: {
				top: {
					type: "text",
					placeholder: "Top",
					labelIcon: <Hash size={16} />,
				},
				right: {
					type: "text",
					placeholder: "Right",
					labelIcon: <Hash size={16} />,
				},
				bottom: {
					type: "text",
					placeholder: "Bottom",
					labelIcon: <Hash size={16} />,
				},
				left: {
					type: "text",
					placeholder: "Left",
					labelIcon: <Hash size={16} />,
				},
			},
			labelIcon: <Hash size={16} />,
			max: 1,
		},
		class: {
			type: "text",
			placeholder: "class",
			labelIcon: <Hash size={16} />,
		},
	},
	defaultProps: {
		items: [],
	},
	render: ({
		items: Items,
		backgroundColor,
		backgroundImage,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		backgroundAttachment,
		padding,
		margin,
		class: className,
		puck,
	}) => {
		return (
			<Items
				// disallow={["Hero", "Stats"]}
				className={getClassName() + (className ? ` ${className}` : "")}
				style={{
					backgroundColor,
					backgroundImage: backgroundImage
						? `url(${backgroundImage})`
						: undefined,
					backgroundSize,
					backgroundPosition,
					backgroundRepeat,
					backgroundAttachment,
					paddingTop: padding?.[0]?.top,
					paddingRight: padding?.[0]?.right,
					paddingBottom: padding?.[0]?.bottom,
					paddingLeft: padding?.[0]?.left,
					marginTop: margin?.[0]?.top,
					marginRight: margin?.[0]?.right,
					marginBottom: margin?.[0]?.bottom,
					marginLeft: margin?.[0]?.left,
				}}
			/>
		);
	},
};

export const Section = withLayout(SectionInternal);
