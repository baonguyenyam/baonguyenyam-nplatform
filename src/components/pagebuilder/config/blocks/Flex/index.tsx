import React from "react";
import { Hash } from "lucide-react";

import { getClassNameFactory } from "@/core/lib";
import { ComponentConfig, Slot } from "@/core/types";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Flex", styles);

export type FlexProps = {
	justifyContent: "start" | "center" | "end" | "space-between";
	alignItems: "start" | "center" | "end";
	direction: "row" | "column";
	gap: number;
	wrap: "wrap" | "nowrap";
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
	maxWidth?: string;
};

const FlexInternal: ComponentConfig<FlexProps> = {
	fields: {
		direction: {
			label: "Direction",
			type: "radio",
			options: [
				{ label: "Row", value: "row" },
				{ label: "Column", value: "column" },
			],
		},
		justifyContent: {
			label: "Justify Content",
			type: "radio",
			options: [
				{ label: "Start", value: "start" },
				{ label: "Center", value: "center" },
				{ label: "End", value: "end" },
				{ label: "Between", value: "space-between" },
			],
		},
		alignItems: {
			label: "Align Items",
			type: "radio",
			options: [
				{ label: "Start", value: "start" },
				{ label: "Center", value: "center" },
				{ label: "End", value: "end" },
			],
		},
		gap: {
			label: "Gap",
			type: "number",
			min: 0,
		},
		wrap: {
			label: "Wrap",
			type: "radio",
			options: [
				{ label: "true", value: "wrap" },
				{ label: "false", value: "nowrap" },
			],
		},
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
			max: 1,
			labelIcon: <Hash size={16} />,
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
		maxWidth: {
			label: "Max Width",
			type: "text",
			placeholder: "max-width",
			labelIcon: <Hash size={16} />,
		},
		class: {
			type: "text",
			placeholder: "class",
			labelIcon: <Hash size={16} />,
		},
	},
	defaultProps: {
		justifyContent: "start",
		alignItems: "start",
		direction: "row",
		gap: 24,
		wrap: "wrap",
		items: [],
	},
	render: ({
		justifyContent,
		alignItems,
		direction,
		gap,
		wrap,
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
		maxWidth,
		puck,
	}) => {
		return (
			<Items
				disallow={["Hero", "Stats"]}
				className={getClassName() + (className ? ` ${className}` : "")}
				style={{
					justifyContent,
					alignItems,
					flexDirection: direction,
					gap,
					backgroundColor,
					backgroundImage: backgroundImage
						? `url(${backgroundImage})`
						: undefined,
					backgroundSize,
					backgroundPosition,
					backgroundRepeat,
					backgroundAttachment,
					flexWrap: wrap,
					paddingTop: padding?.[0]?.top,
					paddingRight: padding?.[0]?.right,
					paddingBottom: padding?.[0]?.bottom,
					paddingLeft: padding?.[0]?.left,
					marginTop: margin?.[0]?.top,
					marginRight: margin?.[0]?.right,
					marginBottom: margin?.[0]?.bottom,
					marginLeft: margin?.[0]?.left,
					maxWidth,
				}}
			/>
		);
	},
};

export const Flex = FlexInternal;
