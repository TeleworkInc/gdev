/**
 * @license MIT
 * @file Uses Rollup for ESM bundling, primarily for dev refresh on save.
 */

import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import glob from 'glob';

const DEFAULTS = {
  plugins: [
    cjs({
      transformMixedEsModules: true,
    }),
    json(),
    resolve({
      preferBuiltins: true,
      preferConst: true,
    }),
  ],
};

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
    ...DEFAULTS,
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
    ...DEFAULTS,
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
