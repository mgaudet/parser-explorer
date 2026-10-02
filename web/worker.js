import { WASI } from '@wasmer/wasi';
import browserBindings from '@wasmer/wasi/lib/bindings/browser';
import { WasmFs } from '@wasmer/wasmfs';

// Workaround for "process is not defined" in the randomfill polyfill that
// @wasmer/wasi pulls in.
self.process = { browser: true };

const wasmFs = new WasmFs();
let wasmModule = null;
let firstRun = true;

const TREE_START = '__PARSE_TREE_START__';
const TREE_END = '__PARSE_TREE_END__';

// The shell parses and runs a driver script; the driver asks the engine for
// the parse tree of the user's source and prints it delimited so the wrapper
// can pull it back out of stdout.
function driver(source, moduleGoal) {
  return `
const __src = ${JSON.stringify(source)};
try {
  const tree = parseTree(__src, { module: ${moduleGoal ? 'true' : 'false'} });
  print(${JSON.stringify(TREE_START)});
  print(tree);
  print(${JSON.stringify(TREE_END)});
} catch (e) {
  print(${JSON.stringify(TREE_START)});
  print(JSON.stringify({ error: String(e && e.message || e) }));
  print(${JSON.stringify(TREE_END)});
}
`;
}

async function loadModule(wasmUrl) {
  if (!wasmModule) {
    postMessage({ status: 'Downloading and compiling js.wasm...' });
    const response = await fetch(wasmUrl);
    wasmModule = await WebAssembly.compileStreaming(response);
  }
  return wasmModule;
}

function readStream(path) {
  try {
    return wasmFs.fs.readFileSync(path).toString();
  } catch (e) {
    return '';
  }
}

function resetStreams() {
  wasmFs.volume.fds[1].position = 0;
  wasmFs.volume.fds[2].position = 0;
  wasmFs.fs.writeFileSync('/dev/stdout', '');
  wasmFs.fs.writeFileSync('/dev/stderr', '');
}

async function runDriver(driverSource, module) {
  const args = [
    'js.wasm',
    '-f',
    '/driver.js',
    // Caching the self-hosted JS keeps startup reasonable on repeat runs.
    '--selfhosted-xdr-path=/selfhosted.bin',
    '--selfhosted-xdr-mode=' + (firstRun ? 'encode' : 'decode'),
  ];

  const wasi = new WASI({
    args,
    preopens: { '/': '/' },
    env: {},
    bindings: { ...browserBindings, fs: wasmFs.fs },
  });

  const instance = await WebAssembly.instantiate(module, wasi.getImports(module));

  wasmFs.fs.writeFileSync('/driver.js', driverSource);
  resetStreams();

  try {
    wasi.start(instance);
  } catch (e) {
    if (!(e && e.code === 'ERR_WASI_EXIT')) {
      console.error(e);
    }
  }

  firstRun = false;
  return { stdout: readStream('/dev/stdout'), stderr: readStream('/dev/stderr') };
}

function extractTree(stdout) {
  const start = stdout.indexOf(TREE_START);
  const end = stdout.indexOf(TREE_END);
  if (start === -1 || end === -1 || end < start) {
    return null;
  }
  const json = stdout.slice(start + TREE_START.length, end).trim();
  try {
    return JSON.parse(json);
  } catch (e) {
    return { error: 'Could not parse tree JSON: ' + e.message };
  }
}

async function handle(source, wasmUrl, moduleGoal) {
  const module = await loadModule(wasmUrl);
  const { stdout, stderr } = await runDriver(driver(source, moduleGoal), module);

  // The delimited block is transport, not program output.
  const visible = stdout.split(TREE_START)[0];

  postMessage({
    status: '',
    stdout: visible,
    stderr,
    tree: extractTree(stdout),
  });
}

self.onmessage = function (e) {
  const { source, wasmUrl, module: moduleGoal } = e.data;
  handle(source, wasmUrl, moduleGoal).catch((err) => {
    postMessage({
      status: '',
      stdout: '',
      stderr: String((err && err.stack) || err),
      tree: null,
    });
  });
};
