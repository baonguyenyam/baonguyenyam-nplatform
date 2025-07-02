import React from "react";
import { Hash } from "lucide-react";

import { ComponentConfig } from "@/core/types";

export type ButtonProps = {
	label: string;
	href: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
	color: "black" | "white" | "#000000" | string;
	backgroundColor?: string;
	fontSize?: string;
	fontWeight?:
		| "100"
		| "200"
		| "300"
		| "400"
		| "500"
		| "600"
		| "700"
		| "800"
		| "900";
	radius?: string;
	display?: "inline-block" | "block";
	letterSpacing?: string;
	textAlign?: "left" | "center" | "right";
	textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
	padding?: Array<{ top: string; right: string; bottom: string; left: string }>;
	class?: string;
};

export const Button: ComponentConfig<ButtonProps> = {
	label: "Button",
	fields: {
		label: { type: "text", placeholder: "Lorem ipsum..." },
		href: { type: "text" },
		target: {
			type: "radio",
			label: "Target",
			options: [
				{ label: "_blank", value: "_blank" },
				{ label: "_self", value: "_self" },
				{ label: "_parent", value: "_parent" },
				{ label: "_top", value: "_top" },
			],
		},
		color: {
			type: "text",
			label: "Color",
		},
		backgroundColor: {
			label: "Background Color",
			type: "text",
			labelIcon: <Hash size={16} />,
		},
		display: {
			label: "Display",
			type: "radio",
			options: [
				{ label: "Inline Block", value: "inline-block" },
				{ label: "Block", value: "block" },
			],
		},
		letterSpacing: {
			label: "Letter Spacing",
			type: "text",
			placeholder: "letter-spacing",
			labelIcon: <Hash size={16} />,
		},
		textAlign: {
			label: "Text Align",
			type: "radio",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
		},
		textTransform: {
			label: "Text Transform",
			type: "select",
			options: [
				{ label: "Uppercase", value: "uppercase" },
				{ label: "Lowercase", value: "lowercase" },
				{ label: "Capitalize", value: "capitalize" },
				{ label: "None", value: "none" },
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
		fontSize: {
			label: "Font Size",
			type: "text",
			placeholder: "font-size",
			labelIcon: <Hash size={16} />,
		},
		fontWeight: {
			label: "Font Weight",
			type: "select",
			options: [
				{ label: "100", value: "100" },
				{ label: "200", value: "200" },
				{ label: "300", value: "300" },
				{ label: "400", value: "400" },
				{ label: "500", value: "500" },
				{ label: "600", value: "600" },
				{ label: "700", value: "700" },
				{ label: "800", value: "800" },
				{ label: "900", value: "900" },
			],
			labelIcon: <Hash size={16} />,
		},
		radius: {
			label: "Border Radius",
			type: "text",
			placeholder: "border-radius",
			labelIcon: <Hash size={16} />,
		},
		class: {
			type: "text",
			placeholder: "class",
			labelIcon: <Hash size={16} />,
		},
	},
	defaultProps: {
		label: "Button",
		href: "#",
		color: "",
	},
	render: ({
		href,
		color,
		label,
		backgroundColor,
		padding,
		class: className,
		radius,
		target,
		fontSize,
		fontWeight,
		display,
		letterSpacing,
		textAlign,
		textTransform,
		puck,
	}) => {
		return (
			<>
				{href !== "#" ? (
					<a
						href={href}
						target={target}
						style={{
							color: color,
							backgroundColor: backgroundColor,
							padding: padding?.length
								? `${padding[0].top} ${padding[0].right} ${padding[0].bottom} ${padding[0].left}`
								: "0px",
							textDecoration: "none",
							display: display,
							fontSize: fontSize,
							fontWeight: fontWeight,
							textAlign: textAlign,
							letterSpacing: letterSpacing,
							cursor: "pointer",
							borderRadius: radius,
							textTransform: textTransform,
						}}
						tabIndex={puck.isEditing ? -1 : undefined}
						className={className}
					>
						{label}
					</a>
				) : (
					<span
						style={{
							color: color,
							backgroundColor: backgroundColor,
							padding: padding?.length
								? `${padding[0].top} ${padding[0].right} ${padding[0].bottom} ${padding[0].left}`
								: "0px",
							textDecoration: "none",
							display: display,
							fontSize: fontSize,
							fontWeight: fontWeight,
							textAlign: textAlign,
							letterSpacing: letterSpacing,
							cursor: "pointer",
							borderRadius: radius,
							textTransform: textTransform,
						}}
						tabIndex={puck.isEditing ? -1 : undefined}
						className={className}
					>
						{label}
					</span>
				)}
			</>
		);
	},
};
