import { $applyNodeReplacement, TextNode } from "lexical";

export class KeywordNode extends TextNode {
  static getType() {
    return "keyword";
  }

  static clone(node: any) {
    return new KeywordNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: any) {
    return $createKeywordNode().updateFromJSON(serializedNode);
  }

  createDOM(config: any) {
    const dom = super.createDOM(config);
    dom.style.cursor = "default";
    dom.className = "keyword";
    return dom;
  }

  canInsertTextBefore() {
    return false;
  }

  canInsertTextAfter() {
    return false;
  }

  isTextEntity() {
    return true;
  }
}

export function $createKeywordNode(keyword = "") {
  return $applyNodeReplacement(new KeywordNode(keyword));
}

export function $isKeywordNode(node: any) {
  return node instanceof KeywordNode;
}
