import shebang from 'rollup-plugin-preserve-shebang';
import exportDefault from 'rollup-plugin-export-default';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/universal.cjs',
  output: {
    file: 'dist/universal.mjs',
    format: 'esm',
    // will help with compiler inlining
    preferConst: true,
  },
  plugins: [
    commonjs({
      transformMixedEsModules: true,
      esmExternals: true,
    }),
    shebang(),
    // exportDefault(),
  ],
};
