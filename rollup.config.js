/**
 * @license MIT
 * @file
 * Uses Rollup for ESM bundling, primarily for dev refresh on save.
 */

import path from 'path';
import glob from 'glob';

export const exportESM = (file) => {
  return {
    input: file,
    output: {
      file: file
          .replace('exports', 'dist')
          .replace('index.js', 'index.mjs'),
      format: 'esm',
    },
  };
};

export const exportCJS = (file) => {
  return {
    input: file,
    output: {
      file: file
          .replace('exports', 'dist')
          .replace('index.js', 'index.cjs'),
      format: 'esm',
    },
  };
};

export default [
  ...inputs.map(exportESM),
];

// export default [
//   /**
//    * Export ES6 modules for cli, node, and universal targets, which may be
//    * distributed.
//    */
//   exportESM('cli'),
//   exportESM('node'),
//   exportESM('universal'),
//   /**
//    * Prefer to bundle universal bundle with Rollup, since it will not depend on
//    * NodeJS packages by definition, and Rollup is more reliable. Webpack will be
//    * used to generate the CJS versions of the other ES6 modules.
//    */
//   exportCJS('universal'),
// ];
