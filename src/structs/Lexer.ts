import { TokenKind, type Token } from "../types/token.js";

const LEXER_REGEXES: [TokenKind, RegExp][] = [
	[TokenKind.OpenBrace, /^\{/],
	[TokenKind.CloseBrace, /^\}/],
	[TokenKind.Comma, /^,/],
	[TokenKind.Star, /^\*/],
	[TokenKind.Escape, /^\\/],
	[TokenKind.HashTag, /^#/],
	[TokenKind.Minus, /^-/],
	[TokenKind.Major, /^>/],
	[TokenKind.Pipe, /^\|/],
	[TokenKind.Boolean, /^(true|false)/],
	[TokenKind.Atom, /^:[a-zA-Z_][a-zA-Z0-9_-]*/],
	[TokenKind.Identifier, /^@[a-zA-Z_][a-zA-Z0-9_-]*/],
	[TokenKind.Number, /^[0-9]+(?:\.[0-9]+)?/],
	[TokenKind.String, /^"(?:\\.|[^"\\])*"/],
];

export class Lexer {
	private cursor = 0;
	private tokens: Token[] = [];
	private identations: number[] = [];

	public constructor(public source: string) { }
	public lex(): Token[] {
		while (this.cursor < this.source.length) {
			this.readToken();
		}

		const dedents = this.identations.map(i => ({ kind: TokenKind.Dedent, lexeme: i.toString() }));
		this.tokens.push(...dedents);
		this.tokens.push({ kind: TokenKind.EOF, lexeme: "\0" });

		return this.tokens;
	}

	private readToken(): void {
		let currentText = this.source.slice(this.cursor);
		while (currentText.startsWith("\n\r") || currentText.startsWith("\n")) {
			currentText = currentText.slice(1);
			this.cursor++;
			this.tokens.push({ kind: TokenKind.NewLine, lexeme: "\n" });

			const line = currentText.split("\n")[0]!;
			if (line.length <= 0) continue;

			const whitespaces = line.match(/^ +/)?.[0].length ?? 0;
			const identation = this.identations[this.identations.length - 1] ?? 0;

			if (identation > whitespaces) {
				while (
					this.identations.length > 0 &&
					this.identations[this.identations.length - 1]! > whitespaces
				) {
					this.tokens.push({
						kind: TokenKind.Dedent,
						lexeme: this.identations.length.toString()
					});

					this.identations.pop();
				}
			} else if (identation < whitespaces) {
				this.tokens.push({ kind: TokenKind.Ident, lexeme: "" });
				this.identations.push(whitespaces);
			}
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
