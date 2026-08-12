import type { Token } from "./token.js";

export interface Document {
	nodes: LayoutNode[];
};

export enum NodeKind {
	// Layout
	Heading,
	Paragraph,
	UnorderedList,
	Component,
	EmptyLine,

	// Content
	Bold,
	Italic,
	Text,
	UnorderedListItem,
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
	| ComponentNode
	| EmptyLineNode;

export type ContentNode =
	| TextNode
	| BoldNode
	| ItalicNode
	| UnorderedListItemNode
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

export interface ComponentNode {
	kind: NodeKind.Component;
	name: string;
	attributes: ComponentAttributeNode[];
}

export interface EmptyLineNode {
	kind: NodeKind.EmptyLine;
	count: number;
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
