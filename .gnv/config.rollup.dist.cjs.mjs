/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup CJS dist config.
 */

import glob from 'glob';
import { plugins } from './plugins.rollup.mjs';

const distCjs = glob.sync(
    'dist/*.mjs',
    {
      ignore: ['./dev/universal.*'],
    },
);

export default [
  ...distCjs.map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
    },
    plugins: plugins,
  })),
];
