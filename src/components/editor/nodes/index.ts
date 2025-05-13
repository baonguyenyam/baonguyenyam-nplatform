/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import type { Klass, LexicalNode } from "lexical";
import { TextNode } from "lexical";

import CustomTableCellNode from "./CustomTableNode";
import CustomTextNode from "./CustomTextNode";
import { EmojiNode } from "./EmojiNode";
import { InlineImageNode } from "./InlineImageNode";
import { KeywordNode } from "./KeywordNode";
import { TweetNode } from "./TweetNode";
import { YouTubeNode } from "./YouTubeNode";

// const Nodes: Array<Klass<LexicalNode>> = [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, TableNode, TableCellNode, TableRowNode, CodeHighlightNode, AutoLinkNode, LinkNode, OverflowNode, InlineImageNode, EmojiNode, HorizontalRuleNode, TweetNode, YouTubeNode, MarkNode];

// export default Nodes;


const NodeList = [
	HeadingNode,
	ListNode,
	ListItemNode,
	QuoteNode,
	CodeNode,
	TableNode,
	TableRowNode,
	HashtagNode,
	CodeHighlightNode,
	AutoLinkNode,
	LinkNode,
	OverflowNode,
	HorizontalRuleNode,
	MarkNode,
	KeywordNode,
	CustomTableCellNode,
	InlineImageNode,
	EmojiNode,
	TweetNode,
	YouTubeNode,
	{
		replace: TableCellNode,
		with: (node: any) => {
			return new CustomTableCellNode(
				node.__headerState,
				node.__colSpan,
				node.__width,
				node.__borderColor,
				node.__rotation
			);
		},
		withKlass: CustomTableCellNode,
	},
	CustomTextNode,
	{
		replace: TextNode,
		with: (node: any) => {
			return new CustomTextNode(node.__text);
		},
		withKlass: CustomTextNode,
	},
];

export default NodeList;