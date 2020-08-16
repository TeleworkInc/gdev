import glob from 'glob';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import { plugins } from './rollupPlugins.mjs';

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
          ...plugins,
          closureCompiler({
            compilation_level: 'SIMPLE',
            language_in: 'ES_NEXT',
            language_out: 'NO_TRANSPILE',
          }),
        ],
      }),
  ),
];
