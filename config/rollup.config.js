// import { bin } from './package.json';
import shebang from 'rollup-plugin-preserve-shebang';

export default [
  {
    input: 'exports.mjs',
    output: {
      file: 'dist/node.cjs',
      format: 'cjs',
    },
    plugins: [
      shebang(),
    ],
  },
  {
    input: 'lib/cli.js',
    output: {
      file: 'dist/cli.cjs',
      format: 'cjs',
    },
    plugins: [
      shebang(),
    ],
  },
];
