/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup CJS dev config.
 */

import glob from 'glob';
import shebang from 'rollup-plugin-preserve-shebang';

export default (
  glob.sync(
      'dev/*.mjs',
      {
        ignore: ['./dev/universal.*'],
      },
  ).map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
    },
    plugins: [
      shebang(),
    ],
  }))
);
