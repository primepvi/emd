import { readFileSync, writeFileSync } from "node:fs";
import { Lexer } from "./structs/Lexer.js";
import { Parser } from "./structs/Parser.js";
import { NodeKind } from "./types/document.js";
import { Compiler } from "./structs/Compiler.js";
import type { ComponentProcessorRegistry } from "./types/component.js";
import { ImageComponentProcessor } from "./components/image.js";

const source = readFileSync("examples/hello.emd", "utf8");

const lexer = new Lexer(source);
const tokens = lexer.lex();

const parser = new Parser(tokens);
const document = parser.parse();

const processors: ComponentProcessorRegistry = new Map();
processors.set("image", new ImageComponentProcessor());

const compiler = new Compiler(document, processors);
const code = compiler.compile();

writeFileSync("build/hello.html", code, "utf8");
