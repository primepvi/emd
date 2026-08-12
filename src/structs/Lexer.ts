import { TokenKind, type Token } from "../types/token.js";

const LEXER_REGEXES: [TokenKind, RegExp][] = [
	[TokenKind.OpenBrace, /^\{/],
	[TokenKind.CloseBrace, /^\}/],
	[TokenKind.Comma, /^,/],
	[TokenKind.Star, /^\*/],
	[TokenKind.Escape, /^\\/],
	[TokenKind.HashTag, /^#/],
	[TokenKind.Minus, /^-/],
	[TokenKind.Boolean, /^(true|false)/],
	[TokenKind.Atom, /^:[a-zA-Z_][a-zA-Z0-9_-]*/],
	[TokenKind.Identifier, /^@[a-zA-Z_][a-zA-Z0-9_-]*/],
	[TokenKind.Number, /^[0-9]+(?:\.[0-9]+)?/],
	[TokenKind.String, /^"(?:\\.|[^"\\])*"/],
];

export class Lexer {
	private cursor = 0;
	private tokens: Token[] = [];

	public constructor(public source: string) { }
	public lex(): Token[] {
		while (this.cursor < this.source.length) {
			this.readToken();
		}

		this.tokens.push({ kind: TokenKind.EOF, lexeme: "\0" });
		return this.tokens;
	}

	private readToken(): void {
		let currentText = this.source.slice(this.cursor);
		while (currentText.startsWith("\n") || currentText.startsWith("\r")) {
			this.cursor++;
			currentText = currentText.slice(1);
			this.tokens.push({ kind: TokenKind.NewLine, lexeme: "\n" });
		}

		for (const [kind, regex] of LEXER_REGEXES) {
			const match = currentText.trim().match(regex);
			if (!match) continue;

			const lexeme = match[0];
			const whitespaces = currentText.length - currentText.trim().length;
			this.cursor += whitespaces + lexeme.length;

			this.tokens.push({
				kind,
				lexeme
			});

			return;
		}

		this.tokens.push(this.readTextToken());
	}

	private readTextToken(): Token {
		const start = this.cursor;
		const exclude = ['@', '*', '\n', '\r'];

		while (this.cursor < this.source.length) {
			const char = this.source[this.cursor]!;
			if (exclude.includes(char) && this.source[this.cursor - 1] != "\\") break;
			this.cursor++;
		}

		return {
			kind: TokenKind.Text,
			lexeme: this.source.slice(start, this.cursor)
		} satisfies Token;
	}
}
