(This is a vibed up tool for learning...) 

SpiderMonkey Parse Tree Explorer
================================

An interactive explorer for SpiderMonkey's **real** parse tree. Edit JavaScript
in the left pane and the right pane graphs the tree the parser actually built,
running a WASI build of the JS shell in your browser.

Unlike `Reflect.parse`, this is not a lossy re-derivation of the source: the
tree comes from SpiderMonkey's internal `ParseNode` structures, so node kinds
are the real `ParseNodeKind` enumerators and children appear in the roles the
parser assigned them. That makes it a useful aid for reading the parser and for
seeing what a modification would operate on.

What the tree shows
-------------------
For each node:

  - `kind`: the internal `ParseNodeKind` name, e.g. `AssignExpr`, `AddExpr`,
    `LexicalScope`, `ForOf`
  - children under the field names used in `js/src/frontend/ParseNode.h`,
    e.g. `left`/`right`, `kid1`/`kid2`/`kid3`, `callee`/`args`, `body`
  - `extent`: the node's source range, used to highlight the code that
    produced it when you click a node
  - literal payloads: `text` for names and strings, `value` for numbers

Some shapes are worth noticing, because they are parser structure rather than
source structure:

  - `1 + 2 * 3` is an `AddExpr` whose `right` is a `MulExpr`
  - associative operators such as `a + b + c` and `x && y && z` are built as
    left-leaning `ListNode` chains, not nested binary nodes
  - `-3` is a `NegExpr` wrapping a `NumberExpr`; the parser stores the value
    unsigned
  - numeric literals are stored as doubles, so `9007199254740993` comes back as
    `9007199254740992`

Building the WASI shell
-----------------------
The demo needs a `wasm32-wasi` build of the JS shell carrying the `parseTree()`
builtin. In a Gecko checkout:

    MOZCONFIG=/path/to/this/repo/mozconfig-wasi ./mach build

`mozconfig-wasi` uses the clang and wasi sysroot that `mach bootstrap` puts in
`~/.mozbuild`, so no separate wasi-sdk download is needed. Adjust the paths at
the top of that file if your toolchain lives elsewhere. Rust's `wasm32-wasip1`
std must be available to the rustc that builds the engine.

Two details are required for a wasm build and are already set in the mozconfig:
`--disable-shared-js`, since wasm has no shared libraries, and
`--with-host-sysroot`, because the host tools still need to link natively.

Building the site
-----------------
1. `npm install`
2. `./build_local.sh` (copies the built shell to `js.wasm` and runs webpack)
3. Preview: `(cd docs && python3 -m http.server 8000)`

`build_local.sh` strips the wasm (`~220MB` -> `~11MB`) before copying it. The
stripping step removes the name section and debug info only; behaviour is
unchanged.

Deployment
----------
The site is built into `docs/`, which is committed. GitHub Pages serves it via
*Settings -> Pages -> Deploy from a branch -> `main`, folder `/docs`*. To update
the live site, rebuild and commit `docs/`.
