import React from "react";

import type { ComponentConfig } from "@/core/types";

export type HTMLProps = {
	value: string;
	class: string;
};

export const HTML: ComponentConfig<HTMLProps> = {
	label: "HTML Code",
	fields: {
		value: { type: "textarea", placeholder: "<div>HTML Code</div>" },
		class: { type: "text", placeholder: "class" },
	},
	defaultProps: {
		value: "<div>HTML Code</div>",
		class: "",
	},
	render: ({ value, class: className, id, puck }) => {
		return (
			<>
				<div
					dangerouslySetInnerHTML={{ __html: value }}
					className={className}
				></div>
			</>
		);
	},
};
