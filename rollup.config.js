import shebang from 'rollup-plugin-preserve-shebang';
import executable from 'rollup-plugin-executable-output';
import common from '@rollup/plugin-commonjs';
import importJson from '@rollup/plugin-json';
import fs from 'fs';
import path from 'path';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from '@rollup/plugin-node-resolve';

const DEFAULT_PLUGINS = [
  common(),
  importJson(),
  // resolve(),
];

const EXE_PLUGINS = [
  shebang(),
  ...DEFAULT_PLUGINS,
  executable(),
];

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

const NODE_FLAGS = {
  process_common_js_modules: true,
  module_resolution: 'NODE',
  // externs: 'externs.js',
};

const closurePlugin = (options = {}) => compiler({
  ...DEFAULT_FLAGS,
  ...options,
});

const generateSplit = (name, plugins = DEFAULT_PLUGINS) => {
  switch (name) {
    case 'cli':
      plugins = [
        shebang(),
        closurePlugin(),
        ...EXE_PLUGINS,
      ];
      break;
    case 'universal':
      plugins = [
        resolve(),
        closurePlugin({
          compilation_level: 'ADVANCED',
        }),
      ];
      break;
  }
  return {
    input: `exports/${name}.js`,
    output: [
      {
        file: `dist/${name}.cjs`,
        format: 'cjs',
      },
      {
        file: `dist/${name}.mjs`,
        format: 'esm',
      },
    ],
    plugins: plugins,
  };
};

const allExports = () => fs.readdirSync('exports').map(
    (file) => generateSplit(path.parse(file).name),
);

export default allExports();
