export enum TokenKind {
	EOF = -1,
	Ident = 0,
	Dedent,

	// Punctuators
	OpenBrace,          // {
	CloseBrace,         // }
	Comma,              // ,
	Star,               // *
	Escape,             // \
	HashTag,            // #
	Minus,              // -
	Major,              // >
	Pipe,               // |

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
