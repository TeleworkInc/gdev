import shebang from 'rollup-plugin-preserve-shebang';
import exportDefault from 'rollup-plugin-export-default';
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
      // exportDefault(),
      ],
    }),
);
