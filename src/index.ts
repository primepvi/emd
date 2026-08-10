import { readFileSync } from "node:fs";
import { Lexer } from "./structs/Lexer.js";
import { TokenKind } from "./types/token.js";

const source = readFileSync("examples/hello.emd", "utf8");

const lexer = new Lexer(source);
const tokens = lexer.lex();

for (const token of tokens) {
  console.log(TokenKind[token.kind], token);
}
