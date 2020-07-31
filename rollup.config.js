/**
 * @license MIT
 * @file Uses Rollup for ESM bundling, primarily for dev refresh on save.
 */

import glob from 'glob';

export const exportESM = (file) => {
  return {
    input: file,
    output: {
      file: file
          .replace('exports', 'dev')
          .replace('.js', '.mjs'),
      format: 'esm',
    },
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
