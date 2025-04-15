import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_EDITOR_COMMAND } from "lexical";

export function Serializer() {
	const [editor] = useLexicalComposerContext();

	function handleOnSave() {
		console.log(JSON.stringify(editor.getEditorState()));
	}

	function handleOnClear() {
		editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
		editor.focus();
	}

	return (
		<div className="editor-actions">
			<button
				type="button"
				onClick={handleOnSave}>
				Save
			</button>
			<button
				type="button"
				onClick={handleOnClear}>
				Clear
			</button>
		</div>
	);
}
