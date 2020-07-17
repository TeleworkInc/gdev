// import { bin } from './package.json';
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: './exports.js',
  output: {
    file: 'dist/node.cjs',
    format: 'cjs',
  },
  plugins: [
    shebang(),
  ],
};
