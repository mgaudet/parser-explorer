"use strict";
(globalThis["webpackChunkspidermonkey_parse_tree_demo"] ||= []).push([[4872],{

/***/ 64872
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   conf: () => (/* binding */ conf),
/* harmony export */   language: () => (/* binding */ language)
/* harmony export */ });
/* harmony import */ var _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(91457);
var _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0___namespace_object = {};
__webpack_require__.r(_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0___namespace_object);
__webpack_require__.d(_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0___namespace_object, {
	CancellationTokenSource: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.Qi),
	Emitter: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.vl),
	KeyCode: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.DD),
	KeyMod: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.QX),
	MarkerSeverity: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.cj),
	MarkerTag: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.d_),
	Position: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.yX),
	Range: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.Q6),
	Selection: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.LN),
	SelectionDirection: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.SB),
	Token: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.ou),
	Uri: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.zn),
	"default": () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.Ay),
	editor: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.EN),
	languages: () => (_editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0__.eo)
});
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, _editor_editor_api_js__WEBPACK_IMPORTED_MODULE_0___namespace_object);


// src/basic-languages/python/python.ts
var conf = {
  comments: {
    lineComment: "#",
    blockComment: ["'''", "'''"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp("^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async|match|case).*?:\\s*$"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    }
  ],
  folding: {
    offSide: true,
    markers: {
      start: new RegExp("^\\s*#region\\b"),
      end: new RegExp("^\\s*#endregion\\b")
    }
  }
};
var language = {
  defaultToken: "",
  tokenPostfix: ".python",
  keywords: [
    "False",
    "None",
    "True",
    "_",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "case",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "exec",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "match",
    "nonlocal",
    "not",
    "or",
    "pass",
    "print",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
    "int",
    "float",
    "long",
    "complex",
    "hex",
    "abs",
    "all",
    "any",
    "apply",
    "basestring",
    "bin",
    "bool",
    "buffer",
    "bytearray",
    "callable",
    "chr",
    "classmethod",
    "cmp",
    "coerce",
    "compile",
    "complex",
    "delattr",
    "dict",
    "dir",
    "divmod",
    "enumerate",
    "eval",
    "execfile",
    "file",
    "filter",
    "format",
    "frozenset",
    "getattr",
    "globals",
    "hasattr",
    "hash",
    "help",
    "id",
    "input",
    "intern",
    "isinstance",
    "issubclass",
    "iter",
    "len",
    "locals",
    "list",
    "map",
    "max",
    "memoryview",
    "min",
    "next",
    "object",
    "oct",
    "open",
    "ord",
    "pow",
    "print",
    "property",
    "reversed",
    "range",
    "raw_input",
    "reduce",
    "reload",
    "repr",
    "reversed",
    "round",
    "self",
    "set",
    "setattr",
    "slice",
    "sorted",
    "staticmethod",
    "str",
    "sum",
    "super",
    "tuple",
    "type",
    "unichr",
    "unicode",
    "vars",
    "xrange",
    "zip",
    "__dict__",
    "__methods__",
    "__members__",
    "__class__",
    "__bases__",
    "__name__",
    "__mro__",
    "__subclasses__",
    "__init__",
    "__import__"
  ],
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.bracket" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      [/[,:;]/, "delimiter"],
      [/[{}\[\]()]/, "@brackets"],
      [/@[a-zA-Z_]\w*/, "tag"],
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ]
    ],
    whitespace: [
      [/\s+/, "white"],
      [/(^#.*$)/, "comment"],
      [/'''/, "string", "@endDocString"],
      [/"""/, "string", "@endDblDocString"]
    ],
    endDocString: [
      [/[^']+/, "string"],
      [/\\'/, "string"],
      [/'''/, "string", "@popall"],
      [/'/, "string"]
    ],
    endDblDocString: [
      [/[^"]+/, "string"],
      [/\\"/, "string"],
      [/"""/, "string", "@popall"],
      [/"/, "string"]
    ],
    numbers: [
      [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, "number.hex"],
      [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, "number"]
    ],
    strings: [
      [/'$/, "string.escape", "@popall"],
      [/'/, "string.escape", "@stringBody"],
      [/"$/, "string.escape", "@popall"],
      [/"/, "string.escape", "@dblStringBody"]
    ],
    stringBody: [
      [/[^\\']+$/, "string", "@popall"],
      [/[^\\']+/, "string"],
      [/\\./, "string"],
      [/'/, "string.escape", "@popall"],
      [/\\$/, "string"]
    ],
    dblStringBody: [
      [/[^\\"]+$/, "string", "@popall"],
      [/[^\\"]+/, "string"],
      [/\\./, "string"],
      [/"/, "string.escape", "@popall"],
      [/\\$/, "string"]
    ]
  }
};



/***/ }

}]);