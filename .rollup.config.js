/**
 * @license MIT
 *
 * @fileoverview
 * Uses Rollup for ESM bundling, primarily for dev refresh on save.
 */

import glob from 'glob';
import shebang from 'rollup-plugin-preserve-shebang';
import exportDefault from 'rollup-plugin-export-default';

export const exportESM = (file) => {
  return {
    input: file,
    output: {
      file: file
          .replace('exports', 'dev')
          .replace('.js', '.mjs'),
      format: 'esm',
      // will help with compiler inlining
      preferConst: true,
    },
    plugins: [
      shebang(),
      exportDefault(),
    ],
  };
};

export const exportCJS = (file) => {
  return {
    input: file,
    output: {
      file: file
          .replace('exports', 'dev')
          .replace('.js', '.cjs'),
      format: 'cjs',
      preferConst: true,
    },
  };
};

export default [
  /**
   * Compile ESM builds for everything in the exports/ directory.
   */
  ...glob.sync('exports/*.js').map(exportESM),
  /**
   * Use Rollup to roll the universal CJS bundle since it will contain no Node
   * dependencies by definition.
   */
  exportCJS('exports/universal.js'),
];
