import type { ComponentProcessorRegistry } from "../types/component.js";
import {
	type Document,
	type LayoutNode,
	NodeKind,
	type HeadingNode,
	type ParagraphNode,
	type ContentNode,
	type UnorderedListNode,
	type ComponentNode
} from "../types/document.js";

export class Compiler {
	private depth = 0;

	public constructor(
		private document: Document,
		private processors: ComponentProcessorRegistry
	) { }

	public compile(): string {
		const bodyChildren: string[] = [];

		this.depth = 2;
		for (const node of this.document.nodes) {
			bodyChildren.push(this.compileLayoutNode(node));
		}
	  
		this.depth = 1;
		const head = [
			this.indent("<head>"),
			this.indent('\t<meta charset="UTF-8">'),
			this.indent('\t<link rel="stylesheet" href="emd.css">'),
			this.indent("</head>")
		].join("\n");

		const body = [
			this.indent(`<body class="emd-document">`),
			bodyChildren.join("\n"),
			this.indent("</body>")
		].join("\n");

		return [
			"<!DOCTYPE html>",
			"<html>",
			head,
			body,
			"</html>"
		].join("\n");
	}

	private compileLayoutNode(node: LayoutNode): string {
		switch (node.kind) {
			case NodeKind.Heading: return this.compileHeadingNode(node as HeadingNode);
			case NodeKind.Paragraph: return this.compileParagraphNode(node as ParagraphNode);
			case NodeKind.EmptyLine: return this.indent(`<br class="emd-empty-line">`);
			case NodeKind.UnorderedList: return this.compileUnorderedListNode(node as UnorderedListNode);
			case NodeKind.Component: return this.compileComponentNode(node as ComponentNode);
		}
	}

	private compileHeadingNode(node: HeadingNode): string {
		const bodyCode = this.compileContentNode(node.content).trim();
	  return this.indent(`<h${node.level} class="emd-heading emd-heading--${node.level}">${bodyCode}</h${node.level}>`);
	}

	private compileParagraphNode(node: ParagraphNode): string {
		const bodyChildren: string[] = [];

		for (const child of node.childrens) {
			bodyChildren.push(this.compileContentNode(child));
		}

		return this.indent(`<p class="emd-paragraph">${bodyChildren.join("")}</p>`);
	}

	private compileUnorderedListNode(
		node: UnorderedListNode
	): string {
		const parentDepth = this.depth++;
		const bodyChildren: string[] = [];

		for (const child of node.items) {
			const content = this.compileContentNode(child.item).trim();
			bodyChildren.push(this.indent(`<li class="emd-list-item">${content}</li>`));
		}

		this.depth = parentDepth;

		const code = [
			this.indent(`<ul class="emd-list emd-list--unordered">`),
			bodyChildren.join("\n"),
			this.indent("</ul>")
		].join("\n");

		return code;
	}

	private compileComponentNode(node: ComponentNode): string {
		if (!this.processors.has(node.name)) {
			throw new Error(`Not found processor for component ${node.name}.`);
		}

		const processor = this.processors.get(node.name)!;
		return this.indent(processor.process({
			depth: this.depth,
			attributes: node.attributes,
			document: this.document
		}));
	}

	private compileContentNode(node: ContentNode): string {
		switch (node.kind) {
			case NodeKind.Bold: return `<b>${node.content}</b>`;
			case NodeKind.Italic: return `<i>${node.content}</i>`;
			case NodeKind.Text: return node.content;
			default: throw new Error("Invalid node found during content node compiling.");
		}
	}

	private indent(content: string): string {
		return "\t".repeat(this.depth) + content;
	}
}
