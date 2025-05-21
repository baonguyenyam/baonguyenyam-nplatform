import { useRef, useState } from "react";
import { useEffect } from "react";
import { indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { EditorView, keymap } from "@codemirror/view";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { TRANSFORMERS } from "@lexical/markdown";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
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
import HtmlDefaultValuePlugin from "./plugins/HtmlDefaultValuePlugin";
import InlineImagePlugin from "./plugins/InlineImagePlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableHoverActionsPlugin from "./plugins/TableHoverActionsPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { useSharedHistoryContext } from "./provider/SharedHistoryProvider";
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
	const sharedHistoryContext = useSharedHistoryContext() as { historyState: any } | null;
	const historyState = sharedHistoryContext?.historyState || null;
	const [isSourceView, setIsSourceView] = useState(false);
	// sourceHtml holds the content for the textarea, initialized from props.value
	const [sourceHtml, setSourceHtml] = useState<string>(value || "");
	const cmIns = useRef<EditorView | null>(null);

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

	// Component for the toggle button and its logic
	const ViewSourceTogglePlugin = () => {
		const [editor] = useLexicalComposerContext();

		const switchToSourceView = () => {
			editor.getEditorState().read(() => {
				const html = $generateHtmlFromNodes(editor, null);
				setSourceHtml(html); // Update local state for textarea
				// If editor's HTML is different from parent's `value`, notify parent.
				if (onChange && html !== value) {
					onChange(html);
				}
			});
			setIsSourceView(true);
		};

		const switchToEditorView = () => {
			// `sourceHtml` is the truth from the textarea.
			// Notify parent of this new HTML content.
			if (onChange && sourceHtml !== value) {
				onChange(sourceHtml);
			}
			// The ControlledHtmlPlugin will see the updated `value` (if onChange changed it)
			// and update the editor. However, for immediate effect and robustness:
			editor.update(() => {
				try {
					const parser = new DOMParser();
					const dom = parser.parseFromString(sourceHtml, "text/html");
					const nodes = $generateNodesFromDOM(editor, dom);
					const root = $getRoot();
					root.clear();
					$insertNodes(nodes);
				} catch (error) {
					console.error("Error updating editor from source HTML:", error);
				}
			});
			setIsSourceView(false);
		};

		return (
			<>
				<button
					type="button"
					onClick={isSourceView ? () => switchToEditorView() : () => switchToSourceView()}
					style={{
						borderRadius: "5px",
						cursor: "pointer",
						padding: "2px 7px",
					}}
					className="bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
					{isSourceView ? "Visual Editor" : "HTML Code"}
				</button>
			</>
		);
	};

	const formatHTML = (formatHTML: string) => {
		const tab = "  ";
		let result = "";
		let indentLevel = 0;

		formatHTML.split(/>\s*</).forEach((element) => {
			if (element.startsWith("</")) {
				indentLevel--;
			}
			result += tab.repeat(indentLevel) + "<" + element + ">\n";
			if (element.startsWith("<") && !element.startsWith("</") && !element.endsWith("/>")) {
				indentLevel++;
			}
		});

		result = result.replace(/<</g, "<");
		result = result.replace(/>>/g, ">");

		return result;
	};

	const formatHTMLToBeauty = () => {
		const formattedHtml = sourceHtml;
		const r = formatHTML(formattedHtml);

		setSourceHtml(r);

		if (onChange) {
			onChange(r);
		}
	};

	useEffect(() => {
		if (isSourceView) {
			formatHTMLToBeauty();
		}
	}, [isSourceView]);

	return (
		<div className="app_editor border border-gray-300 rounded-[10px] dark:bg-gray-900 dark:border-gray-700 relative pb-9">
			<LexicalComposer initialConfig={initialConfig}>
				{isSourceView && (
					<div className="source-code-view rounded-tl-[10px] rounded-tr-[10px] overflow-hidden">
						<CodeMirror
							value={sourceHtml}
							theme={vscodeDark}
							onChange={(value) => {
								setSourceHtml(value);
								if (onChange) {
									onChange(value);
								}
							}}
							extensions={[html(), vscodeDark, EditorView.lineWrapping, keymap.of([indentWithTab])]}
							basicSetup={{
								lineNumbers: true,
								tabSize: 2,
								indentOnInput: false,
							}}
							style={{
								borderRadius: "10px 10px 0 0",
								width: "100%",
								resize: "vertical",
								fontSize: "13px",
							}}
							indentWithTab={true}
							placeholder="Edit HTML source..."
							className="dark:bg-gray-800 dark:text-gray-200 overflow-y-auto"
							maxWidth="100%"
						/>
					</div>
				)}

				{!isSourceView && (
					<div className="editor-shell">
						<ToolbarPlugin />
						<div className="editor-container tree-view">
							<HtmlDefaultValuePlugin htmlValue={props.defaultValue} />
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
							<HistoryPlugin externalHistoryState={historyState} />
							<AutoFocusPlugin />
							<ComponentPickerPlugin />
							<DragDropPaste />
							<ListPlugin />
							<HashtagPlugin />
							<KeywordsPlugin />
							<CodeHighlightPlugin />
							<TableCellResizer />
							<TabFocusPlugin />
							<ContextMenuPlugin />
							<TabIndentationPlugin maxIndent={7} />
							<TablePlugin
								hasCellMerge={true}
								hasCellBackgroundColor={true}
							/>
							<HorizontalRulePlugin />
							<LinkPlugin />
							<ClickableLinkPlugin />
							{floatingAnchorElem && !isSmallWidthViewPort && (
								<>
									<FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
									<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
									<TableCellActionMenuPlugin
										anchorElem={floatingAnchorElem}
										cellMerge={true}
									/>
									<TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
									<FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
								</>
							)}
							<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
						</div>
					</div>
				)}

				<div
					style={{
						position: "absolute",
						display: "flex",
						alignItems: "center",
						justifyContent: "end",
						bottom: "0",
						right: "0",
						width: "100%",
						zIndex: 100,
						height: "38px",
						padding: "0 5px",
						borderRadius: "0 0 10px 10px",
					}}
					className="bg-gray-50 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-800">
					<ViewSourceTogglePlugin />
				</div>
			</LexicalComposer>
		</div>
	);
}
