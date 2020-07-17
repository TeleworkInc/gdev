// import { bin } from './package.json';
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: './exports.js',
  output: {
    file: 'bundle.cjs',
    format: 'cjs',
  },
  plugins: [
    shebang(),
  ],
};
