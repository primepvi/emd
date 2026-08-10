export enum TokenKind {
	EOF = -1,

	// Punctuators
	OpenBrace = 0,      // {
	CloseBrace,         // }
	Comma,              // ,

	// Essentials
	Atom,
	Identifier,
	String,
	Number,
	Boolean,

	// Others
	Text,
	NewLine,
};

export interface Token {
	kind: TokenKind;
	lexeme: string;
};
