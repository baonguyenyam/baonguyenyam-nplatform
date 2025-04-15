"use client";

import { useEffect, useState } from "react";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $getRoot, $insertNodes, EditorState, LexicalEditor as LexicalEditorType } from "lexical";

import AutoLinkPlugin from "@/components/editor/plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "@/components/editor/plugins/CodeHighlightPlugin";
import ToolbarPlugin from "@/components/editor/plugins/ToolbarPlugin";
import initTheme from "@/components/editor/themes";

import "@/components/editor/style.css";

function Placeholder() {
	return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
	// The editor theme
	theme: initTheme,
	namespace: "nguyenpham-editor",
	onError(error: unknown) {
		throw error;
	},
	nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, TableNode, TableCellNode, TableRowNode, AutoLinkNode, LinkNode],
};

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

export function LexicalEditor(props: any): React.JSX.Element | null {
	const [isMounted, setIsMounted] = useState(false);
	const { value, onChange, ...restProps } = props;

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

	useEffect(() => {
		setIsMounted(true);
	}, [value]);

	if (!isMounted) return null;

	return (
		<div className="app_editor border border-gray-300 rounded-lg shadow-sm">
			<LexicalComposer
				initialConfig={{
					...editorConfig,
				}}>
				<div className="editor-container">
					<ToolbarPlugin />
					<div className="editor-inner">
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									className="editor-input"
									{...restProps}
								/>
							}
							placeholder={<Placeholder />}
							ErrorBoundary={(props) => <LexicalErrorBoundary.LexicalErrorBoundary {...props} />}
						/>
						<InitializeFromHtmlPlugin htmlString={value} />
						<OnChangePlugin
							onChange={handleOnChange}
							ignoreSelectionChange={true}
						/>
						<ListPlugin />
						<HistoryPlugin />
						<AutoFocusPlugin />
						<CodeHighlightPlugin />
						<LinkPlugin />
						<TabIndentationPlugin />
						<AutoLinkPlugin />
						<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					</div>
				</div>
			</LexicalComposer>
		</div>
	);
}
