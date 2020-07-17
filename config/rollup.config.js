import shebang from 'rollup-plugin-preserve-shebang';
import executable from 'rollup-plugin-executable-output';

export default [
  {
    input: 'config/exports.js',
    output: [
      {
        file: 'dist/exports.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/exports.mjs',
        format: 'esm',
      },
    ],
  },
  {
    input: 'lib/cli.js',
    output: [
      {
        file: 'dist/cli.mjs',
        format: 'esm',
      },
      {
        file: 'dist/cli.cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      shebang(),
      executable(),
    ],
  },
];
