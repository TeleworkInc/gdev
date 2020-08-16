import glob from 'glob';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import { plugins } from './rollupPlugins.mjs';

export default [
  ...glob.sync(
      'dist/*.mjs',
      {
        ignore: ['./dev/universal.*'],
      },
  ).map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
    },
    plugins: [
      ...plugins,
      closureCompiler({
        compilation_level: 'SIMPLE',
        language_in: 'ES_NEXT',
        language_out: 'NO_TRANSPILE',
      }),
    ],
  })),
];
