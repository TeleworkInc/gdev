import glob from 'glob';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import { plugins } from './rollupPlugins.mjs';

const distCjs = glob.sync(
    'dist/*.mjs',
    {
      ignore: ['./dev/universal.*'],
    },
);

export default [
  ...distCjs.map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
    },
    plugins: plugins,
  })),
];
