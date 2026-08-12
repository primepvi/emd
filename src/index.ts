import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { Lexer } from "./structs/Lexer.js";
import { Parser } from "./structs/Parser.js";
import { NodeKind } from "./types/document.js";
import { Compiler } from "./structs/Compiler.js";
import type { ComponentProcessorRegistry } from "./types/component.js";
import { ImageComponentProcessor } from "./components/image.js";
import { TokenKind } from "./types/token.js";

const source = readFileSync("examples/hello.emd", "utf8");

const lexer = new Lexer(source);
const tokens = lexer.lex();
tokens.forEach(t => console.log(TokenKind[t.kind], t));

const parser = new Parser(tokens);
const document = parser.parse();

const processors: ComponentProcessorRegistry = new Map();
processors.set("image", new ImageComponentProcessor());

const compiler = new Compiler(document, processors);
const code = compiler.compile();

writeFileSync("build/hello.html", code, "utf8");

const css = readdirSync("styles", { recursive: true, withFileTypes: true })
	.filter(f => f.isFile() && f.name.endsWith(".css"))
	.map(f => readFileSync(`${f.parentPath}/${f.name}`, "utf8"))
	.join("\n");

writeFileSync("build/emd.css", css, "utf8");
