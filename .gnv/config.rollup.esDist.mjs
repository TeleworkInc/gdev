/**
 * @license MIT
 */
/**
 * @fileoverview
 * Turn dist/*.cjs into dist/*.mjs.
 */

import shebang from 'rollup-plugin-preserve-shebang';
import commonjs from '@rollup/plugin-commonjs';
import glob from 'glob';

export default glob.sync('dist/*.cjs').map(
    (file) => ({
      input: file,
      output: {
        file: file.replace('cjs', 'mjs'),
        format: 'esm',
        // will help with compiler inlining
        preferConst: true,
      },
      plugins: [
        shebang(),
        commonjs({
          transformMixedEsModules: true,
        }),
      ],
    }),
);