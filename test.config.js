import compiler from '@ampproject/rollup-plugin-closure-compiler';
import shebang from 'rollup-plugin-preserve-shebang';
import common from '@rollup/plugin-commonjs';
import importJson from '@rollup/plugin-json';

const DEFAULT_FLAGS = {
  // isolation_mode: 'iife',
  // assume_function_wrapper: true,
  language_in: 'ES_NEXT',
  language_out: 'ECMASCRIPT5_STRICT',
  compilation_level: 'SIMPLE',
  // jscomp_off: '*',
  process_common_js_modules: true,
  module_resolution: 'NODE',
  js_output_file: 'dist/testing.js',
};

const closurePlugin = (options = {}) => compiler({
  ...DEFAULT_FLAGS,
  ...options,
});

export default {
  input: 'exports/node.js',
  output: 'dist/testing.js',
  plugins: [
    shebang(),
    common(),
    importJson(),
    closurePlugin(),
  ],
};
