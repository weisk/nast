/**
 * Using import/from cause an TS error, so fallback to const/require
 */
const loadLanguages = require("prismjs/components/index")

import Prism from "prismjs"

import { escapeString } from "./util"

type LangMap = {
  [key: string]: string
}

/** 
 * The following has wrong data and is for temporary use.
 */
const languages: LangMap = {
  "html": "HTML",
  "xml": "XML",
  "svg": "SVG",
  "mathml": "MathML",
  "css": "CSS",
  "clike": "C",
  "javascript": "JavaScript",
  "abap": "ABAP",
  "abnf": "Augmented Backus–Naur form",
  "apacheconf": "Apache Configuration",
  "apl": "APL",
  "arff": "ARFF",
  "asciidoc": "AsciiDoc",
  "adoc": "AsciiDoc",
  "asm6502": "6502 Assembly",
  "aspnet": "ASP.NET (C#)",
  "autohotkey": "AutoHotkey",
  "autoit": "AutoIt",
  "shell": "Bash",
  "basic": "BASIC",
  "bnf": "Backus–Naur form",
  "rbnf": "Routing Backus–Naur form",
  "csharp": "C#",
  "cs": "C#",
  "dotnet": "C#",
  "cpp": "C++",
  "cil": "CIL",
  "coffee": "CoffeeScript",
  "cmake": "CMake",
  "csp": "Content-Security-Policy",
  "css-extras": "CSS Extras",
  "django": "Django/Jinja2",
  "jinja2": "Django/Jinja2",
  "dns-zone-file": "DNS zone file",
  "dns-zone": "DNS zone file",
  "dockerfile": "Docker",
  "ebnf": "Extended Backus–Naur form",
  "ejs": "EJS",
  "erb": "ERB",
  "fsharp": "F#",
  "gcode": "G-code",
  "gedcom": "GEDCOM",
  "glsl": "GLSL",
  "gml": "GameMaker Language",
  "gamemakerlanguage": "GameMaker Language",
  "graphql": "GraphQL",
  "hs": "Haskell",
  "hcl": "HCL",
  "http": "HTTP",
  "hpkp": "HTTP Public-Key-Pins",
  "hsts": "HTTP Strict-Transport-Security",
  "ichigojam": "IchigoJam",
  "inform7": "Inform 7",
  "javadoc": "JavaDoc",
  "javadoclike": "JavaDoc-like",
  "javastacktrace": "Java stack trace",
  "jq": "JQ",
  "jsdoc": "JSDoc",
  "js-extras": "JS Extras",
  "json": "JSON",
  "jsonp": "JSONP",
  "json5": "JSON5",
  "latex": "LaTeX",
  "tex": "TeX",
  "context": "ConTeXt",
  "lilypond": "LilyPond",
  "ly": "LilyPond",
  "emacs": "Lisp",
  "elisp": "Lisp",
  "emacs-lisp": "Lisp",
  "lolcode": "LOLCODE",
  "md": "Markdown",
  "markup-templating": "Markup templating",
  "matlab": "MATLAB",
  "mel": "MEL",
  "n1ql": "N1QL",
  "n4js": "N4JS",
  "n4jsd": "N4JS",
  "nand2tetris-hdl": "Nand To Tetris HDL",
  "nasm": "NASM",
  "nginx": "nginx",
  "nsis": "NSIS",
  "objectivec": "Objective-C",
  "ocaml": "OCaml",
  "opencl": "OpenCL",
  "parigp": "PARI/GP",
  "objectpascal": "Object Pascal",
  "pcaxis": "PC-Axis",
  "px": "PC-Axis",
  "php": "PHP",
  "phpdoc": "PHPDoc",
  "php-extras": "PHP Extras",
  "plsql": "PL/SQL",
  "powershell": "PowerShell",
  "properties": ".properties",
  "protobuf": "Protocol Buffers",
  "py": "Python",
  "q": "Q (kdb+ database)",
  "jsx": "React JSX",
  "tsx": "React TSX",
  "renpy": "Ren'py",
  "rest": "reST (reStructuredText)",
  "rb": "Ruby",
  "sas": "SAS",
  "sass": "Sass (Sass)",
  "scss": "Sass (Scss)",
  "shell-session": "Shell session",
  "soy": "Soy (Closure Template)",
  "splunk-spl": "Splunk SPL",
  "sql": "SQL",
  "tap": "TAP",
  "toml": "TOML",
  "tt2": "Template Toolkit 2",
  "ts": "TypeScript",
  "t4-cs": "T4 Text Templates (C#)",
  "t4": "T4 Text Templates (C#)",
  "t4-vb": "T4 Text Templates (VB)",
  "t4-templating": "T4 templating",
  "vbnet": "VB.Net",
  "vhdl": "VHDL",
  "vim": "vim",
  "visual-basic": "Visual Basic",
  "vb": "Visual Basic",
  "wasm": "WebAssembly",
  "wiki": "Wiki markup",
  "xeoracube": "XeoraCube",
  "xojo": "Xojo (REALbasic)",
  "xquery": "XQuery",
  "yaml": "YAML",
  "yml": "YAML"
}

/**
 * TODO: Complete the following map. The key is the string used in Notion, 
 * and the value is the one used in prismjs.
 * 
 * TODO: We should not handle Notion-specific stuffs here, instead, map
 * these strings to prismjs compatible ones in nast-util-from-notionapi.
 * 
 * To extract Notion-specific language strings, get a code block, 
 * use devtool to copy the html of language selection popup, then apply
 * this regex on the html string:
 * `<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">([^<]+)[<]`
 * 
 * On regex101, we can export the matched groups as JSON.
 */
const map: LangMap = {
  "ABAP": "abap",
  "Arduino": "arduino",
  "Bash": "shell",
  "BASIC": "basic",
  "C": "c",
  "Clojure": "clojure",
  "CoffeeScript": "coffeescript",
  "C++": "cpp",
  "C#": "csharp",
  "CSS": "css",
  "Dart": "dart",
  "Diff": "diff",
  "Docker": "docker",
  "Elixir": "elixir",
  "Elm": "elm",
  "Java": "java"
}

Object.entries(languages).forEach(pair => {
  if (!map[pair[1]]) {
    Object.defineProperty(map, pair[1], {
      value: pair[0]
    })
  }
})

function renderCode(str: string, lang: string | undefined) {
  const codeLang = getLangString(lang)
  if (lang && codeLang) {
    /**
     * Prismjs will do char escape.
     * 
     * loadLanguages can not be used with webpack.
     * https://github.com/PrismJS/prism/issues/1477
     */
    loadLanguages([codeLang])
    return Prism.highlight(str, Prism.languages[codeLang], codeLang)
  } else {
    /**
     * If user does not specify language, "lang" is undefined, so we just
     * return the plain text.
     */
    return escapeString(str)
  }
}

function getLangString(str: string | undefined) {
  if (!str) return undefined
  else {
    let lang = map[str]
    if (lang != null) return lang
    else return undefined
  }
}

export default renderCode