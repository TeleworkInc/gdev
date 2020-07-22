import compiler from '@ampproject/rollup-plugin-closure-compiler';
import shebang from 'rollup-plugin-preserve-shebang';
import common from '@rollup/plugin-commonjs';
import importJson from '@rollup/plugin-json';

const DEFAULT_FLAGS = {
  // isolation_mode: 'iife',
  // assume_function_wrapper: true,
  language_in: 'ES_NEXT',
  language_out: 'ECMASCRIPT5_STRICT',
  compilation_level: 'ADVANCED',
  externs: 'externs.js',
  jscomp_off: '*',
  process_common_js_modules: true,
  module_resolution: 'NODE',
};

const closurePlugin = (options = {}) => compiler({
  ...DEFAULT_FLAGS,
  ...options,
});

export default [
  {
    input: 'exports/universal.js',
    output: 'dist/testing.js',
    plugins: [
      shebang(),
      common(),
      importJson(),
      closurePlugin(),
    ],
  },
];
