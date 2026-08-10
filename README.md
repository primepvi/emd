# emd

A Markdown extension language for writing documents with custom components
and generating static HTML. 

## how to use
Build the project and generate .html from .emd document.
```console
$ pnpm build
$ pnpm exec emd examples -o build
```

The .emd files are converted into static HTML files in the build/ directory.