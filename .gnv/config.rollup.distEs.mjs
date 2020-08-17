import glob from 'glob';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import { plugins } from './rollupPlugins.mjs';

const distEs = glob.sync('dev/*.mjs');

export default [
  ...distEs.map(
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
        ],
      }),
  ),
];
