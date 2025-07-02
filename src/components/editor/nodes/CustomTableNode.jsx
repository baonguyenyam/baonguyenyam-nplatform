import { TableCellNode } from "@lexical/table";
import { isHTMLElement } from "lexical";

class CustomTableCellNode extends TableCellNode {
	__borderColor;
	__rotation;

	constructor(
		headerState,
		colSpan,
		width,
		borderColor = "#bbb",
		rotation = 0,
		key,
	) {
		super(headerState, colSpan, width, key);
		this.__borderColor = borderColor;
		this.__rotation = rotation;
	}

	static clone(node) {
		return new CustomTableCellNode(
			node.__headerState,
			node.__colSpan,
			node.__width,
			node.__borderColor || "#bbb",
			node.__rotation || 0,
			node.__key,
		);
	}

	static importDOM() {
		const importers = TableCellNode.importDOM();
		const tempImporters = {
			...importers,
			td: () => ({
				conversion: patchStyleConversion(importers?.td),
				priority: 1,
			}),
			th: () => ({
				conversion: patchStyleConversion(importers?.th),
				priority: 1,
			}),
		};

		return tempImporters;
	}

	static importJSON(serializedNode) {
		return $createCustomTableCellNode().updateFromJSON(serializedNode);
	}

	createDOM(config) {
		const element = super.createDOM(config);

		if (this.__borderColor) {
			element.style.borderColor = this.__borderColor;
		}

		switch (this.__rotation) {
			case 90:
				element.style.writingMode = "vertical-rl";
				break;
			case 180:
				element.style.transform = "rotate(180deg)";
				break;
			case 270:
				element.style.writingMode = "vertical-rl";
				element.style.transform = "rotate(180deg)";
				break;
			case 0:
			default:
				break;
		}

		return element;
	}

	getBorderColor() {
		return this.getLatest().__borderColor;
	}

	setBorderColor(borderColor) {
		const self = this.getWritable();
		self.__borderColor = borderColor;
		return self;
	}

	getRotation() {
		return this.getLatest().__rotation;
	}

	setRotation(rotation) {
		const self = this.getWritable();
		self.__rotation = rotation;
		return self;
	}

	rotateRight() {
		const self = this.getWritable();
		self.__rotation = (self.__rotation + 90) % 360;
		return self;
	}

	rotateLeft() {
		const self = this.getWritable();
		self.__rotation = (self.__rotation - 90 + 360) % 360;
		return self;
	}

	static getType() {
		return "custom-tablecell";
	}

	exportDOM(editor) {
		const output = super.exportDOM(editor);

		if (isHTMLElement(output.element)) {
			const element = output.element;

			if (this.__borderColor) {
				element.style.borderColor = this.__borderColor;
			}

			switch (this.__rotation) {
				case 90:
					element.style.writingMode = "vertical-rl";
					break;
				case 180:
					element.style.transform = "rotate(180deg)";
					break;
				case 270:
					element.style.writingMode = "vertical-rl";
					element.style.transform = "rotate(180deg)";
					break;
				case 0:
				default:
					break;
			}
		}

		return output;
	}

	exportJSON() {
		return {
			...super.exportJSON(),
			borderColor: this.getBorderColor(),
			rotation: this.getRotation(),
		};
	}

	updateFromJSON(serializedNode) {
		return super
			.updateFromJSON(serializedNode)
			.setBorderColor(serializedNode.borderColor || "#bbb")
			.setRotation(serializedNode.rotation || 0);
	}

	updateDOM(prevNode) {
		return (
			super.updateDOM(prevNode) ||
			prevNode.__borderColor !== this.__borderColor ||
			prevNode.__rotation !== this.__rotation
		);
	}
}

export function $createCustomTableCellNode(
	headerState,
	colSpan,
	width,
	borderColor = "#bbb",
	rotation = 0,
) {
	return $applyNodeReplacement(
		new CustomTableCellNode(headerState, colSpan, width, borderColor, rotation),
	);
}

function patchStyleConversion(originalDOMConverter) {
	return (node) => {
		const original = originalDOMConverter?.(node);
		if (!original) {
			return null;
		}
		const originalOutput = original.conversion(node);
		if (!originalOutput) {
			return originalOutput;
		}

		const borderColor = node.style.borderColor;
		const transform = node.style.transform;
		const writingMode = node.style.writingMode;

		let rotation = 0;
		if (transform === "rotate(180deg)" && writingMode === "vertical-rl") {
			rotation = 270;
		} else if (transform === "rotate(180deg)") {
			rotation = 180;
		} else if (writingMode === "vertical-rl") {
			rotation = 90;
		}

		if (originalOutput?.node instanceof CustomTableCellNode) {
			if (borderColor) {
				originalOutput?.node.setBorderColor(borderColor);
			}
			originalOutput?.node.setRotation(rotation);
		}

		return originalOutput;
	};
}

export default CustomTableCellNode;
