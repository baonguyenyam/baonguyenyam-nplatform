import { Hash } from "lucide-react";
import React from "react";

import type { ComponentConfig } from "@/core";
import type { HeadingProps as _HeadingProps } from "@/core/components/Heading";
import { Heading as _Heading } from "@/core/components/Heading";

export type HeadingProps = {
	align: "left" | "center" | "right";
	text?: string;
	level?: _HeadingProps["rank"];
	size: _HeadingProps["size"];
	class?: string;
};

const sizeOptions = [
	{ value: "xxxl", label: "XXXL" },
	{ value: "xxl", label: "XXL" },
	{ value: "xl", label: "XL" },
	{ value: "l", label: "L" },
	{ value: "m", label: "M" },
	{ value: "s", label: "S" },
	{ value: "xs", label: "XS" },
];

const levelOptions = [
	{ label: "", value: "" },
	{ label: "1", value: "1" },
	{ label: "2", value: "2" },
	{ label: "3", value: "3" },
	{ label: "4", value: "4" },
	{ label: "5", value: "5" },
	{ label: "6", value: "6" },
];

const HeadingInternal: ComponentConfig<HeadingProps> = {
	fields: {
		text: {
			type: "textarea",
		},
		size: {
			type: "select",
			options: sizeOptions,
		},
		level: {
			type: "select",
			options: levelOptions,
		},
		align: {
			type: "radio",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
		},
		class: {
			type: "text",
			placeholder: "class",
			labelIcon: <Hash size={16} />,
		},
	},
	defaultProps: {
		align: "left",
		text: "Heading",
		size: "m",
	},
	render: ({ align, text, size, level }) => {
		return (
			<_Heading size={size} rank={level as any}>
				<span style={{ display: "block", textAlign: align, width: "100%" }}>
					{text}
				</span>
			</_Heading>
		);
	},
};

export const Heading = HeadingInternal;
