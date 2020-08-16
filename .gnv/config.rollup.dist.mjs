import glob from 'glob';
import shebang from 'rollup-plugin-preserve-shebang';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import disablePackages from 'rollup-plugin-disable-packages';

const PLUGINS = [
  shebang(),
  disablePackages('fsevents'),
  json(),
  nodeResolve(),
];

export default [
  /**
   * dev/*.mjs -> dist/*.mjs
   */
  ...glob.sync(
      'dev/*.mjs',
  ).map(
      (file) => ({
        input: file,
        output: {
          file: file.replace('dev', 'dist'),
          format: 'esm',
          // will help with compiler inlining
          preferConst: true,
        },
        plugins: [
          commonjs({
            transformMixedEsModules: true,
          }),
          ...PLUGINS,
        ],
      }),
  ),
  // ...glob.sync(
  //     'dist/*.mjs',
  //     {
  //       ignore: ['./dev/universal.*'],
  //     },
  // ).map((file) => ({
  //   input: file,
  //   output: {
  //     file: file.replace('dev', 'dist').replace('mjs', 'cjs'),
  //     format: 'cjs',
  //   },
  //   plugins: [
  //     ...PLUGINS,
  //   ],
  // })),
];
