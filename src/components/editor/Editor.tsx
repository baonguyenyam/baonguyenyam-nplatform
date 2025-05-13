import { useState } from "react";
import { useEffect } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { TRANSFORMERS } from "@lexical/markdown";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $getRoot, $insertNodes, EditorState, LexicalEditor as LexicalEditorType } from "lexical";

import useMediaQuery from "./hooks/useMediaQuery";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin/index";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import ContextMenuPlugin from "./plugins/ContextMenuPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import InlineImagePlugin from "./plugins/InlineImagePlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableHoverActionsPlugin from "./plugins/TableHoverActionsPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import EditorTheme from "./themes/EditorTheme";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";
import Nodes from "./nodes";

import "./index.scss";

function AutoFocusPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		// Focus the editor when the effect fires!
		editor.focus();
	}, [editor]);

	return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
	console.error(error);
}

// Helper Plugin to initialize editor state from HTML string
function InitializeFromHtmlPlugin({ htmlString }: { htmlString?: string }) {
	const [editor] = useLexicalComposerContext();
	const [isInitialized, setIsInitialized] = useState(false);
	useEffect(() => {
		if (editor && htmlString && !isInitialized) {
			editor.update(() => {
				try {
					const parser = new DOMParser();
					const dom = parser.parseFromString(htmlString, "text/html");
					const nodes = $generateNodesFromDOM(editor, dom);
					const root = $getRoot();
					root.clear();
					root.select(); // Ensure selection is on the root before inserting
					$insertNodes(nodes);
					setIsInitialized(true); // Mark as initialized to prevent re-running
				} catch (error) {
					console.error("Error initializing editor from HTML:", error);
				}
			});
		}
	}, [editor, htmlString, isInitialized]); // Depend on editor, htmlString, and initialization status

	return null; // This plugin doesn't render anything
}

export function Editor(props: any) {
	const isSmallWidthViewPort = useMediaQuery("(max-width: 1025px)");
	const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
	const placeholder = <Placeholder>{props.placeholder || "Enter some rich text..."}</Placeholder>;
	const { value, onChange, ...restProps } = props;
	const initialConfig = {
		namespace: "MyEditor",
		theme: EditorTheme,
		onError,
		nodes: [...Nodes],
		showTreeView: true,
	};

	function handleOnChange(editorState: EditorState, editor: LexicalEditorType) {
		// Prevent calling onChange during the very initial state setup
		const isComposing = editor.isComposing();
		const isUpdating = editorState.read(() => $getRoot().getTextContent()) !== ""; // Basic check if content exists

		if (onChange && !isComposing && isUpdating) {
			editorState.read(() => {
				// Generate HTML from the current editor state
				const currentHtmlString = $generateHtmlFromNodes(editor, null);
				// Call the parent's onChange handler only if the content has actually changed from the initial value
				// This check might need refinement depending on exact behavior needed
				if (currentHtmlString !== value || !value) {
					// Trigger if content differs or initial value was empty
					onChange(currentHtmlString);
				}
			});
		}
	}

	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	return (
		<div className="app_editor border border-gray-300 rounded-[10px] dark:bg-gray-900 dark:border-gray-700">
			<LexicalComposer initialConfig={initialConfig}>
				<div className="editor-shell">
					<ToolbarPlugin />
					<div className="editor-container tree-view">
						<ClearEditorPlugin />
						<LexicalAutoLinkPlugin />
						<InlineImagePlugin />
						<CheckListPlugin />
						<RichTextPlugin
							contentEditable={
								<div className="editor-scroller">
									<div
										className="editor"
										ref={onRef}>
										<ContentEditable />
									</div>
								</div>
							}
							placeholder={placeholder}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<InitializeFromHtmlPlugin htmlString={value} />
						<OnChangePlugin onChange={handleOnChange} />
						<HistoryPlugin />
						<AutoFocusPlugin />
						<ComponentPickerPlugin />
						<DragDropPaste />
						<ListPlugin />
						<CodeHighlightPlugin />
						<TableCellResizer />
						<ContextMenuPlugin />
						<TablePlugin
							hasCellMerge={true}
							hasCellBackgroundColor={true}
						/>
						<HorizontalRulePlugin />
						<LinkPlugin />
						{floatingAnchorElem && !isSmallWidthViewPort && (
							<>
								<FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
								<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
								<TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
								<TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
								<FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
							</>
						)}
						<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					</div>
				</div>
			</LexicalComposer>
		</div>
	);
}
