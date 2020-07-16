import { bin } from './package.json';

export default {
  input: bin,
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
};
