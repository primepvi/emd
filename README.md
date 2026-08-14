# emd

A Markdown extension language for writing documents with custom components and generating static HTML. 

## Installation
```console
$ npm i @primepvi/emd
```

## Usage
```ts
import { Compiler, DefaultProcessorRegistry, generateStyles } from "@primepvi/emd";

const source = "# Hello EMD";
const compiler = new Compiler(source, DefaultProcessorRegistry);
const { document } = compiler.compile();
console.log(document); // html code

const styles = generateStyles();
console.log(styles); // css code
```

The .emd source code are converted into HTML code.