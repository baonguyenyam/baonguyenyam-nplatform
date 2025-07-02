import type { CSSProperties } from "react";

import { Content, type DragAxis } from "../../types";

export type DropZoneProps = {
	zone: string;
	allow?: string[];
	disallow?: string[];
	style?: CSSProperties;
	minEmptyHeight?: number;
	className?: string;
	collisionAxis?: DragAxis;
};
