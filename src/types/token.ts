export enum TokenKind {
	EOF = -1,

	// Punctuators
	OpenBrace = 0,      // {
	CloseBrace,         // }
	Comma,              // ,
	Star,               // *
	Escape,             // \
	HashTag,            // #
	Minus,              // -

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
