/* HELPER FOR IMPORT ZK-WASM */

let _print_buf = [];

function print_result() {
  // Convert the array of numbers to a string
  const result = String.fromCharCode(..._print_buf);

  _print_buf = [];

  console.log("Wasm_dbg_char result", result);
}

const __wbg_star0 = {
  abort: () => {
    console.error("abort in wasm!");
    throw new Error("Unsupported wasm api: abort");
  },
  require: (b) => {
    if (!b) {
      console.error("require failed");
      throw new Error("Require failed");
    }
  },
  wasm_dbg: (c) => {
    console.log("wasm_dbg", c);
  },
  /**
 * - Convert the number to a character
 * - Check if the character is a newline
 * - Print the accumulated result when encountering a newline
 * - Append the character to the print buffer
 */
  wasm_dbg_char: (data) =>
    String.fromCharCode(Number(data)) === "\n"
      ? print_result()
      : _print_buf.push(Number(data)),

  wasm_input: () => {
    console.error("wasm_input should not been called in non-zkwasm mode");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  wasm_output: () => {
    console.error("wasm_input should not been called in non-zkwasm mode");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  babyjubjub_sum_push: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  babyjubjub_sum_finalize: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
}
/* AUTO GENERATED BELOW */

let wasm;

let cachedBigUint64Memory0 = null;

function getBigUint64Memory0() {
    if (cachedBigUint64Memory0 === null || cachedBigUint64Memory0.byteLength === 0) {
        cachedBigUint64Memory0 = new BigUint64Array(wasm.memory.buffer);
    }
    return cachedBigUint64Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getBigUint64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {BigUint64Array} args
*/
export function initialize_game(args) {
    const ptr0 = passArray64ToWasm0(args, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.initialize_game(ptr0, len0);
}

/**
* @param {bigint} input
*/
export function step(input) {
    wasm.step(input);
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function getArrayU64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getBigUint64Memory0().subarray(ptr / 8, ptr / 8 + len);
}
/**
* @returns {BigUint64Array}
*/
export function get_game_state() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.get_game_state(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 8, 8);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function zkmain() {
    const ret = wasm.zkmain();
    return ret;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports['env'] = __wbg_star0;

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigUint64Memory0 = null;
    cachedInt32Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('gameplay_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
