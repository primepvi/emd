import type { ComponentProcessorRegistry } from "../types/component.js";
import {
	NodeKind,
	type Document,
	type LayoutNode,
	type HeadingNode,
	type ParagraphNode,
	type ContentNode,
	type UnorderedListNode,
	type ComponentNode,
	type CitationNode,
	type CollapsibleNode,
	type BlockNode,
	type OrderedListNode
} from "../types/document.js";
import { Lexer } from "./Lexer.js";
import { Parser } from "./Parser.js";

export interface CompilerOutput {
	document: string[];
}

export class Compiler {
	private depth = 0;
	private document: Document;

	public constructor(
		source: string,
		private processors: ComponentProcessorRegistry
	) {
		const lexer = new Lexer(source);
		const parser = new Parser(lexer.lex());
		this.document = parser.parse();
	}

	public compile(): CompilerOutput {
		const bodyChildren: string[] = [];

		this.depth = 2;
		for (const node of this.document.nodes) {
			bodyChildren.push(this.compileLayoutNode(node));
		}

		const document = [
			'<div class="emd-document">',
			bodyChildren.join("\n"),
			"</div>"
		];

		return { document };
	}

	private compileLayoutNode(node: LayoutNode): string {
		switch (node.kind) {
			case NodeKind.Block: return this.compileBlockNode(node as BlockNode);
			case NodeKind.Heading: return this.compileHeadingNode(node as HeadingNode);
			case NodeKind.Paragraph: return this.compileParagraphNode(node as ParagraphNode);
			case NodeKind.EmptyLine: return this.indent(`<br class="emd-empty-line">`);
			case NodeKind.UnorderedList: return this.compileUnorderedListNode(node as UnorderedListNode);
			case NodeKind.OrderedList: return this.compileOrderedListNode(node as OrderedListNode);
			case NodeKind.Component: return this.compileComponentNode(node as ComponentNode);
			case NodeKind.Citation: return this.compileCitationNode(node as CitationNode);
			case NodeKind.Collapsible: return this.compileCollapsibleNode(node as CollapsibleNode);

		}
	}

	private compileBlockNode(node: BlockNode): string {
		const bodyChildren: string[] = [];

		const parentDepth = this.depth++;
		for (const child of node.childrens) {
			bodyChildren.push(this.compileLayoutNode(child));
		}

		this.depth = parentDepth;
		const code = [
			this.indent(`<div class="emd-block emd-block--${node.level}">`),
			bodyChildren.join("\n"),
			this.indent(`</div>`)
		];

		return code.join("\n");
	}

	private compileCitationNode(node: CitationNode): string {
		const body = this.compileContentNode(node.content);
		return this.indent(`<blockquote class="emd-quote">${body}</blockquote>`);
	}

	private compileCollapsibleNode(node: CollapsibleNode): string {
		const parentDepth = this.depth++;

		const summary = this.indent(`<summary>${this.compileContentNode(node.title).trim()}</summary>`);
		const block = this.compileBlockNode(node.block);

		this.depth = parentDepth;
		const code = [
			this.indent(`<details class="emd-collapsible">`),
			summary,
			block,
			this.indent(`</details>`)
		];

		return code.join("\n");
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
		];

		return code.join("\n");
	}

	private compileOrderedListNode(
		node: OrderedListNode
	): string {
		const parentDepth = this.depth++;
		const bodyChildren: string[] = [];

		for (const child of node.items) {
			const content = this.compileContentNode(child.item).trim();
			bodyChildren.push(this.indent(`<li class="emd-list-item">${content}</li>`));
		}

		this.depth = parentDepth;
		const code = [
			this.indent(`<ol class="emd-list emd-list--ordered">`),
			bodyChildren.join("\n"),
			this.indent("</ol>")
		];

		return code.join("\n");
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
