/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup ES dist config.
 */

import glob from 'glob';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';

// const distEs = glob.sync('dist/*.mjs');
// const distCjs = glob.sync('dist/*.cjs');

// const compiler = closureCompiler({

// });

/**
 * Overwrite files in dist/.
 */
export default [
  ...glob.sync('dist/*').map(
      (file) => ({
        input: file,
        output: {
          file: file,
          // will help with compiler inlining
          preferConst: true,
        },
        plugins: [
          closureCompiler({
            compilation_level: 'SIMPLE',
            language_in: 'ES_NEXT',
            language_out: 'NO_TRANSPILE',
          }),
        ],
      }),
  ),
];
