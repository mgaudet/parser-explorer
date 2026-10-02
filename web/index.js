import * as monaco from 'monaco-editor';
import { renderTree, countNodes } from './tree.js';
import './style.css';

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'javascript' || label === 'typescript') {
      return 'js/ts.worker.js';
    }
    return 'js/editor.worker.js';
  },
};

const DEFAULT_SOURCE = `// The tree on the right is SpiderMonkey's real parse tree.
// Edit this code and watch the structure change.
function greet(name) {
  const parts = ["Hello", name];
  return parts.join(", ") + "!";
}

greet("world");
`;

const EXAMPLES = {
  'Arithmetic and precedence': `1 + 2 * 3 - 4 / 2;
`,
  'Associative operators': `// The parser builds a left-leaning tree for
// associative operators like + and &&.
a + b + c + d;
x && y && z;
`,
  'Functions and arrow bodies': `function outer(a, b = 1) {
  return (x) => x * a + b;
}
`,
  'Destructuring': `const { a, b: { c } } = obj;
const [first, , ...rest] = list;
`,
  'Classes': `class Point {
  static origin = new Point(0, 0);
  #hidden = 1;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get length() { return Math.hypot(this.x, this.y); }
}
`,
  'Control flow': `for (const x of items) {
  if (x > 0) {
    continue;
  } else {
    break;
  }
}
switch (v) {
  case 1: f(); break;
  default: g();
}
`,
  'try / catch / finally': `try {
  risky();
} catch (e) {
  handle(e);
} finally {
  cleanup();
}
`,
  'Optional chaining and nullish': `a?.b?.[c] ?? (d || e);
`,
  'Template literals': 'tag`a${b}c${d}e`;\n',
  'Async / await / generators': `async function f() {
  for await (const x of src) {
    yield x;
  }
}
`,
  'Modules': `import def, { named as alias } from "mod";
export const x = 1;
export default function () {}
`,
};

const statusEl = document.getElementById('status');
const treeEl = document.getElementById('tree');
const treeMetaEl = document.getElementById('tree-meta');
const errorEl = document.getElementById('error');
const outputEl = document.getElementById('output');
const examplesEl = document.getElementById('examples');
const moduleEl = document.getElementById('as-module');

const editor = monaco.editor.create(document.getElementById('editor'), {
  value: DEFAULT_SOURCE,
  language: 'javascript',
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 13,
  scrollBeyondLastLine: false,
});

let worker = null;
let running = false;
let pending = false;
let lastTree = null;

function setStatus(text) {
  statusEl.textContent = text;
}

function highlightSelection(node) {
  if (!node || !node.extent) {
    return;
  }
  const model = editor.getModel();
  if (!model) {
    return;
  }
  const start = model.getPositionAt(node.extent.start);
  const end = model.getPositionAt(node.extent.end);
  editor.setSelection(new monaco.Selection(
    start.lineNumber, start.column, end.lineNumber, end.column));
  editor.revealRangeInCenterIfOutsideViewport(
    new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column));
}

function run() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  setStatus('Running...');

  if (!worker) {
    worker = new Worker(new URL('./worker.js', import.meta.url));
    worker.onmessage = onWorkerMessage;
    worker.onerror = (e) => {
      running = false;
      setStatus('Worker error');
      errorEl.textContent = e.message || String(e);
    };
  }

  worker.postMessage({
    source: editor.getValue(),
    wasmUrl: new URL('js.wasm', location.href).href,
    module: moduleEl.checked,
  });
}

function onWorkerMessage(e) {
  running = false;
  const { status, stdout, stderr, tree } = e.data;

  if (status) {
    setStatus(status);
    return;
  }

  errorEl.textContent = stderr || '';
  outputEl.textContent = stdout || '';

  if (tree) {
    lastTree = tree;
    renderTree(treeEl, tree, highlightSelection);
    if (tree.error) {
      treeMetaEl.textContent = '';
      setStatus('Parse error');
    } else {
      const { n, depth } = countNodes(tree);
      treeMetaEl.textContent = `${n} nodes, depth ${depth}`;
      setStatus('Parsed');
    }
  } else {
    treeMetaEl.textContent = '';
    setStatus(stderr ? 'Failed' : 'Parsed');
  }

  if (pending) {
    pending = false;
    run();
  }
}

let debounce = null;
editor.onDidChangeModelContent(() => {
  clearTimeout(debounce);
  debounce = setTimeout(run, 350);
});

moduleEl.addEventListener('change', run);

for (const name of Object.keys(EXAMPLES)) {
  const opt = document.createElement('option');
  opt.value = name;
  opt.textContent = name;
  examplesEl.appendChild(opt);
}

examplesEl.addEventListener('change', () => {
  const name = examplesEl.value;
  if (!name) {
    return;
  }
  const src = EXAMPLES[name];
  editor.setValue(src);
  if (name === 'Modules') {
    moduleEl.checked = true;
  }
  examplesEl.value = '';
  run();
});

document.getElementById('expand-all').addEventListener('click', () => {
  for (const li of treeEl.querySelectorAll('.tree-node.collapsed')) {
    li.classList.remove('collapsed');
    const t = li.querySelector(':scope > .tree-row > .twisty');
    if (t) {
      t.textContent = '\u25BE';
    }
  }
});

document.getElementById('collapse-all').addEventListener('click', () => {
  for (const li of treeEl.querySelectorAll('.tree-node')) {
    const kids = li.querySelector(':scope > .tree-children');
    if (kids) {
      li.classList.add('collapsed');
      const t = li.querySelector(':scope > .tree-row > .twisty');
      if (t) {
        t.textContent = '\u25B8';
      }
    }
  }
});

document.getElementById('clear-output').addEventListener('click', () => {
  errorEl.textContent = '';
  outputEl.textContent = '';
});

// Draggable splitter between the source and tree panes.
(function setupSplitter() {
  const splitter = document.getElementById('splitter');
  const panes = document.getElementById('panes');
  let dragging = false;

  splitter.addEventListener('mousedown', (e) => {
    dragging = true;
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) {
      return;
    }
    const rect = panes.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    panes.style.setProperty('--left-size', `${Math.min(0.85, Math.max(0.15, ratio)) * 100}%`);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
  });
})();

run();
