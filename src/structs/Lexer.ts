import { TokenKind, type Token } from "../types/token.js";

const LEXER_REGEXES: [TokenKind, RegExp][] = [
	[TokenKind.OpenBrace, /^\{/],
	[TokenKind.CloseBrace, /^\}/],
	[TokenKind.Comma, /^,/],

	[TokenKind.Boolean, /^(true|false)/],
	[TokenKind.Atom, /^:[a-zA-Z_][a-zA-Z0-9_-]*/],
	[TokenKind.Identifier, /^@[a-zA-Z_][a-zA-Z0-9_-]*/],
	[TokenKind.Number, /^[0-9]+(?:\.[0-9]+)?/],
	[TokenKind.String, /^"(?:\\.|[^"\\])*"/],
];

export class Lexer {
	public cursor = 0;
	public constructor(public source: string) { }

	public lex(): Token[] {
		const tokens: Token[] = [];
		while (this.cursor < this.source.length) {
			tokens.push(this.readToken());
		}

		tokens.push({ kind: TokenKind.EOF, lexeme: "\0" });
		return tokens;
	}

	private readToken(): Token {
		const currentText = this.source.slice(this.cursor);
		if (currentText.startsWith("\n")) {
			this.cursor++;
			return {
				kind: TokenKind.NewLine,
				lexeme: "\n"
			} satisfies Token;
		}

		for (const [kind, regex] of LEXER_REGEXES) {
			const match = currentText.trim().match(regex);
			if (!match) continue;

			const lexeme = match[0];
			const whitespaces = currentText.length - currentText.trim().length;
			this.cursor += whitespaces + lexeme.length;

			return {
				kind,
				lexeme
			} satisfies Token;
		}

		return this.readTextToken();
	}

	private readTextToken(): Token {
		const start = this.cursor;

		while (this.cursor < this.source.length) {
			const char = this.source[this.cursor];

			if (
				char === '@' ||
				char === '\n' ||
				char === '\r'
			) {
				break;
			}

			this.cursor++;
		}

		return {
			kind: TokenKind.Text,
			lexeme: this.source.slice(start, this.cursor)
		} satisfies Token;
	}
}
