import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect, useRef } from "react";

function HtmlDefaultValuePlugin({ htmlValue }) {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current && htmlValue) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlValue, "text/html");
        const root = $getRoot();
        root.clear();

        const nodes = $generateNodesFromDOM(editor, dom);
        nodes.forEach((node) => root.append(node));

        const firstNode = root.getLastChild();
        if (firstNode) {
          firstNode.select();
        }
      });

      isInitializedRef.current = true;
    }
  }, [editor, htmlValue]);

  return null;
}

export default HtmlDefaultValuePlugin;
