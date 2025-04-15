"use client";

import { Editor } from "./editor/Editor";

export function AppEditor(props: any) {
	const { onChange } = props;
	return (
		<div className="w-full h-full">
			<Editor
				{...props}
				onChange={onChange}
			/>
		</div>
	);
}
