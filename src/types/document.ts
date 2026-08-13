import type { Token } from "./token.js";

export interface Document {
	nodes: LayoutNode[];
};

export enum NodeKind {
	// Layout
	Heading,
	Paragraph,
	UnorderedList,
	OrderedList,
	Component,
	EmptyLine,
	Citation,
	Block,
	Collapsible,

	// Content
	Bold,
	Italic,
	Text,
	UnorderedListItem,
	OrderedListItem,
	ComponentAttribute,

	// Literals
	String,
	Number,
	Boolean,
	Atom,
};

export type Node =
	| LayoutNode
	| ContentNode
	| LiteralNode;

export type LayoutNode =
	| HeadingNode
	| ParagraphNode
	| UnorderedListNode
	| OrderedListNode
	| ComponentNode
	| EmptyLineNode
	| CitationNode
	| BlockNode
	| CollapsibleNode;

export type ContentNode =
	| TextNode
	| BoldNode
	| ItalicNode
	| UnorderedListItemNode
	| OrderedListItemNode
	| ComponentAttributeNode;

export type LiteralNode =
	| StringNode
	| NumberNode
	| BooleanNode
	| AtomNode;

// layout nodes
export interface HeadingNode {
	kind: NodeKind.Heading;
	level: number;
	content: ContentNode;
};

export interface ParagraphNode {
	kind: NodeKind.Paragraph;
	childrens: ContentNode[];
};

export interface UnorderedListNode {
	kind: NodeKind.UnorderedList;
	items: UnorderedListItemNode[];
}

export interface OrderedListNode {
	kind: NodeKind.OrderedList;
	items: OrderedListItemNode[];
}

export interface ComponentNode {
	kind: NodeKind.Component;
	name: string;
	attributes: ComponentAttributeNode[];
}

export interface EmptyLineNode {
	kind: NodeKind.EmptyLine;
	count: number;
}

export interface CitationNode {
	kind: NodeKind.Citation;
	content: ContentNode;
}

export interface BlockNode {
	kind: NodeKind.Block;
	level: number;
	childrens: LayoutNode[];
}

export interface CollapsibleNode {
	kind: NodeKind.Collapsible;
	title: ContentNode;
	block: BlockNode;
}

// content nodes
export interface BoldNode {
	kind: NodeKind.Bold;
	content: string;
};

export interface ItalicNode {
	kind: NodeKind.Italic;
	content: string;
};

export interface TextNode {
	kind: NodeKind.Text;
	content: string;
};

export interface UnorderedListItemNode {
	kind: NodeKind.UnorderedListItem;
	item: ContentNode;
}

export interface OrderedListItemNode {
	kind: NodeKind.OrderedListItem;
	index: number;
	item: ContentNode;
}

export interface ComponentAttributeNode {
	kind: NodeKind.ComponentAttribute;
	name: string | null;
	value: LiteralNode;
}

// literal nodes
export interface StringNode {
	kind: NodeKind.String;
	value: string;
}

export interface NumberNode {
	kind: NodeKind.Number;
	value: number;
}

export interface BooleanNode {
	kind: NodeKind.Boolean;
	value: boolean;
}

export interface AtomNode {
	kind: NodeKind.Atom,
	value: string;
}
