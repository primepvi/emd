import { type Token, TokenKind } from "../types/token.js";
import {
	type Document,
	type LayoutNode,
	type ContentNode,
	type ParagraphNode,
	type TextNode,
	type HeadingNode,
	type BoldNode,
	type ItalicNode,
	NodeKind,
	type UnorderedListNode,
	type UnorderedListItemNode,
	type ComponentNode,
	type ComponentAttributeNode,
	type EmptyLineNode,
	type LiteralNode,
} from "../types/document.js";

export class Parser {
	private cursor = 0;

	public constructor(private tokens: Token[]) { }

	public parse(): Document {
		const document: Document = {
			nodes: []
		};

		while (!this.isEof()) {
			document.nodes.push(this.parseLayoutNode());
		}

		return document;
	}

	private parseLayoutNode(): LayoutNode {
		const token = this.peek();
		switch (token.kind) {
			case TokenKind.HashTag: return this.parseHeadingNode();
			case TokenKind.Star:
			case TokenKind.Text: return this.parseParagraphNode();
			case TokenKind.Minus: return this.parseUnorderedListNode();
			case TokenKind.Identifier: return this.parseComponentNode();
			case TokenKind.NewLine: return this.parseEmptyLineNode();
			default: throw new Error(`Invalid token has received during layout node parsing: ${TokenKind[token.kind]} -> ${this.cursor}`);
		}
	}

	private parseHeadingNode(): HeadingNode {
		let level = 0;

		while (this.peek().kind == TokenKind.HashTag) {
			this.expect(TokenKind.HashTag);
			level++;
		}

		return {
			kind: NodeKind.Heading,
			level,
			content: this.parseContentNode()
		};
	}


	private parseParagraphNode(): ParagraphNode {
		const contentKinds = [TokenKind.Star, TokenKind.Text];
		const childrens: ContentNode[] = [];

		while (contentKinds.includes(this.peek().kind) && !this.isEof()) {
			childrens.push(this.parseContentNode());
		}

		return {
			kind: NodeKind.Paragraph,
			childrens
		};
	}

	private parseUnorderedListNode(): UnorderedListNode {
		const items: UnorderedListItemNode[] = [];

		while (this.peek().kind == TokenKind.Minus) {
			this.expect(TokenKind.Minus);
			items.push({
				kind: NodeKind.UnorderedListItem,
				item: this.parseContentNode()
			});
		  
			this.ignoreNewLine();
		}

		return { kind: NodeKind.UnorderedList, items };
	}

	private parseComponentNode(): ComponentNode {
		const token = this.expect(TokenKind.Identifier);
		const name = token.lexeme.slice(1);
		const attributes: ComponentAttributeNode[] = [];

		this.expect(TokenKind.OpenBrace);
		while (!this.isEof() && this.peek().kind != TokenKind.CloseBrace) {
			this.ignoreNewLine();

			let attributeName: string | null = null;
			if (this.peek(1).kind != TokenKind.Comma && this.peek(1).kind != TokenKind.CloseBrace) {
				const atom = this.expect(TokenKind.Atom);
				attributeName = atom.lexeme.slice(1);
			}

			const value = this.parseLiteralNode();
			attributes.push({ kind: NodeKind.ComponentAttribute, name: attributeName, value });

			this.ignoreNewLine();
			if (this.peek().kind == TokenKind.Comma) {
				this.expect(TokenKind.Comma);
			}
		}

		this.expect(TokenKind.CloseBrace);

		return { kind: NodeKind.Component, name, attributes };
	}

	private parseEmptyLineNode(): EmptyLineNode {
		let count = 0;
		while (this.peek().kind == TokenKind.NewLine) {
			this.eat();
			count++;
		}

		return { kind: NodeKind.EmptyLine, count };
	}

	private parseContentNode(): ContentNode {
		const token = this.peek();
		switch (token.kind) {
			case TokenKind.Text: return this.parseTextNode();
			case TokenKind.Star: {
				if (this.peek(1).kind == TokenKind.Star) return this.parseBoldNode();
				else return this.parseItalicNode();
			}
			default: throw new Error(`Invalid token has received during content node parsing: ${TokenKind[token.kind]} -> ${this.cursor}`);
		}
	}

	private parseTextNode(): TextNode {
		const { lexeme: content } = this.expect(TokenKind.Text);
		return {
			kind: NodeKind.Text,
			content
		};
	}

	private parseBoldNode(): BoldNode {
		this.expect(TokenKind.Star);
		this.expect(TokenKind.Star);

		const { lexeme: content } = this.expect(TokenKind.Text);

		this.expect(TokenKind.Star);
		this.expect(TokenKind.Star);

		return { kind: NodeKind.Bold, content };
	}

	private parseItalicNode(): ItalicNode {
		this.expect(TokenKind.Star);
		const { lexeme: content } = this.expect(TokenKind.Text);
		this.expect(TokenKind.Star);

		return { kind: NodeKind.Italic, content };
	}

	private parseLiteralNode(): LiteralNode {
		this.ignoreNewLine();

		const token = this.eat();
		switch (token.kind) {
			case TokenKind.String: {
				const value = token.lexeme.slice(1, token.lexeme.length - 1);
				return { kind: NodeKind.String, value };
			}
			case TokenKind.Boolean: {
				const value = token.lexeme == "true" ? true : false;
				return { kind: NodeKind.Boolean, value };
			}
			case TokenKind.Number: {
				const value = Number(token.lexeme);
				return { kind: NodeKind.Number, value };
			}
			case TokenKind.Atom: {
				const value = token.lexeme.slice(1);
				return { kind: NodeKind.Atom, value };
			}
			default: throw new Error(`Invalid token has received during literal node parsing: ${TokenKind[token.kind]} -> ${this.cursor}`);
		}
	}

	private expect(...kinds: TokenKind[]) {
		const token = this.eat();
		if (!kinds.includes(token.kind)) {
			throw new Error(`Expected kinds ${kinds.map(kind => TokenKind[kind]).join(", ")} but received ${TokenKind[token.kind]}.`);
		}

		return token;
	}

	private peek(offset = 0) {
		return this.tokens[this.cursor + offset]!;
	}

	private eat() {
		if (this.isEof()) return this.tokens[this.cursor]!;
		return this.tokens[this.cursor++]!;
	}

	private isEof() {
		return this.tokens[this.cursor]!.kind == TokenKind.EOF ||
			this.cursor >= this.tokens.length;
	}

	private ignoreNewLine() {
		while (this.peek().kind == TokenKind.NewLine) {
			this.expect(TokenKind.NewLine);
		}
	}
}
