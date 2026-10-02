/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 91220
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _wasmer_wasi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41456);
/* harmony import */ var _wasmer_wasi_lib_bindings_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(72912);
/* harmony import */ var _wasmer_wasmfs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10079);




// Workaround for "process is not defined" in the randomfill polyfill that
// @wasmer/wasi pulls in.
self.process = { browser: true };

const wasmFs = new _wasmer_wasmfs__WEBPACK_IMPORTED_MODULE_2__/* .WasmFs */ .i();
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

  const wasi = new _wasmer_wasi__WEBPACK_IMPORTED_MODULE_0__/* .WASI */ .bJ({
    args,
    preopens: { '/': '/' },
    env: {},
    bindings: { ..._wasmer_wasi_lib_bindings_browser__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A, fs: wasmFs.fs },
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


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		let __webpack_exports__ = __webpack_require__.O(undefined, [1703], () => (__webpack_require__(91220)))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		const deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn) => {
/******/ 			if(chunkIds) {
/******/ 				deferred.push([chunkIds, fn]);
/******/ 				return;
/******/ 			}
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				let [chunkIds, fn] = deferred[i];
/******/ 				let fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if (Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					const r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	__webpack_require__.f = {};
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = (chunkId) => {
/******/ 		const promises = [];
/******/ 		__webpack_require__.f.i(chunkId, promises);
/******/ 		return Promise.all(promises);
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	// This function allow to reference async chunks and chunks that the entrypoint depends on
/******/ 	__webpack_require__.u = (chunkId) => (chunkId + ".js");
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (globalThis.importScripts) scriptUrl = globalThis.location + "";
/******/ 		const document = globalThis.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript?.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^https?:/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:|[?#].*$/g, "").replace(/\/[^/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			1220: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkspidermonkey_parse_tree_demo"] ||= [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.forEach(installChunk);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		const next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e(1703).then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;