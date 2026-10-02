#!/bin/sh
# Build the demo site into docs/ from a locally built WASI js shell.
#
# Set GECKO to your Gecko checkout if it isn't the default below. The wasm is
# produced by: MOZCONFIG=mozconfig-wasi ./mach build (see mozconfig-wasi).
#
# Output goes to docs/, which GitHub Pages serves directly (main, /docs).
set -e

GECKO="${GECKO:-$HOME/firefox}"
JS="$GECKO/obj-wasm32-unknown-wasi/dist/bin/js"

if [ ! -f "$JS" ]; then
  echo "error: $JS not found; build the WASI shell first." >&2
  echo "       MOZCONFIG=mozconfig-wasi ./mach build" >&2
  exit 1
fi

# The raw shell is ~220MB because it still carries the wasm name section and
# debug info; stripping gets it to ~11MB with no loss of behaviour.
if command -v llvm-objcopy >/dev/null 2>&1; then
  OBJCOPY=llvm-objcopy
else
  OBJCOPY="${MOZBUILD_OBJCOPY:-$HOME/.mozbuild/clang/bin/llvm-objcopy}"
fi

if [ -x "$OBJCOPY" ] || command -v "$OBJCOPY" >/dev/null 2>&1; then
  "$OBJCOPY" --strip-debug "$JS" js.wasm
else
  echo "warning: llvm-objcopy not found; copying unstripped (large)." >&2
  cp "$JS" js.wasm
fi
echo "Copied js.wasm ($(du -h ./js.wasm | cut -f1))"

npm run build

echo
echo "Built into docs/. Preview locally with:"
echo "    (cd docs && python3 -m http.server 8000)"
echo "Deploy by committing docs/ and pushing; GitHub Pages serves main /docs."
