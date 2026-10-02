// Seed programs for the explorer. Kept in a module of their own so the UI and
// the offline validator (validate_examples.mjs) exercise the same sources.

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

  'Async and generators': `async function fetchAll(urls) {
  const out = [];
  for await (const x of urls) {
    out.push(await load(x));
  }
  return out;
}

function* range(n) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}
`,

  'Modules': `import def, { named as alias } from "mod";
export const x = 1;
export default function () {}
`,
};

// Examples that are only valid as modules, so the UI can switch goals for them.
const EXAMPLE_MODULE_GOAL = {
  Modules: true,
};

export { EXAMPLES, EXAMPLE_MODULE_GOAL };
