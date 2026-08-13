# emd

A Markdown extension language for writing documents with custom components and generating static HTML. 

## Installation
```console
$ npm i @primepvi/emd
$ pnpm add @primepvi/emd
```

## Usage
```ts
import {
   Lexer,
   Parser,
   Compiler,
   ImageComponentProcessor,
   type ComponentProcessorRegistry
} from "@primepvi/emd";

const source = "# Hello EMD";
const lexer = new Lexer(source);
const tokens = lexer.lex();

const parser = new Parser(tokens);
const ast = parser.parse();

const processors: ComponentProcessorRegistry = new Map();
processors.set("image", new ImageComponentProcessor());

const compiler = new Compiler(ast, processors);
const { links, document } = compiler.compile("assets/default.css");
console.log(links, document);
```

The .emd source code are converted into HTML code.