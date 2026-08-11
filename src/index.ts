import { readFileSync } from "node:fs";
import { Lexer } from "./structs/Lexer.js";
import { Parser } from "./structs/Parser.js";
import { NodeKind } from "./types/document.js";

const source = readFileSync("examples/hello.emd", "utf8");

const lexer = new Lexer(source);
const tokens = lexer.lex();

const parser = new Parser(tokens);
const document = parser.parse();
for (const node of document.nodes) {
	console.log(NodeKind[node.kind], node);
}
