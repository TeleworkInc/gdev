import shebang from 'rollup-plugin-preserve-shebang';
import executable from 'rollup-plugin-executable-output';
import common from '@rollup/plugin-commonjs';
// import importJson from '@rollup/plugin-json';
import fs from 'fs';
import path from 'path';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from '@rollup/plugin-node-resolve';
// import nodePolyfills from 'rollup-plugin-node-polyfills';


const DEFAULT_FLAGS = {
  // isolation_mode: 'iife',
  // assume_function_wrapper: true,
  language_in: 'ES_NEXT',
  language_out: 'ECMASCRIPT5_STRICT',
  compilation_level: 'SIMPLE',
  // jscomp_off: '*',
  // process_common_js_modules: true,
  // module_resolution: 'NODE',
};

// const NODE_FLAGS = {
//   ...DEFAULT_FLAGS,
//   process_common_js_modules: true,
//   module_resolution: 'NODE',
// };

const closurePlugin = (options = {}) => compiler({
  ...DEFAULT_FLAGS,
  ...options,
});

const DEFAULT_PLUGINS = [
  // resolve({ browser: true }),
  // importJson(),
  common({
    transformMixedEsModules: true,
  }),
  // nodePolyfills(),
  closurePlugin(),
];

const EXE_PLUGINS = [
  shebang(),
  ...DEFAULT_PLUGINS,
  executable(),
];

const generateSplit = (name, plugins = DEFAULT_PLUGINS) => {
  switch (name) {
    case 'cli':
      plugins = EXE_PLUGINS;
      break;
    case 'universal':
      break;
      plugins = [
        resolve({ browser: true }),
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
      {
        file: `dist/${name}.js`,
        format: 'iife',
      },
    ],
    plugins: plugins,
  };
};

const allExports = () => fs.readdirSync('exports').map(
    (file) => generateSplit(path.parse(file).name),
);

export default allExports();
