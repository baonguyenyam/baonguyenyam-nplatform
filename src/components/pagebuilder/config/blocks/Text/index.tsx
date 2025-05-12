import React from "react";
import { ALargeSmall, AlignLeft, Hash } from "lucide-react";

import { ComponentConfig } from "@/core";

export type TextProps = {
	align: "left" | "center" | "right";
	text?: string;
	padding?: string;
	size?: any;
	color: "black" | "white" | "#000000" | string;
	maxWidth?: string;
	class?: string;
};

const TextInner: ComponentConfig<TextProps> = {
	fields: {
		text: { type: "textarea" },
		size: {
			type: "text",
			label: "Size",
		},
		align: {
			type: "radio",
			labelIcon: <AlignLeft size={16} />,
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
		},
		color: {
			type: "text",
			label: "Color",
		},
		maxWidth: { type: "text" },
		class: { type: "text", placeholder: "class", labelIcon: <Hash size={16} /> },
	},
	defaultProps: {
		align: "left",
		text: "Text",
		size: "16px",
		color: "#000000",
	},
	render: ({ align, color, text, size, maxWidth, class: className }) => {
		return (
			<span
				className={className}
				style={{
					display: "flex",
					textAlign: align,
					width: "100%",
					fontSize: size,
					fontWeight: 300,
					maxWidth,
					justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
					color: color,
				}}
				dangerouslySetInnerHTML={{ __html: text || "" }}></span>
		);
	},
};

export const Text = TextInner;
