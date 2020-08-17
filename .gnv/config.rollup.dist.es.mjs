/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup ES dist config.
 */

import glob from 'glob';
import { plugins } from './plugins.rollup.mjs';

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
        plugins: plugins,
      }),
  ),
];
